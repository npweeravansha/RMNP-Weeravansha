import React, { useState } from 'react';
import {
  FileText,
  Sparkles,
  Languages,
  Trash2,
  Copy,
  Check,
  Clock,
  BookOpen,
} from 'lucide-react';
import { transliterateSinglishToSinhala } from '../utils/singlish.ts';

interface ScriptEditorProps {
  script: string;
  onScriptChange: (newScript: string) => void;
  speedMultiplier?: number;
  onEnhanceScript?: (action: 'improve' | 'add_pauses' | 'make_spoken' | 'fix_pronunciation') => void;
  isEnhancing?: boolean;
}

const SAMPLE_SCRIPTS = [
  {
    title: 'YouTube Intro (ස්වාභාවික කථනය)',
    text: 'ආයුබෝවන් යාලුවනේ! අද අපේ වීඩියෝ එකෙන් අපි කතා කරන්නේ, කෘත්‍රිම බුද්ධිය හෙවත් ඒ අයි තාක්ෂණයේ අලුත්ම පෙරළිය ගැනයි. වීඩියෝ එකට ලයික් කරලා, දිගටම අපිත් එක්ක රැඳී සිටින්න.',
  },
  {
    title: 'කතන්දර / Audiobook',
    text: 'ගම මැදින් ගලාගෙන යන නිස්කලංක දිය පහර අයිනේ, හරිම පැරණි නුග ගහක් තිබුණා. හවසට ඉර බැස යන වෙලාවට, මුළු පරිසරය පුරාම පැතිරුණේ පුදුමාකාර සාමකාමී නිහැඬියාවක්.',
  },
  {
    title: 'වෙළඳ දැන්වීම (Ad Promo)',
    text: 'ඔබත් ඔබේ ව්‍යාපාරය අන්තර්ජාලය හරහා ඉදිරියටම ගෙනියන්න කැමතිද? අපේ නවතම තාක්ෂණික සේවාවන් සමඟින්, අදම ඔබේ අලෙවිය දෙගුණ කරගන්න!',
  },
  {
    title: 'ප්‍රවෘත්ති නිවේදනය',
    text: 'අද දවසේ විශේෂ ප්‍රවෘත්ති ප්‍රකාශය. ආර්ථික හා සමාජීය ක්ෂේත්‍රයේ නවතම තොරතුරු සහ දෙස් විදෙස් විශේෂ පුවත් පිළිබඳ සංක්ෂිප්ත වාර්තාවක්.',
  },
];

