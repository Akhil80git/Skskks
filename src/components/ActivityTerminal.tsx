import React, { useState, useRef, useEffect } from 'react';
import { Terminal, Trash2, ArrowDown, Pause, Play, CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { ActivityLogItem } from '../lib/types';

interface ActivityTerminalProps {
  logs: ActivityLogItem[];
  onClearLogs: () => void;
  isScanning: boolean;
}

export const ActivityTerminal: React.FC<ActivityTerminalProps> = ({
  logs,
  onClearLogs,
  isScanning,
}) => {
  const [autoScroll, setAutoScroll] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const terminalEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (autoScroll && !isPaused && terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs, autoScroll, isPaused]);

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl overflow-hidden shadow-lg flex flex-col">
      {/* Terminal Title Bar */}
      <div className="h-10 px-4 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2 text-slate-300 font-medium">
          <Terminal className="w-4 h-4 text-blue-400" />
          <span>Real-Time Scanner Activity</span>
          {isScanning && (
            <span className="flex items-center gap-1.5 text-[11px] font-mono text-emerald-400 ml-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>LIVE PROBING</span>
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsPaused((p) => !p)}
            className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors flex items-center gap-1 cursor-pointer ${
              isPaused ? 'bg-amber-950 text-amber-300 border border-amber-800' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {isPaused ? <Play className="w-3 h-3" /> : <Pause className="w-3 h-3" />}
            <span>{isPaused ? 'Resume' : 'Pause'}</span>
          </button>

          <button
            type="button"
            onClick={() => setAutoScroll((s) => !s)}
            className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors flex items-center gap-1 cursor-pointer ${
              autoScroll ? 'text-blue-400 bg-blue-950/50' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <ArrowDown className="w-3 h-3" />
            <span>Auto-scroll</span>
          </button>

          <button
            type="button"
            onClick={onClearLogs}
            title="Clear Log History"
            className="p-1 text-slate-400 hover:text-red-400 transition-colors cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Terminal Body */}
      <div className="h-44 overflow-y-auto p-3 font-mono text-xs leading-relaxed divide-y divide-slate-800/40 bg-slate-950/40">
        {logs.length === 0 ? (
          <div className="text-slate-500 py-6 text-center italic font-sans text-xs">
            Scanner ready. Select your platforms, choose a wordlist or keyword, and click "RUN SCANNER".
          </div>
        ) : (
          logs.map((log) => {
            const isHit = log.status === 'valid';
            const isMiss = log.status === 'invalid';
            const isProbing = log.status === 'probing';

            return (
              <div
                key={log.id}
                className={`py-1 flex items-center justify-between gap-3 text-[11px] ${
                  isHit
                    ? 'text-emerald-300 bg-emerald-950/30 px-2 rounded -mx-1 font-semibold'
                    : isMiss
                    ? 'text-slate-400'
                    : 'text-blue-300'
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-slate-400 shrink-0">[{log.timestamp}]</span>

                  {isHit && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
                  {isMiss && <XCircle className="w-3.5 h-3.5 text-slate-500 shrink-0" />}
                  {isProbing && <Loader2 className="w-3.5 h-3.5 text-blue-400 animate-spin shrink-0" />}

                  <span className="text-slate-400 text-[10px] uppercase font-mono px-1 rounded bg-slate-800/80 shrink-0">
                    {log.platformName}
                  </span>

                  <span className="truncate">{log.url}</span>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {log.statusCode && (
                    <span
                      className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${
                        log.statusCode === 200
                          ? 'bg-emerald-900/60 text-emerald-300 border border-emerald-700/60'
                          : log.statusCode === 404
                          ? 'bg-slate-800 text-slate-400'
                          : 'bg-amber-900/60 text-amber-300'
                      }`}
                    >
                      {log.statusCode}
                    </span>
                  )}
                  {log.latencyMs !== undefined && log.latencyMs > 0 && (
                    <span className="text-[10px] text-slate-400">{log.latencyMs}ms</span>
                  )}
                </div>
              </div>
            );
          })
        )}
        <div ref={terminalEndRef} />
      </div>
    </div>
  );
};
