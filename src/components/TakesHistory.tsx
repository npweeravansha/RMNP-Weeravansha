import React from 'react';
import { Play, Download, Trash2, Clock, History, Volume2 } from 'lucide-react';
import { AudioTake } from '../types.ts';

interface TakesHistoryProps {
  takes: AudioTake[];
  onSelectTake: (take: AudioTake) => void;
  onDeleteTake: (id: string) => void;
  activeTakeId?: string;
}

export const TakesHistory: React.FC<TakesHistoryProps> = ({
  takes,
  onSelectTake,
  onDeleteTake,
  activeTakeId,
}) => {
  if (takes.length === 0) {
    return null;
  }

  const formatTime = (secs: number) => {
    if (!secs || isNaN(secs)) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const formatDate = (timestamp: number) => {
    const d = new Date(timestamp);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <History className="w-4 h-4 text-amber-400" />
          <h4 className="text-sm font-bold text-slate-200">
            නිපදවූ හඬපට එකතුව (Generated Takes)
          </h4>
        </div>
        <span className="text-xs font-mono text-slate-400 px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700">
          {takes.length} Takes
        </span>
      </div>

      <div className="space-y-2 max-h-[340px] overflow-y-auto pr-1">
        {takes.map((take) => {
          const isActive = take.id === activeTakeId;
          return (
            <div
              key={take.id}
              className={`p-3 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                isActive
                  ? 'bg-amber-500/10 border-amber-500/40 ring-1 ring-amber-500/30'
                  : 'bg-slate-950/60 border-slate-800 hover:bg-slate-800/50'
              }`}
            >
              <button
                type="button"
                onClick={() => onSelectTake(take)}
                className="flex items-start gap-3 flex-1 text-left min-w-0"
              >
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                    isActive
                      ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                      : 'bg-slate-800 text-slate-300'
                  }`}
                >
                  <Play className="w-4 h-4 fill-current ml-0.5" />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-xs font-bold text-slate-200 truncate">
                      {take.voiceName} ({take.styleName})
                    </span>
                    <span className="text-[10px] text-amber-400 font-mono font-semibold">
                      {take.playbackSpeed}x
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 truncate max-w-[260px]">
                    "{take.scriptText}"
                  </p>
                  <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-500">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatTime(take.duration)}
                    </span>
                    <span>•</span>
                    <span>{formatDate(take.createdAt)}</span>
                  </div>
                </div>
              </button>

              <div className="flex items-center gap-1 shrink-0">
                <a
                  href={take.audioUrl}
                  download={`sinhala_take_${take.voiceName}_${take.playbackSpeed}x.wav`}
                  title="බාගත කරන්න (Download)"
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                </a>
                <button
                  type="button"
                  onClick={() => onDeleteTake(take.id)}
                  title="මකන්න (Delete)"
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-red-950/60 text-slate-400 hover:text-red-400 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
