import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  RotateCw,
  Volume2,
  VolumeX,
  Download,
  Share2,
  Check,
  Headphones,
  Sparkles,
} from 'lucide-react';
import { PlaybackSpeedSlider } from './PlaybackSpeedSlider.tsx';

interface AudioPlayerProps {
  audioUrl: string | null;
  title?: string;
  voiceName?: string;
  styleName?: string;
  speed: number;
  onSpeedChange: (speed: number) => void;
  preservePitch: boolean;
  onPreservePitchChange: (preserve: boolean) => void;
  isLoading?: boolean;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({
  audioUrl,
  title = 'සිංහල හඬ පටය (Sinhala Voiceover)',
  voiceName,
  styleName,
  speed,
  onSpeedChange,
  preservePitch,
  onPreservePitchChange,
  isLoading = false,
}) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  // Sync playbackRate & pitch preservation to audio element whenever speed changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = speed;
      // Pitch preservation
      if ('preservesPitch' in audioRef.current) {
        audioRef.current.preservesPitch = preservePitch;
      }
      // Webkit fallback
      if ('webkitPreservesPitch' in audioRef.current) {
        (audioRef.current as any).webkitPreservesPitch = preservePitch;
      }
    }
  }, [speed, preservePitch]);

  // Handle new audio URL loaded
  useEffect(() => {
    if (audioRef.current && audioUrl) {
      audioRef.current.load();
      setIsPlaying(false);
      setCurrentTime(0);
    }
  }, [audioUrl]);

  // Format seconds to mm:ss
  const formatTime = (secs: number) => {
    if (isNaN(secs) || secs < 0) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // Play / Pause toggle
  const togglePlay = () => {
    if (!audioRef.current || !audioUrl) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch((err) => console.error('Playback error:', err));
    }
  };

  // Skip 5 seconds
  const skipTime = (seconds: number) => {
    if (!audioRef.current) return;
    const newTime = Math.max(0, Math.min(duration, audioRef.current.currentTime + seconds));
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  // Timeline seek
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = val;
      setCurrentTime(val);
    }
  };

  // Volume change
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (audioRef.current) {
      audioRef.current.volume = val;
    }
    if (val === 0) {
      setIsMuted(true);
    } else if (isMuted) {
      setIsMuted(false);
    }
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    if (isMuted) {
      audioRef.current.volume = volume || 1;
      setIsMuted(false);
    } else {
      audioRef.current.volume = 0;
      setIsMuted(true);
    }
  };

  // Download audio as WAV
  const handleDownload = () => {
    if (!audioUrl) return;
    const a = document.createElement('a');
    a.href = audioUrl;
    const cleanTitle = (title || 'sinhala_voiceover')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '_')
      .slice(0, 30);
    a.download = `${cleanTitle}_${voiceName || 'voice'}_${speed}x.wav`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // Share / Copy link
  const handleCopyLink = async () => {
    if (!audioUrl) return;
    try {
      await navigator.clipboard.writeText(window.location.href);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  // Draw animated waveform on canvas
  const drawWaveform = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);

    const barCount = 48;
    const barWidth = 4;
    const gap = (width - barCount * barWidth) / (barCount - 1);
    const progressPercent = duration > 0 ? currentTime / duration : 0;

    for (let i = 0; i < barCount; i++) {
      const barProgress = i / barCount;
      const isPlayed = barProgress <= progressPercent;

      // Pseudo waveform pattern
      const baseHeight = Math.sin(i * 0.35) * 0.4 + Math.cos(i * 0.15) * 0.3 + 0.5;
      let barHeight = baseHeight * (height * 0.7);

      // If playing, add subtle dynamic flutter
      if (isPlaying) {
        const timeOffset = Date.now() / 150;
        const flutter = Math.sin(timeOffset + i * 0.4) * 8;
        barHeight = Math.max(6, barHeight + flutter);
      } else {
        barHeight = Math.max(4, barHeight);
      }

      const x = i * (barWidth + gap);
      const y = (height - barHeight) / 2;

      // Gradient for played vs remaining bars
      if (isPlayed) {
        const grad = ctx.createLinearGradient(0, y, 0, y + barHeight);
        grad.addColorStop(0, '#fbbf24');
        grad.addColorStop(1, '#f97316');
        ctx.fillStyle = grad;
      } else {
        ctx.fillStyle = '#334155';
      }

      ctx.beginPath();
      ctx.roundRect(x, y, barWidth, barHeight, 2);
      ctx.fill();
    }

    if (isPlaying) {
      animationFrameRef.current = requestAnimationFrame(drawWaveform);
    }
  }, [isPlaying, currentTime, duration]);

  useEffect(() => {
    drawWaveform();
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [drawWaveform]);

  // Speed-adjusted effective listen time
  const effectiveListenTime = duration > 0 ? duration / speed : 0;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-2xl flex flex-col gap-6 relative overflow-hidden">
      {/* Background Accent Glow */}
      <div className="absolute -top-24 -right-24 w-60 h-60 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-60 h-60 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Hidden Audio Tag */}
      {audioUrl && (
        <audio
          ref={audioRef}
          src={audioUrl}
          onTimeUpdate={() => {
            if (audioRef.current) setCurrentTime(audioRef.current.currentTime);
          }}
          onLoadedMetadata={() => {
            if (audioRef.current) {
              setDuration(audioRef.current.duration);
              audioRef.current.playbackRate = speed;
            }
          }}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onEnded={() => {
            setIsPlaying(false);
            setCurrentTime(0);
          }}
        />
      )}

      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center gap-1.5">
              <Headphones className="w-3 h-3" />
              Studio Player
            </span>
            {voiceName && (
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-slate-800 text-slate-300 border border-slate-700">
                හඬ: {voiceName}
              </span>
            )}
            {styleName && (
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-slate-800 text-slate-400 border border-slate-700 hidden sm:inline">
                විලාසය: {styleName}
              </span>
            )}
          </div>
          <h3 className="text-base sm:text-lg font-bold text-slate-100 truncate max-w-md">
            {title}
          </h3>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleDownload}
            disabled={!audioUrl}
            title="WAV ශ්‍රව්‍ය ගොනුව බාගත කරන්න (Download Audio)"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-95 disabled:opacity-40 text-slate-200 text-xs font-semibold transition-all border border-slate-700 shadow-sm"
          >
            <Download className="w-3.5 h-3.5 text-amber-400" />
            <span>Download WAV</span>
          </button>

          <button
            type="button"
            onClick={handleCopyLink}
            title="ලින්ක් එක පිටපත් කරන්න"
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-300 text-xs transition-all border border-slate-700"
          >
            {isCopied ? (
              <Check className="w-4 h-4 text-emerald-400" />
            ) : (
              <Share2 className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* Waveform Visualizer Display */}
      <div className="relative bg-slate-950/80 rounded-2xl p-4 border border-slate-800/80 shadow-inner flex flex-col items-center justify-center min-h-[110px]">
        {isLoading ? (
          <div className="flex flex-col items-center gap-2 text-slate-400 py-3">
            <div className="w-6 h-6 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-xs font-medium text-amber-400 animate-pulse">
              Gemini AI මගින් හඬ සකසමින් පවතී... (Synthesizing Sinhala Voice)
            </p>
          </div>
        ) : !audioUrl ? (
          <div className="flex flex-col items-center gap-1.5 text-slate-500 py-4">
            <Sparkles className="w-5 h-5 text-amber-500/40" />
            <p className="text-xs text-center">
              Script එක ඇතුළත් කර "Generate Voiceover" ක්ලික් කරන්න
            </p>
            <p className="text-[11px] text-slate-600">
              (Enter your Sinhala script and click Generate to start playback)
            </p>
          </div>
        ) : (
          <div className="w-full">
            <canvas
              ref={canvasRef}
              width={600}
              height={70}
              className="w-full h-[70px] block cursor-pointer"
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const clickX = e.clientX - rect.left;
                const ratio = clickX / rect.width;
                if (audioRef.current && duration > 0) {
                  audioRef.current.currentTime = ratio * duration;
                  setCurrentTime(ratio * duration);
                }
              }}
            />
          </div>
        )}
      </div>

      {/* Main Playback Progress Scrubber */}
      <div className="space-y-1.5">
        <div className="relative flex items-center">
          <input
            type="range"
            min={0}
            max={duration || 100}
            step="0.1"
            value={currentTime}
            onChange={handleSeek}
            disabled={!audioUrl}
            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer focus:outline-none accent-amber-500 disabled:opacity-40"
            style={{
              background: duration
                ? `linear-gradient(to right, #f59e0b 0%, #f59e0b ${
                    (currentTime / duration) * 100
                  }%, #1e293b ${(currentTime / duration) * 100}%, #1e293b 100%)`
                : '#1e293b',
            }}
          />
        </div>

        {/* Time Labels */}
        <div className="flex justify-between items-center text-xs font-mono text-slate-400 px-0.5">
          <span>{formatTime(currentTime)}</span>
          <div className="flex items-center gap-1.5">
            {speed !== 1.0 && duration > 0 && (
              <span className="text-[11px] text-amber-400 font-sans">
                (ඇසීමට ගතවන කාලය: {formatTime(effectiveListenTime)})
              </span>
            )}
            <span className="text-slate-300 font-medium">{formatTime(duration)}</span>
          </div>
        </div>
      </div>

      {/* Audio Controls Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Playback Buttons */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => skipTime(-5)}
            disabled={!audioUrl}
            title="තත්පර 5ක් ආපසු (Skip 5s Back)"
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-95 disabled:opacity-40 text-slate-300 transition-all border border-slate-700"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={togglePlay}
            disabled={!audioUrl || isLoading}
            title={isPlaying ? 'විරාමය (Pause)' : 'වාදනය කරන්න (Play)'}
            className="w-13 h-13 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 flex items-center justify-center shadow-lg shadow-amber-500/30 active:scale-95 disabled:opacity-40 transition-all font-bold"
          >
            {isPlaying ? (
              <Pause className="w-6 h-6 fill-current" />
            ) : (
              <Play className="w-6 h-6 fill-current ml-0.5" />
            )}
          </button>

          <button
            type="button"
            onClick={() => skipTime(5)}
            disabled={!audioUrl}
            title="තත්පර 5ක් ඉදිරියට (Skip 5s Forward)"
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-95 disabled:opacity-40 text-slate-300 transition-all border border-slate-700"
          >
            <RotateCw className="w-4 h-4" />
          </button>
        </div>

        {/* Volume Controls */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <button
            type="button"
            onClick={toggleMute}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 transition-colors"
          >
            {isMuted || volume === 0 ? (
              <VolumeX className="w-4 h-4 text-red-400" />
            ) : (
              <Volume2 className="w-4 h-4 text-slate-300" />
            )}
          </button>
          <input
            type="range"
            min={0}
            max={1}
            step="0.05"
            value={isMuted ? 0 : volume}
            onChange={handleVolumeChange}
            aria-label="Volume slider"
            className="w-24 sm:w-28 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
          />
          <span className="text-xs font-mono text-slate-400 w-8 text-right">
            {Math.round((isMuted ? 0 : volume) * 100)}%
          </span>
        </div>
      </div>

      {/* Dedicated Playback Speed Slider Component */}
      <div className="pt-2">
        <PlaybackSpeedSlider
          speed={speed}
          onSpeedChange={onSpeedChange}
          preservePitch={preservePitch}
          onPreservePitchChange={onPreservePitchChange}
          disabled={!audioUrl}
        />
      </div>
    </div>
  );
};
