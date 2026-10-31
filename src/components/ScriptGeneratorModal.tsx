import React, { useState } from 'react';
import { Sparkles, X, Wand2, Lightbulb } from 'lucide-react';

interface ScriptGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyScript: (script: string) => void;
}

const TOPIC_SUGGESTIONS = [
  'YouTube වීඩියෝවක් සඳහා AI තාක්ෂණය සහ අනාගත රැකියා පිළිබඳ හැඳින්වීමක්',
  'සෞඛ්‍ය සම්පන්න ජීවන රටාවක් සහ ජලය පානය කිරීමේ වැදගත්කම පිළිබඳ කතාවක්',
  'ශ්‍රී ලංකාවේ සුන්දර සංචාරක ස්ථානයක් පිළිබඳ කෙටි වාර්තාමය හඬකැවීමක්',
  'නවීන ඇඳුම් පැළඳුම් අලෙවි සැලක් සඳහා ආකර්ෂණීය වෙළඳ දැන්වීමක්',
];

export const ScriptGeneratorModal: React.FC<ScriptGeneratorModalProps> = ({
  isOpen,
  onClose,
  onApplyScript,
}) => {
  const [topic, setTopic] = useState('');
  const [style, setStyle] = useState('YouTube Narration');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedScript, setGeneratedScript] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    setIsGenerating(true);
    setError(null);

    try {
      const res = await fetch('/api/enhance-script', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'generate',
          prompt: topic,
          style,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to generate script');
      }

      setGeneratedScript(data.result || '');
    } catch (err: any) {
      setError(err?.message || 'Error occurred while generating script');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleApply = () => {
    if (generatedScript) {
      onApplyScript(generatedScript);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-xl p-5 sm:p-6 shadow-2xl relative flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Wand2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100">
                AI මගින් සිංහල Script එකක් නිර්මාණය කරන්න
              </h3>
              <p className="text-xs text-slate-400">Generate a voiceover script with Gemini</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Input Topic */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-300">
            ඔබේ වීඩියෝව හෝ අන්තර්ගතය කුමක් ගැනද? (Enter topic or idea)
          </label>
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="උදා: YouTube වීඩියෝවක් සඳහා තාක්ෂණය ගැන හැඳින්වීමක්..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-amber-500"
          />
        </div>

        {/* Quick Topic Chips */}
        <div className="space-y-1.5">
          <span className="text-[11px] text-slate-400 flex items-center gap-1">
            <Lightbulb className="w-3 h-3 text-amber-400" /> යෝජනා (Suggestions):
          </span>
          <div className="flex flex-wrap gap-1.5">
            {TOPIC_SUGGESTIONS.map((sug, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setTopic(sug)}
                className="text-[11px] text-left px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-800 text-slate-300 border border-slate-700/60 truncate max-w-full"
              >
                {sug}
              </button>
            ))}
          </div>
        </div>

        {/* Style Selector */}
        <div className="flex items-center gap-3 text-xs">
          <span className="text-slate-400">විලාසය (Format):</span>
          <select
            value={style}
            onChange={(e) => setStyle(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-slate-200 focus:outline-none focus:border-amber-500"
          >
            <option value="YouTube Narration">YouTube වීඩියෝ හැඳින්වීම (YouTube Intro)</option>
            <option value="Storytelling">කතන්දර / නවකතා (Storytelling)</option>
            <option value="Commercial Ad">වෙළඳ දැන්වීම (Ad Promo)</option>
            <option value="Documentary">වාර්තාමය වැඩසටහන් (Documentary)</option>
          </select>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-950/40 border border-red-800/60 text-xs text-red-300">
            {error}
          </div>
        )}

        {/* Generated Script Result Preview */}
        {generatedScript && (
          <div className="space-y-1.5 animate-in fade-in">
            <label className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> නිර්මාණය කළ Script එක:
            </label>
            <textarea
              value={generatedScript}
              onChange={(e) => setGeneratedScript(e.target.value)}
              rows={5}
              className="w-full bg-slate-950 border border-emerald-500/30 rounded-xl p-3 text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
            />
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
          >
            අවලංගු කරන්න (Cancel)
          </button>

          {!generatedScript ? (
            <button
              type="button"
              onClick={handleGenerate}
              disabled={!topic.trim() || isGenerating}
              className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 disabled:opacity-40 text-slate-950 text-xs font-bold transition-all shadow-md shadow-amber-500/20"
            >
              {isGenerating ? (
                <span className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
              ) : (
                <Sparkles className="w-3.5 h-3.5" />
              )}
              <span>Script එක හදන්න (Generate)</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={handleApply}
              className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 text-xs font-bold transition-all shadow-md shadow-emerald-500/20"
            >
              <Wand2 className="w-3.5 h-3.5" />
              <span>Studio එකට යොදන්න (Apply to Editor)</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
