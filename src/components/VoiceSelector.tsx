import React from 'react';
import { User, Volume2, Sparkles, Heart, Star } from 'lucide-react';
import { VoicePersona, ToneStyle } from '../types.ts';

export const VOICE_PERSONAS: VoicePersona[] = [
  {
    id: 'tharuka',
    nameSi: 'තාරුකා',
    nameEn: 'Tharuka (Zephyr)',
    geminiVoice: 'Zephyr',
    gender: 'female',
    tag: '⭐ වඩාත්ම මිහිරි හඬ (Sweet & Melodic)',
    descriptionSi: 'ඉතා මිහිරි, මෘදු, සිනහමුසු සහ ආකර්ෂණීය තරුණ කාන්තා හඬ',
    descriptionEn: 'Sweet, charming, and melodious young Sri Lankan female voice with gentle smile',
    samplePhrase: 'ආයුබෝවන් යාලුවනේ! අද මම ඔයාලට කියන්න යන්නේ හරිම අපූරු කතාවක්.',
    color: 'from-amber-500/25 to-pink-500/25 border-pink-500/40 text-pink-300',
  },
  {
    id: 'sandamini',
    nameSi: 'සඳමිණි',
    nameEn: 'Sandamini (Kore)',
    geminiVoice: 'Kore',
    gender: 'female',
    tag: 'කතන්දර & මනහර (Warm & Soulful)',
    descriptionSi: 'සන්සුන්, උණුසුම්, හැඟීම්බර සහ සිත නිවන මනහර හඬ',
    descriptionEn: 'Warm, velvety, emotional, and comforting Sri Lankan female voice',
    samplePhrase: 'හවසට ඉර බැස යන වෙලාවට, මුළු පරිසරය පුරාම සාමකාමී බවක් පැතිරුණා.',
    color: 'from-emerald-500/20 to-teal-500/20 border-emerald-500/40 text-emerald-300',
  },
  {
    id: 'rasheen',
    nameSi: 'රෂීන්',
    nameEn: 'Rasheen (Fenrir)',
    geminiVoice: 'Fenrir',
    gender: 'male',
    tag: 'ගැඹුරු ආකර්ෂණීය (Deep Baritone)',
    descriptionSi: 'ප්‍රබල, ගැඹුරු, තේජවන්ත සහ ආකර්ෂණීය පිරිමි හඬ',
    descriptionEn: 'Deep, resonant, charismatic, and smooth male baritone narrator',
    samplePhrase: 'ලෝකය වෙනස් කළ ශ්‍රේෂ්ඨ සිදුවීම් පිළිබඳ ගැඹුරු විමර්ශනයක්.',
    color: 'from-purple-500/20 to-indigo-500/20 border-purple-500/40 text-purple-300',
  },
  {
    id: 'kasun',
    nameSi: 'කසුන්',
    nameEn: 'Kasun (Puck)',
    geminiVoice: 'Puck',
    gender: 'male',
    tag: 'මිත්‍රශීලී YouTube (Friendly)',
    descriptionSi: 'කඩිසර, උද්යෝගිමත් සහ යාලුවෙකු මෙන් කතා කරන තරුණ පිරිමි හඬ',
    descriptionEn: 'Energetic, bright, friendly, and relatable young male voice',
    samplePhrase: 'යාලුවනේ, අලුත්ම විස්තර දැනගන්න දැන්ම අපිත් එක්ක එකතු වෙන්න!',
    color: 'from-cyan-500/20 to-blue-500/20 border-cyan-500/40 text-cyan-300',
  },
  {
    id: 'chathura',
    nameSi: 'චතුර',
    nameEn: 'Chathura (Charon)',
    geminiVoice: 'Charon',
    gender: 'male',
    tag: 'ප්‍රවෘත්ති නිවේදන (Corporate)',
    descriptionSi: 'විධිමත්, පැහැදිලි සහ ප්‍රවීණ ගුවන්විදුලි/රූපවාහිනී නිවේදක හඬ',
    descriptionEn: 'Crisp, authoritative, professional corporate and broadcast announcer',
    samplePhrase: 'අද දවසේ විශේෂ ප්‍රවෘත්ති ප්‍රකාශය දැන් ආරම්භ වෙනවා.',
    color: 'from-amber-500/20 to-orange-500/20 border-amber-500/40 text-amber-300',
  },
];

