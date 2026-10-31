import React, { useState } from 'react';
import {
  Mic2,
  Sparkles,
  Wand2,
  AlertCircle,
  HelpCircle,
  Sliders,
  CheckCircle2,
  Volume2,
} from 'lucide-react';
import { VoicePersona, ToneStyle, AudioTake } from './types.ts';
import {
  VoiceSelector,
  VOICE_PERSONAS,
  TONE_STYLES,
} from './components/VoiceSelector.tsx';
import { ScriptEditor } from './components/ScriptEditor.tsx';
import { AudioPlayer } from './components/AudioPlayer.tsx';
import { TakesHistory } from './components/TakesHistory.tsx';
import { ScriptGeneratorModal } from './components/ScriptGeneratorModal.tsx';
import { PronunciationFixer } from './components/PronunciationFixer.tsx';

export default function App() {
  // Sweet Spoken Sinhala default script with natural breathing pauses
  const [script, setScript] = useState<string>(
    'ආයුබෝවන් යාලුවනේ! <breath> අද මම ඔයාලට කියන්න යන්නේ, හරිම අපූරු සහ ලස්සන මාතෘකාවක් ගැනයි. වීඩියෝ එකට ලයික් කරලා, දිගටම අපිත් එක්ක රැඳී සිටින්න.'
  );

  const [selectedVoice, setSelectedVoice] = useState<VoicePersona>(VOICE_PERSONAS[0]);
  const [selectedTone, setSelectedTone] = useState<ToneStyle>(TONE_STYLES[0]);

  // Audio Playback & Speed Control State (Central to user request)
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [preservePitch, setPreservePitch] = useState<boolean>(true);

  // High-Fidelity Model Selection: Flagship gemini-3.8-flash-tts for supreme natural Sinhala inflection
  const [selectedModel, setSelectedModel] = useState<
    'gemini-3.8-flash-tts' | 'gemini-3.8-flash-lite-tts'
  >('gemini-3.8-flash-tts');

  // Custom word replacements dictionary for fixing tricky/weird-sounding Sinhala words
  const [customReplacements, setCustomReplacements] = useState<Record<string, string>>({
    'පිළිබඳවයි': 'ගැන තමයි',
    'AI': 'ඒ අයි',
    'YouTube': 'යූ ටියුබ්',
    'Video': 'වීඩියෝ',
    'තාක්ෂණය': 'තාක්ෂණේ',
  });

  // Audio Take state
  const [currentAudioUrl, setCurrentAudioUrl] = useState<string | null>(null);
  const [currentBase64, setCurrentBase64] = useState<string | null>(null);
  const [activeTakeId, setActiveTakeId] = useState<string | undefined>(undefined);
  const [takes, setTakes] = useState<AudioTake[]>([]);

  // Loading & status
  const [isGeneratingVoice, setIsGeneratingVoice] = useState<boolean>(false);
  const [isEnhancingScript, setIsEnhancingScript] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);
  const [isGeneratorModalOpen, setIsGeneratorModalOpen] = useState<boolean>(false);

  // Generate voice from Sinhala script using Gemini TTS with Pronunciation Normalization
  const handleGenerateVoice = async () => {
    if (!script.trim()) {
      setErrorMessage('කරුණාකර සිංහල script එකක් ඇතුළත් කරන්න (Please enter a Sinhala script)');
      return;
    }

    setIsGeneratingVoice(true);
    setErrorMessage(null);
    setSuccessNotice(null);

    try {
      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: script,
          voiceName: selectedVoice.geminiVoice,
          style: `${selectedTone.instruction}. Realistic human conversational Sinhala voice. Persona: ${selectedVoice.descriptionEn}`,
          voiceCharm: selectedVoice.descriptionEn,
          model: selectedModel,
          customReplacements,
          addBreaths: true,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to synthesize Sinhala voice');
      }

      if (data.audioBase64) {
        const audioUrl = `data:${data.mimeType || 'audio/wav'};base64,${data.audioBase64}`;
        setCurrentAudioUrl(audioUrl);
        setCurrentBase64(data.audioBase64);

        // Estimate duration based on word count (~125 wpm)
        const wordCount = script.trim().split(/\s+/).length;
        const estDuration = Math.max(3, Math.round((wordCount / 125) * 60));

        const newTake: AudioTake = {
          id: `take_${Date.now()}`,
          title: script.slice(0, 32) + (script.length > 32 ? '...' : ''),
          scriptText: script,
          voiceName: selectedVoice.nameSi,
          styleName: selectedTone.labelSi,
          audioUrl,
          base64Data: data.audioBase64,
          duration: estDuration,
          createdAt: Date.now(),
          playbackSpeed,
        };

        setTakes((prev) => [newTake, ...prev]);
        setActiveTakeId(newTake.id);
        setSuccessNotice('ස්වාභාවික සිංහල හඬ සාර්ථකව උත්පාදනය විය! (Natural audio generated)');
        setTimeout(() => setSuccessNotice(null), 4000);
      } else {
        throw new Error('No audio data received from server');
      }
    } catch (err: any) {
      console.warn('Gemini TTS error, checking browser synthesis fallback:', err);
      if ('speechSynthesis' in window) {
        try {
          const utterance = new SpeechSynthesisUtterance(script);
          utterance.rate = playbackSpeed;
          utterance.lang = 'si-LK';
          window.speechSynthesis.speak(utterance);
          setErrorMessage(
            'Gemini API සේවාව පරීක්ෂා කරමින් පවතී. Browser ශ්‍රව්‍ය පද්ධතියෙන් වාදනය කරන ලදී.'
          );
        } catch {
          setErrorMessage(err?.message || 'හඬ උත්පාදනය කිරීමේදී දෝෂයක් ඇති විය.');
        }
      } else {
        setErrorMessage(
          err?.message || 'හඬ උත්පාදනය කිරීමේදී දෝෂයක් ඇති විය. කරුණාකර නැවත උත්සාහ කරන්න.'
        );
      }
    } finally {
      setIsGeneratingVoice(false);
    }
  };

  // Enhance script with Gemini (including make_spoken and fix_pronunciation)
  const handleEnhanceScript = async (
    action: 'improve' | 'add_pauses' | 'make_spoken' | 'fix_pronunciation'
  ) => {
    if (!script.trim()) return;
    setIsEnhancingScript(true);
    setErrorMessage(null);
    setSuccessNotice(null);

    try {
      const res = await fetch('/api/enhance-script', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          text: script,
          style: selectedTone.labelEn,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to enhance script');

      if (data.result) {
        setScript(data.result);
        if (action === 'make_spoken') {
          setSuccessNotice(
            'Script එක සාර්ථකව ස්වාභාවික කථා බහ කරන බසට හරවන ලදී! (Converted to Natural Spoken Sinhala)'
          );
        } else if (action === 'fix_pronunciation') {
          setSuccessNotice(
            'අමුතු වචන සහ ඉලක්කම් උච්චාරණය නිවැරදි කරන ලදී! (Pronunciation and phonetics cleaned)'
          );
        } else {
          setSuccessNotice('Script එක සාර්ථකව ඔප්නංවන ලදී!');
        }
        setTimeout(() => setSuccessNotice(null), 4000);
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Script එක සැකසීමේදී දෝෂයක් ඇති විය.');
    } finally {
      setIsEnhancingScript(false);
    }
  };

  // Select a previously generated take
  const handleSelectTake = (take: AudioTake) => {
    setCurrentAudioUrl(take.audioUrl);
    setCurrentBase64(take.base64Data);
    setActiveTakeId(take.id);
    setScript(take.scriptText);
    setPlaybackSpeed(take.playbackSpeed || 1.0);
  };

  // Delete take
  const handleDeleteTake = (id: string) => {
    setTakes((prev) => prev.filter((t) => t.id !== id));
    if (activeTakeId === id) {
      setActiveTakeId(undefined);
    }
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col font-sans selection:bg-amber-500/30 selection:text-amber-200">
      {/* Top Navbar */}
      <header className="border-b border-slate-800/80 bg-slate-900/70 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 via-orange-500 to-amber-400 flex items-center justify-center text-slate-950 font-bold shadow-lg shadow-amber-500/20">
              <Mic2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-1.5">
                  Sinhala Voiceover Studio
                </h1>
                <span className="hidden sm:inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  Ultra-Natural AI
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                ස්වාභාවික සිංහල හඬකැවීම් සහ Playback Speed පාලක ස්ටුඩියෝව
              </p>
            </div>
          </div>

          {/* Quick Actions Header */}
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => setIsGeneratorModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all border border-slate-700 shadow-sm"
            >
              <Wand2 className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">AI Script Generator</span>
              <span className="sm:hidden">Script AI</span>
            </button>

            <button
              type="button"
              onClick={handleGenerateVoice}
              disabled={isGeneratingVoice || !script.trim()}
              className="flex items-center gap-2 px-4 sm:px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 active:scale-95 disabled:opacity-40 text-slate-950 text-xs sm:text-sm font-bold transition-all shadow-lg shadow-amber-500/25"
            >
              {isGeneratingVoice ? (
                <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
              ) : (
                <Sparkles className="w-4 h-4" />
              )}
              <span>හඬ හදන්න (Generate Voice)</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Studio Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1 w-full flex flex-col gap-6">
        {/* Error notification alert */}
        {errorMessage && (
          <div className="p-4 rounded-2xl bg-red-950/40 border border-red-800/80 text-red-200 text-xs sm:text-sm flex items-start justify-between gap-3 animate-in fade-in">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{errorMessage}</span>
            </div>
            <button
              onClick={() => setErrorMessage(null)}
              className="text-red-400 hover:text-red-200 font-bold"
            >
              ✕
            </button>
          </div>
        )}

        {/* Success toast notification */}
        {successNotice && (
          <div className="p-3.5 rounded-2xl bg-emerald-950/50 border border-emerald-500/40 text-emerald-200 text-xs sm:text-sm flex items-center justify-between gap-3 animate-in fade-in">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{successNotice}</span>
            </div>
            <button
              onClick={() => setSuccessNotice(null)}
              className="text-emerald-400 hover:text-emerald-200 font-bold text-xs"
            >
              ✕
            </button>
          </div>
        )}

        {/* Highlighted Banner: Natural Voice Fixer & Playback Speed Slider */}
        <div className="rounded-2xl bg-gradient-to-r from-amber-500/10 via-slate-900 to-cyan-500/10 border border-amber-500/20 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
              <Volume2 className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-semibold text-slate-100 flex items-center gap-2">
                ස්වාභාවික ශ්‍රී ලාංකික හඬ & Speed Controls
                <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-500/20 text-emerald-300 font-mono">
                  Gemini 3.8 Ultra Voice
                </span>
              </p>
              <p className="text-[11px] text-slate-400">
                පොත් බසින් තොරව සැබෑ මිනිස් කතා බහෙන් හඬ නිපදවයි. පහත ඇති "ස්වාභාවික උච්චාරණ සකසනය" මඟින් ඕනෑම අමුතු වචනයක් ක්ෂණිකව නිවැරදි කරගත හැක.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs font-mono text-amber-300 font-semibold px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20">
              ධාවන වේගය: {playbackSpeed.toFixed(2)}x
            </span>
          </div>
        </div>

        {/* 2-Column Responsive Workspace Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Script Editor & Natural Pronunciation Fixer (7 cols on lg) */}
          <div className="lg:col-span-7 space-y-6">
            <ScriptEditor
              script={script}
              onScriptChange={setScript}
              speedMultiplier={playbackSpeed}
              onEnhanceScript={handleEnhanceScript}
              isEnhancing={isEnhancingScript}
            />

            {/* Dedicated Pronunciation & Spoken Naturalness Fixer */}
            <PronunciationFixer
              script={script}
              onApplyOptimizedScript={setScript}
              customReplacements={customReplacements}
              onUpdateReplacements={setCustomReplacements}
              selectedModel={selectedModel}
              onSelectModel={setSelectedModel}
              onAction={handleEnhanceScript}
              isProcessing={isEnhancingScript}
            />

            {/* Voice & Tone Customization Panel */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl space-y-4">
              <VoiceSelector
                selectedVoice={selectedVoice}
                onSelectVoice={setSelectedVoice}
                selectedTone={selectedTone}
                onSelectTone={setSelectedTone}
              />
            </div>
          </div>

          {/* Right Column: Audio Player Deck with Playback Speed Slider & History (5 cols on lg) */}
          <div className="lg:col-span-5 space-y-6 sticky top-24">
            <AudioPlayer
              audioUrl={currentAudioUrl}
              title={
                script.trim()
                  ? script.slice(0, 36) + (script.length > 36 ? '...' : '')
                  : 'සිංහල හඬ පටය (Sinhala Voiceover)'
              }
              voiceName={selectedVoice.nameSi}
              styleName={selectedTone.labelSi}
              speed={playbackSpeed}
              onSpeedChange={setPlaybackSpeed}
              preservePitch={preservePitch}
              onPreservePitchChange={setPreservePitch}
              isLoading={isGeneratingVoice}
            />

            {/* Takes History */}
            <TakesHistory
              takes={takes}
              onSelectTake={handleSelectTake}
              onDeleteTake={handleDeleteTake}
              activeTakeId={activeTakeId}
            />

            {/* Helpful Guide Cards */}
            <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 text-xs text-slate-400 space-y-2">
              <div className="flex items-center gap-1.5 font-semibold text-slate-300">
                <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
                <span>හඬ ස්වාභාවික කරගැනීමේ රහස් (Tips for Natural Sinhala Voice):</span>
              </div>
              <ul className="list-disc list-inside space-y-1.5 text-[11px] leading-relaxed text-slate-400">
                <li>
                  <strong className="text-slate-200">පොත් බසින් වළකින්න:</strong> "කරනු ලැබේ", "පිළිබඳවයි" වෙනුවට "කරනවා", "ගැන" වැනි කතා කරන වචන යොදන්න.
                </li>
                <li>
                  <strong className="text-slate-200">ඉංග්‍රීසි වචන සිංහලෙන් ලියන්න:</strong> YouTube වෙනුවට "යූ ටියුබ්", AI වෙනුවට "ඒ අයි" ලිවීමෙන් 100% නිවැරදිව ශබ්ද වේ.
                </li>
                <li>
                  <strong className="text-slate-200">කොමාව (,) යොදන්න:</strong> දිගු වාක්‍ය මැදට කොමා යෙදීමෙන් හඬ නළුවා ස්වාභාවිකව හුස්ම ගනිමින් විරාම ගනී.
                </li>
                <li>
                  <strong className="text-slate-200">Playback Speed Slider:</strong> හඬෙහි ස්වාභාවිකත්වයට හානි නොවී වේගය 0.75x සිට 2.0x දක්වා සකසා ගන්න.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      {/* Script Generator Modal */}
      <ScriptGeneratorModal
        isOpen={isGeneratorModalOpen}
        onClose={() => setIsGeneratorModalOpen(false)}
        onApplyScript={(newScript) => setScript(newScript)}
      />

      {/* Footer */}
      <footer className="border-t border-slate-800/80 py-4 text-center text-xs text-slate-400">
        <p>
          Sinhala Voiceover Studio • Ultra-Natural Sri Lankan Voice Engine & Real-time Playback Speed Slider
        </p>
      </footer>
    </div>
  );
}