export const ScriptEditor: React.FC<ScriptEditorProps> = ({
  script,
  onScriptChange,
  speedMultiplier = 1.0,
  onEnhanceScript,
  isEnhancing = false,
}) => {
  const [singlishInput, setSinglishInput] = useState('');
  const [showSinglishTool, setShowSinglishTool] = useState(false);
  const [copied, setCopied] = useState(false);

  // Word count & Char count
  const words = script.trim() ? script.trim().split(/\s+/).length : 0;
  const chars = script.length;

  // Average Sinhala narration rate is around 125 words per minute
  const baseMinutes = words / 125;
  const adjustedSeconds = Math.round((baseMinutes * 60) / (speedMultiplier || 1));
  const estimatedMins = Math.floor(adjustedSeconds / 60);
  const estimatedSecs = adjustedSeconds % 60;

  const handleSinglishConvert = () => {
    if (!singlishInput.trim()) return;
    const sinhala = transliterateSinglishToSinhala(singlishInput);
    if (script.trim()) {
      onScriptChange(script + ' ' + sinhala);
    } else {
      onScriptChange(sinhala);
    }
    setSinglishInput('');
  };

  const copyToClipboard = async () => {
    if (!script) return;
    await navigator.clipboard.writeText(script);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const insertPause = () => {
    onScriptChange(script + ' ... ');
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl flex flex-col gap-4">
      {/* Editor Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <FileText className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              සිංහල Script එක ඇතුළත් කරන්න
            </h3>
            <p className="text-xs text-slate-400">
              Enter or generate the Sinhala voiceover script
            </p>
          </div>
        </div>

        {/* Word Count & Duration Estimate */}
        <div className="flex items-center gap-3 text-xs font-mono text-slate-400">
          <span className="px-2.5 py-1 rounded-lg bg-slate-800/80 border border-slate-700/60">
            {words} වචන ({words} words)
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-slate-800/80 border border-slate-700/60 flex items-center gap-1.5 text-amber-300">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            ~{estimatedMins > 0 ? `${estimatedMins}m ` : ''}
            {estimatedSecs}s
          </span>
        </div>
      </div>

      {/* Quick Sample Scripts Loader */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
        <span className="text-slate-400 flex items-center gap-1 shrink-0 text-[11px]">
          <BookOpen className="w-3.5 h-3.5 text-amber-400" /> උදාහරණ Scripts:
        </span>
        {SAMPLE_SCRIPTS.map((sample, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => onScriptChange(sample.text)}
            className="px-2.5 py-1 rounded-lg bg-slate-800/70 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/60 transition-all shrink-0 active:scale-95 text-[11px]"
          >
            {sample.title}
          </button>
        ))}
      </div>

      {/* Main Textarea */}
      <div className="relative">
        <textarea
          value={script}
          onChange={(e) => onScriptChange(e.target.value)}
          placeholder="ඔබේ සිංහල script එක මෙහි ලියන්න හෝ copy කර paste කරන්න... (උදා: ආයුබෝවන්, අද අපි කතා කරන්න යන්නේ...)"
          rows={7}
          className="w-full bg-slate-950/90 border border-slate-800 rounded-2xl p-4 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 transition-all text-base sm:text-lg leading-relaxed font-normal resize-y min-h-[160px]"
        />

        {/* Textarea Bottom Action Strip */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 px-1 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowSinglishTool(!showSinglishTool)}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg border text-xs font-medium transition-all ${
                showSinglishTool
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 border-slate-700/60'
              }`}
            >
              <Languages className="w-3.5 h-3.5" />
              <span>Singlish Converter</span>
            </button>

            <button
              type="button"
              onClick={insertPause}
              title="හඬකැවීමේදී විරාමයක් එකතු කරන්න"
              className="px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-800 text-slate-300 border border-slate-700/60 text-xs transition-colors"
            >
              + විරාමයක් (Pause)
            </button>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] text-slate-400 font-mono">
              {chars} අකුරු (chars)
            </span>

            {script && (
              <>
                <button
                  type="button"
                  onClick={copyToClipboard}
                  title="Script එක පිටපත් කරන්න"
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition-colors"
                >
                  {copied ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => onScriptChange('')}
                  title="මකා දමන්න (Clear)"
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-red-950/60 text-slate-400 hover:text-red-400 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Singlish to Sinhala Input Dropdown Bar */}
      {showSinglishTool && (
        <div className="bg-slate-950/90 border border-amber-500/30 rounded-2xl p-3 sm:p-4 space-y-2 animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-amber-300 flex items-center gap-1.5">
              <Languages className="w-3.5 h-3.5 text-amber-400" />
              Singlish වලින් ටයිප් කර සිංහලට එක් කරන්න
            </span>
            <span className="text-[11px] text-slate-400">
              උදා: "suba udasanak" → "සුබ උදෑසනක්"
            </span>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="text"
              value={singlishInput}
              onChange={(e) => setSinglishInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleSinglishConvert();
                }
              }}
              placeholder="Singlish වලින් මෙතන ලියන්න (Type in English letters)..."
              className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-amber-500"
            />
            <button
              type="button"
              onClick={handleSinglishConvert}
              disabled={!singlishInput.trim()}
              className="px-3 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-slate-950 text-xs font-bold transition-all shrink-0"
            >
              සිංහලට එක් කරන්න (Add)
            </button>
          </div>
        </div>
      )}

      {/* AI Script Polish Actions */}
      {onEnhanceScript && (
        <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-800/80">
          <span className="text-[11px] text-slate-400 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-400" /> AI සහායක:
          </span>
          <button
            type="button"
            onClick={() => onEnhanceScript('make_spoken')}
            disabled={!script.trim() || isEnhancing}
            title="පොත් බසින් මිදී ස්වාභාවික කතා බහට හරවයි"
            className="px-2.5 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 disabled:opacity-40 text-xs font-medium transition-colors border border-amber-500/30 flex items-center gap-1"
          >
            <span>💬 ස්වාභාවික කථා බහට හරවන්න (Make Spoken)</span>
          </button>
          <button
            type="button"
            onClick={() => onEnhanceScript('fix_pronunciation')}
            disabled={!script.trim() || isEnhancing}
            title="ඉංග්‍රීසි වචන සහ අමුතු ශබ්ද නිවැරදි කරයි"
            className="px-2.5 py-1 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 disabled:opacity-40 text-xs font-medium transition-colors border border-cyan-500/30 flex items-center gap-1"
          >
            <span>🔊 උච්චාරණය පිරිසිදු කරන්න (Clean Phonetics)</span>
          </button>
          <button
            type="button"
            onClick={() => onEnhanceScript('add_pauses')}
            disabled={!script.trim() || isEnhancing}
            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-300 text-xs font-medium transition-colors border border-slate-700"
          >
            කථන විරාම (Pauses)
          </button>
        </div>
      )}
    </div>
  );
};
