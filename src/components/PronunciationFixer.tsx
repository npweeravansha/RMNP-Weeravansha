import React, { useState } from 'react';
import {
  Volume2,
  Sparkles,
  Wand2,
  Settings2,
  Plus,
  Trash2,
  CheckCircle2,
  HelpCircle,
  Cpu,
  Layers,
} from 'lucide-react';

interface PronunciationFixerProps {
  script: string;
  onApplyOptimizedScript: (newScript: string) => void;
  customReplacements: Record<string, string>;
  onUpdateReplacements: (replacements: Record<string, string>) => void;
  selectedModel: 'gemini-3.8-flash-tts' | 'gemini-3.8-flash-lite-tts';
  onSelectModel: (model: 'gemini-3.8-flash-tts' | 'gemini-3.8-flash-lite-tts') => void;
  onAction: (action: 'make_spoken' | 'fix_pronunciation') => void;
  isProcessing: boolean;
}

const COMMON_SINHALA_FIXES = [
  { original: 'පිළිබඳවයි', replacement: 'ගැන තමයි', tip: 'පොත් බසින් කතා බහට' },
  { original: 'නොවේ', replacement: 'නෙවෙයි', tip: 'ස්වාභාවික කථනය' },
  { original: 'නැත', replacement: 'නෑ', tip: 'කෙටි සුමට ස්වරය' },
  { original: 'කරනු ලැබේ', replacement: 'කරනවා', tip: 'සරල ක්‍රියාපදය' },
  { original: 'AI', replacement: 'ඒ අයි', tip: 'ඉංග්‍රීසි අකුරු ශබ්දය' },
  { original: 'YouTube', replacement: 'යූ ටියුබ්', tip: 'නිරවුල් උච්චාරණය' },
  { original: 'Video', replacement: 'වීඩියෝ', tip: 'සුමට ශබ්දය' },
  { original: 'තාක්ෂණය', replacement: 'තාක්ෂණේ', tip: 'ගලායන උච්චාරණය' },
];

