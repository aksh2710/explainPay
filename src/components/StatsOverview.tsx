import React from 'react';
import { Language, TransactionRecord } from '../types';
import { translations } from '../utils/translations';
import { ShieldCheck, AlertTriangle, ShieldAlert, Zap, BarChart3 } from 'lucide-react';

interface StatsOverviewProps {
  history: TransactionRecord[];
  lang: Language;
}

export const StatsOverview: React.FC<StatsOverviewProps> = ({ history, lang }) => {
  const t = translations[lang];

  const total = history.length;
  const allowCount = history.filter((h) => h.decision === 'ALLOW').length;
  const warnCount = history.filter((h) => h.decision === 'WARN').length;
  const blockCount = history.filter((h) => h.decision === 'BLOCK').length;

  const avgLatency =
    total > 0
      ? (history.reduce((sum, h) => sum + h.responseTimeMs, 0) / total).toFixed(1)
      : '0.0';

  const allowPct = total > 0 ? Math.round((allowCount / total) * 100) : 0;
  const warnPct = total > 0 ? Math.round((warnCount / total) * 100) : 0;
  const blockPct = total > 0 ? Math.round((blockCount / total) * 100) : 0;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {/* Stat 1: Total & Allow */}
      <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-md flex flex-col justify-between">
        <div className="flex items-center justify-between text-slate-400">
          <span className="text-xs font-semibold uppercase tracking-wider">
            {t.allowedCount}
          </span>
          <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <ShieldCheck className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline justify-between">
          <span className="text-2xl sm:text-3xl font-extrabold text-emerald-400">
            {allowCount}
          </span>
          <span className="text-xs font-medium text-emerald-500/80">
            {allowPct}% of total
          </span>
        </div>
        <div className="w-full bg-slate-800 rounded-full h-1 mt-2.5">
          <div
            className="bg-emerald-500 h-1 rounded-full transition-all duration-500"
            style={{ width: `${allowPct}%` }}
          />
        </div>
      </div>

      {/* Stat 2: Warn */}
      <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-md flex flex-col justify-between">
        <div className="flex items-center justify-between text-slate-400">
          <span className="text-xs font-semibold uppercase tracking-wider">
            {t.warnedCount}
          </span>
          <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <AlertTriangle className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline justify-between">
          <span className="text-2xl sm:text-3xl font-extrabold text-amber-400">
            {warnCount}
          </span>
          <span className="text-xs font-medium text-amber-500/80">
            {warnPct}% of total
          </span>
        </div>
        <div className="w-full bg-slate-800 rounded-full h-1 mt-2.5">
          <div
            className="bg-amber-500 h-1 rounded-full transition-all duration-500"
            style={{ width: `${warnPct}%` }}
          />
        </div>
      </div>

      {/* Stat 3: Block */}
      <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-md flex flex-col justify-between">
        <div className="flex items-center justify-between text-slate-400">
          <span className="text-xs font-semibold uppercase tracking-wider">
            {t.blockedCount}
          </span>
          <div className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <ShieldAlert className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline justify-between">
          <span className="text-2xl sm:text-3xl font-extrabold text-rose-400">
            {blockCount}
          </span>
          <span className="text-xs font-medium text-rose-500/80">
            {blockPct}% of total
          </span>
        </div>
        <div className="w-full bg-slate-800 rounded-full h-1 mt-2.5">
          <div
            className="bg-rose-500 h-1 rounded-full transition-all duration-500"
            style={{ width: `${blockPct}%` }}
          />
        </div>
      </div>

      {/* Stat 4: Avg Response Time */}
      <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-md flex flex-col justify-between">
        <div className="flex items-center justify-between text-slate-400">
          <span className="text-xs font-semibold uppercase tracking-wider">
            {t.avgResponseTime}
          </span>
          <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <Zap className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline justify-between">
          <span className="text-2xl sm:text-3xl font-extrabold text-cyan-400 font-mono">
            {avgLatency} <span className="text-xs font-sans text-slate-400">ms</span>
          </span>
          <span className="text-xs font-medium text-slate-400">
            {total} total ops
          </span>
        </div>
        <div className="w-full bg-slate-800 rounded-full h-1 mt-2.5">
          <div
            className="bg-cyan-500 h-1 rounded-full"
            style={{ width: '100%' }}
          />
        </div>
      </div>
    </div>
  );
};