export const TONE_STYLES: ToneStyle[] = [
  {
    id: 'sweet',
    labelSi: 'ඉතා මිහිරි / ලස්සන හඬ',
    labelEn: 'Sweet & Melodious',
    description: 'මෘදු, සිනහමුසු, මිහිරි සහ ආකර්ෂණීය හඬ විලාසය',
    instruction: 'Sweet, charming, and melodious Sri Lankan voice with warm smile and soft warmth',
  },
  {
    id: 'narration',
    labelSi: 'ස්වාභාවික කථා බහ',
    labelEn: 'Natural Spoken',
    description: 'YouTube සහ සමාජ මාධ්‍ය සඳහා සැබෑ මිනිස් කතා බහ',
    instruction: 'Natural spoken Sri Lankan conversational flow with relaxed cadence and clear diction',
  },
  {
    id: 'story',
    labelSi: 'කතන්දර හා හැඟීම්බර',
    labelEn: 'Storytelling & Soulful',
    description: 'Audiobooks සහ සංවේදී අවස්ථා සඳහා',
    instruction: 'Expressive Sri Lankan storytelling tone with gentle warmth and emotional depth',
  },
  {
    id: 'calm',
    labelSi: 'සන්සුන් / මෘදු හඬ',
    labelEn: 'Calm & Gentle',
    description: 'සිත නිවන මෙනෙහි කිරීම් සහ සුව නින්ද සඳහා',
    instruction: 'Soft, gentle, peaceful, and whisper-quiet soothing Sri Lankan voice',
  },
  {
    id: 'promo',
    labelSi: 'උද්යෝගිමත් වෙළඳ දැන්වීම්',
    labelEn: 'Energetic Commercial',
    description: 'Social media ads සහ Promo වීඩියෝ සඳහා',
    instruction: 'Upbeat, high energy, cheerful and persuasive Sri Lankan commercial voiceover',
  },
];

interface VoiceSelectorProps {
  selectedVoice: VoicePersona;
  onSelectVoice: (voice: VoicePersona) => void;
  selectedTone: ToneStyle;
  onSelectTone: (tone: ToneStyle) => void;
}

export const VoiceSelector: React.FC<VoiceSelectorProps> = ({
  selectedVoice,
  onSelectVoice,
  selectedTone,
  onSelectTone,
}) => {
  return (
    <div className="space-y-5">
      {/* Voice Personas */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-semibold text-slate-200 flex items-center gap-2">
            <Heart className="w-4 h-4 text-pink-400 fill-pink-400/20" />
            ලස්සන කටහඬක් තෝරන්න (Select Beautiful Voice)
          </label>
          <span className="text-xs text-amber-400 font-medium flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            Sri Lankan Vocal Artists
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {VOICE_PERSONAS.map((voice) => {
            const isSelected = selectedVoice.id === voice.id;
            const isTopSweet = voice.id === 'tharuka';

            return (
              <button
                key={voice.id}
                type="button"
                onClick={() => onSelectVoice(voice)}
                className={`text-left p-3.5 rounded-2xl border transition-all relative overflow-hidden flex flex-col justify-between ${
                  isSelected
                    ? `bg-slate-800/95 border-amber-500 ring-2 ring-amber-500/40 shadow-xl shadow-amber-500/10`
                    : 'bg-slate-900/70 border-slate-800/80 hover:bg-slate-800/60 hover:border-slate-700'
                }`}
              >
                {/* Top Sweet Voice Badge */}
                {isTopSweet && (
                  <div className="absolute top-0 right-0 bg-gradient-to-l from-pink-500 to-amber-500 text-slate-950 font-bold text-[9px] px-2 py-0.5 rounded-bl-lg">
                    HOT
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="font-bold text-slate-100 text-sm flex items-center gap-1.5">
                      {voice.nameSi}
                      <span className="text-xs font-normal text-slate-400">
                        ({voice.nameEn})
                      </span>
                    </span>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                        isTopSweet
                          ? 'bg-pink-500/20 text-pink-300 border-pink-500/30'
                          : 'bg-slate-800 text-amber-300 border-slate-700'
                      }`}
                    >
                      {voice.tag}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed mb-2 font-medium">
                    {voice.descriptionSi}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400">
                  <span className="truncate italic max-w-[200px] text-slate-400">
                    "{voice.samplePhrase}"
                  </span>
                  <span className="text-slate-400 font-mono text-[10px] shrink-0">
                    {voice.gender === 'female' ? '👩 ගැහැණු හඬ' : '👨 පිරිමි හඬ'}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tone & Style Selection */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-semibold text-slate-200 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            හඬෙහි මිහිරි බව හා විලාසය (Charm & Tone)
          </label>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {TONE_STYLES.map((tone) => {
            const isSelected = selectedTone.id === tone.id;
            return (
              <button
                key={tone.id}
                type="button"
                onClick={() => onSelectTone(tone)}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'bg-amber-500/15 border-amber-500 text-amber-300 ring-1 ring-amber-500/30 shadow-md'
                    : 'bg-slate-900/60 border-slate-800 hover:bg-slate-800 text-slate-300'
                }`}
              >
                <div className="font-semibold text-xs mb-0.5">{tone.labelSi}</div>
                <div className="text-[10px] text-slate-400 truncate">{tone.labelEn}</div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
