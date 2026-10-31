import React from 'react';
import { Gauge, RotateCcw, Minus, Plus, Music2, Sparkles } from 'lucide-react';

interface PlaybackSpeedSliderProps {
  speed: number;
  onSpeedChange: (newSpeed: number) => void;
  preservePitch?: boolean;
  onPreservePitchChange?: (preserve: boolean) => void;
  className?: string;
  disabled?: boolean;
}

const PRESET_SPEEDS = [0.5, 0.75, 1.0, 1.25, 1.5, 1.75, 2.0];

export const PlaybackSpeedSlider: React.FC<PlaybackSpeedSliderProps> = ({
  speed,
  onSpeedChange,
  preservePitch = true,
  onPreservePitchChange,
  className = '',
  disabled = false,
}) => {
  const getSpeedLabel = (val: number) => {
    if (val < 0.75) return 'ඉතා සෙමින් (Very Slow)';
    if (val < 0.95) return 'සෙමින් (Relaxed / Story)';
    if (val <= 1.05) return 'සාමාන්‍ය වේගය (Natural Pace)';
    if (val <= 1.35) return 'YouTube / Social Media Pace';
    if (val <= 1.75) return 'වේගවත් විස්තර (Fast Narration)';
    return 'ඉතා වේගවත් (High Speed)';
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    onSpeedChange(Math.round(val * 100) / 100);
  };

  const adjustSpeed = (delta: number) => {
    const next = Math.max(0.25, Math.min(3.0, Math.round((speed + delta) * 100) / 100));
    onSpeedChange(next);
  };

  // Calculate percentage for gradient track
  const min = 0.25;
  const max = 3.0;
  const percentage = ((speed - min) / (max - min)) * 100;

  return (
    <div
      className={`bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl backdrop-blur-md transition-all ${
        disabled ? 'opacity-50 pointer-events-none' : ''
      } ${className}`}
    >
      {/* Header with Title & Value Badge */}
      <div className="flex items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <Gauge className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
              හඬ ධාවන වේගය
              <span className="text-xs font-normal text-slate-400 hidden sm:inline">
                (Playback Speed)
              </span>
            </h4>
            <p className="text-[11px] text-amber-400/90 font-medium">{getSpeedLabel(speed)}</p>
          </div>
        </div>

        {/* Speed Value Badge */}
        <div className="flex items-center gap-2">
          <div className="px-3 py-1 rounded-xl bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 text-amber-300 font-mono text-base font-bold tracking-tight shadow-inner">
            {speed.toFixed(2)}x
          </div>

          {speed !== 1.0 && (
            <button
              onClick={() => onSpeedChange(1.0)}
              title="වේගය 1.0x වෙත නැවත සකසන්න (Reset to 1.0x)"
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Slider Controls with Fine-tuning Buttons */}
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => adjustSpeed(-0.05)}
            disabled={speed <= min}
            title="-0.05x අඩු කරන්න"
            aria-label="Decrease playback speed by 0.05x"
            className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-95 disabled:opacity-40 text-slate-300 flex items-center justify-center transition-all border border-slate-700/60"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>

          {/* Interactive Range Input with dynamic gradient fill */}
          <div className="relative flex-1 flex items-center">
            <input
              type="range"
              min={min}
              max={max}
              step="0.05"
              value={speed}
              onChange={handleSliderChange}
              aria-label="Playback speed slider"
              className="w-full h-2.5 bg-slate-800 rounded-lg appearance-none cursor-pointer focus:outline-none accent-amber-500"
              style={{
                background: `linear-gradient(to right, #f59e0b 0%, #f97316 ${percentage}%, #1e293b ${percentage}%, #1e293b 100%)`,
              }}
            />
          </div>

          <button
            type="button"
            onClick={() => adjustSpeed(0.05)}
            disabled={speed >= max}
            title="+0.05x වැඩි කරන්න"
            aria-label="Increase playback speed by 0.05x"
            className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-95 disabled:opacity-40 text-slate-300 flex items-center justify-center transition-all border border-slate-700/60"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Min / Normal / Max Scale Indicators */}
        <div className="flex justify-between text-[11px] text-slate-400 font-mono px-1">
          <span>0.25x</span>
          <span className="text-slate-300 font-medium">1.0x (Normal)</span>
          <span>2.0x</span>
          <span>3.0x</span>
        </div>

        {/* Quick Speed Preset Chips */}
        <div className="pt-1">
          <div className="text-[11px] text-slate-400 mb-1.5 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>ක්ෂණික තේරීම් (Quick Presets):</span>
          </div>
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {PRESET_SPEEDS.map((preset) => {
              const isActive = Math.abs(speed - preset) < 0.02;
              return (
                <button
                  key={preset}
                  type="button"
                  onClick={() => onSpeedChange(preset)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono font-medium transition-all ${
                    isActive
                      ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20 scale-105'
                      : 'bg-slate-800/90 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700/50'
                  }`}
                >
                  {preset.toFixed(preset % 1 === 0 ? 1 : 2)}x
                </button>
              );
            })}
          </div>
        </div>

        {/* Optional Natural Voice Pitch Preservation Setting */}
        {onPreservePitchChange && (
          <div className="pt-2 mt-2 border-t border-slate-800/80 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Music2 className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-xs text-slate-300">
                ස්වභාවික හඬ ස්වරය රැකගන්න (Preserve Voice Tone)
              </span>
            </div>
            <button
              type="button"
              onClick={() => onPreservePitchChange(!preservePitch)}
              className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                preservePitch ? 'bg-amber-500' : 'bg-slate-700'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                  preservePitch ? 'translate-x-4' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