export const PronunciationFixer: React.FC<PronunciationFixerProps> = ({
  script,
  onApplyOptimizedScript,
  customReplacements,
  onUpdateReplacements,
  selectedModel,
  onSelectModel,
  onAction,
  isProcessing,
}) => {
  const [newOriginal, setNewOriginal] = useState('');
  const [newReplacement, setNewReplacement] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  const handleAddReplacement = () => {
    if (!newOriginal.trim() || !newReplacement.trim()) return;
    onUpdateReplacements({
      ...customReplacements,
      [newOriginal.trim()]: newReplacement.trim(),
    });
    setNewOriginal('');
    setNewReplacement('');
  };

  const handleRemoveReplacement = (word: string) => {
    const next = { ...customReplacements };
    delete next[word];
    onUpdateReplacements(next);
  };

  const handleQuickAdd = (orig: string, repl: string) => {
    onUpdateReplacements({
      ...customReplacements,
      [orig]: repl,
    });
  };

  const replacementCount = Object.keys(customReplacements).length;

  return (
    <div className="bg-slate-900 border border-amber-500/30 rounded-3xl p-5 sm:p-6 shadow-xl space-y-4 relative overflow-hidden">
      {/* Background Subtle Flare */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-slate-100 flex items-center gap-2">
              ස්වාභාවික උච්චාරණ සකසනය
              <span className="text-xs font-normal text-amber-400 font-mono">
                (Natural Speech Fixer)
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              අමුතු විදිහට ඇහෙන වචන නිවැරදි කර 100% ස්වාභාවික කථා බහක් බවට පත් කරන්න
            </p>
          </div>
        </div>

        {/* Model Quality Switch */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-950 rounded-xl border border-slate-800 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => onSelectModel('gemini-3.8-flash-tts')}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
              selectedModel === 'gemini-3.8-flash-tts'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Cpu className="w-3 h-3" />
            <span>Studio Ultra (නියම හඬ)</span>
          </button>
          <button
            type="button"
            onClick={() => onSelectModel('gemini-3.8-flash-lite-tts')}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
              selectedModel === 'gemini-3.8-flash-lite-tts'
                ? 'bg-slate-700 text-white font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Lite (වේගවත්)
          </button>
        </div>
      </div>

      {/* Main One-Click Fix Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Action 1: Make Melodious & Spoken */}
        <button
          type="button"
          onClick={() => onAction('make_spoken')}
          disabled={!script.trim() || isProcessing}
          className="p-3.5 rounded-2xl bg-gradient-to-br from-pink-500/15 via-slate-800 to-slate-900 border border-pink-500/40 hover:border-pink-400 active:scale-98 transition-all text-left flex flex-col justify-between gap-2 shadow-lg shadow-pink-500/5 group"
        >
          <div className="flex items-start justify-between">
            <span className="font-bold text-slate-100 text-xs sm:text-sm flex items-center gap-1.5 group-hover:text-pink-300 transition-colors">
              <Sparkles className="w-4 h-4 text-pink-400" />
              ඉතා මිහිරි හා ස්වාභාවික කරන්න
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-pink-500/20 text-pink-300">
              ලස්සන කටහඬක්
            </span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            පොත් බසේ රොබෝ වචන වෙනුවට කනට මිහිරි, සිනහමුසු සහ ගලායන සැබෑ මිනිස් කථා විලාසයකට හරවයි.
          </p>
        </button>

        {/* Action 2: Fix Pronunciation & English Words */}
        <button
          type="button"
          onClick={() => onAction('fix_pronunciation')}
          disabled={!script.trim() || isProcessing}
          className="p-3.5 rounded-2xl bg-gradient-to-br from-cyan-500/10 via-slate-800 to-slate-900 border border-cyan-500/30 hover:border-cyan-400/60 active:scale-98 transition-all text-left flex flex-col justify-between gap-2 shadow-lg shadow-black/20 group"
        >
          <div className="flex items-start justify-between">
            <span className="font-bold text-slate-100 text-xs sm:text-sm flex items-center gap-1.5 group-hover:text-cyan-300 transition-colors">
              <Volume2 className="w-4 h-4 text-cyan-400" />
              අමුතු වචන හා ඉලක්කම් සකසන්න
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-cyan-500/20 text-cyan-300">
              පිරිසිදු උච්චාරණය
            </span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            ඉංග්‍රීසි වචන (AI, YouTube), ඉලක්කම් (1, 10, 2026), සහ අමුතු බැඳි අකුරු නිරවුල් සිංහල ශබ්ද බවට පත් කරයි.
          </p>
        </button>

        {/* Action 3: Human Breath Pause Injector */}
        <button
          type="button"
          onClick={() => onAction('make_spoken')}
          disabled={!script.trim() || isProcessing}
          className="p-3.5 rounded-2xl bg-gradient-to-br from-amber-500/10 via-slate-800 to-slate-900 border border-amber-500/30 hover:border-amber-400/60 active:scale-98 transition-all text-left flex flex-col justify-between gap-2 shadow-lg shadow-black/20 group"
        >
          <div className="flex items-start justify-between">
            <span className="font-bold text-slate-100 text-xs sm:text-sm flex items-center gap-1.5 group-hover:text-amber-300 transition-colors">
              <Wand2 className="w-4 h-4 text-amber-400" />
              හුස්ම ගැනීමේ විරාම (Breaths)
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/20 text-amber-300">
              මිනිස් රිද්මය
            </span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            වාක්‍ය අතරට ස්වාභාවික හුස්ම ගැනීමේ විරාම (&lt;breath&gt;) යොදා හඬ එක දිගට නොනැවතී කියවීම වළක්වයි.
          </p>
        </button>
      </div>

      {/* Expandable Custom Pronunciation Replacer */}
      <div className="pt-1">
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-between p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-slate-700 text-xs text-slate-300 transition-colors"
        >
          <span className="flex items-center gap-2 font-medium">
            <Settings2 className="w-3.5 h-3.5 text-amber-400" />
            අමුතු විදිහට ඇහෙන විශේෂ වචන මාරු කරන්න (Word Pronunciation Replacer)
            {replacementCount > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 text-[10px] font-mono">
                {replacementCount} Active
              </span>
            )}
          </span>
          <span className="text-[11px] text-slate-400">
            {isExpanded ? 'සඟවන්න ▲' : 'විවෘත කරන්න ▼'}
          </span>
        </button>

        {isExpanded && (
          <div className="mt-3 p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-4 animate-in fade-in duration-150">
            {/* Quick Suggestions Chips */}
            <div>
              <span className="text-[11px] text-slate-400 block mb-1.5">
                නිතර අමුතු ලෙස ඇසෙන වචන ක්ෂණිකව එකතු කරන්න:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {COMMON_SINHALA_FIXES.map((fix, idx) => {
                  const isAdded = fix.original in customReplacements;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleQuickAdd(fix.original, fix.replacement)}
                      disabled={isAdded}
                      className={`text-[11px] px-2.5 py-1 rounded-lg border transition-all flex items-center gap-1.5 ${
                        isAdded
                          ? 'bg-emerald-950/40 text-emerald-300 border-emerald-800/60 opacity-60'
                          : 'bg-slate-900 text-slate-300 border-slate-700/60 hover:bg-slate-800 hover:border-amber-500/50'
                      }`}
                    >
                      <span>
                        {fix.original} → <strong>{fix.replacement}</strong>
                      </span>
                      {isAdded ? (
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                      ) : (
                        <Plus className="w-3 h-3 text-amber-400" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Custom Input Fields */}
            <div className="space-y-2">
              <span className="text-[11px] text-slate-400">ඔබට අවශ්‍ය අභිරුචි වචනයක් එක් කරන්න:</span>
              <div className="flex flex-col sm:flex-row items-center gap-2">
                <input
                  type="text"
                  value={newOriginal}
                  onChange={(e) => setNewOriginal(e.target.value)}
                  placeholder="අමුතු විදිහට ඇහෙන වචනය (උදා: තාක්ෂණය)"
                  className="w-full sm:flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-amber-500"
                />
                <span className="text-slate-400 text-xs hidden sm:inline">→</span>
                <input
                  type="text"
                  value={newReplacement}
                  onChange={(e) => setNewReplacement(e.target.value)}
                  placeholder="කියවිය යුතු නිවැරදි ශබ්දය (උදා: තාක්ෂණේ)"
                  className="w-full sm:flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-amber-500"
                />
                <button
                  type="button"
                  onClick={handleAddReplacement}
                  disabled={!newOriginal.trim() || !newReplacement.trim()}
                  className="w-full sm:w-auto px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-slate-950 text-xs font-bold transition-all flex items-center justify-center gap-1.5 shrink-0"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>එක් කරන්න</span>
                </button>
              </div>
            </div>

            {/* Active Replacement List */}
            {replacementCount > 0 && (
              <div className="space-y-1.5 border-t border-slate-800/80 pt-3">
                <span className="text-[11px] text-slate-400">යොදා ඇති වචන ({replacementCount}):</span>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(customReplacements).map(([orig, repl]) => (
                    <div
                      key={orig}
                      className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-900 border border-slate-700 text-xs"
                    >
                      <span className="text-slate-400 line-through">{orig}</span>
                      <span className="text-amber-400 font-semibold">{repl}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveReplacement(orig)}
                        className="text-slate-500 hover:text-red-400 ml-1 p-0.5"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
