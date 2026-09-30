import React, { useState } from 'react';
import { Decision, Language, TransactionRecord } from '../types';
import { getActionText, getDecisionBadge, translations } from '../utils/translations';
import { 
  History, 
  Search, 
  Filter, 
  Clock, 
  Trash2, 
  ExternalLink, 
  ShieldCheck, 
  AlertTriangle, 
  ShieldAlert,
  ArrowUpDown
} from 'lucide-react';

interface TransactionHistoryProps {
  history: TransactionRecord[];
  lang: Language;
  onClear: () => void;
  onSelectRecord?: (record: TransactionRecord) => void;
}

export const TransactionHistory: React.FC<TransactionHistoryProps> = ({
  history,
  lang,
  onClear,
  onSelectRecord,
}) => {
  const t = translations[lang];
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDecision, setFilterDecision] = useState<'ALL' | Decision>('ALL');

  const filteredHistory = history.filter((item) => {
    const matchesSearch =
      item.payeeUpi.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.amount.toString().includes(searchQuery) ||
      (item.payeeName && item.payeeName.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesFilter =
      filterDecision === 'ALL' || item.decision === filterDecision;

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl backdrop-blur-md flex flex-col h-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <History className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-200">
              {t.historyTitle}
            </h3>
            <p className="text-[11px] text-slate-400">
              {filteredHistory.length} of {history.length} logged events
            </p>
          </div>
        </div>

        {history.length > 0 && (
          <button
            type="button"
            onClick={onClear}
            className="text-[11px] text-slate-400 hover:text-rose-400 flex items-center gap-1 transition-colors self-start sm:self-auto py-1 px-2 rounded-lg hover:bg-slate-800/60"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>{t.clearHistory}</span>
          </button>
        )}
      </div>

      {/* Search and Filters */}
      <div className="py-3 flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by UPI ID or amount..."
            className="w-full pl-8 pr-3 py-1.5 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1 p-0.5 bg-slate-950/80 rounded-xl border border-slate-800 text-[11px]">
          {(['ALL', 'ALLOW', 'WARN', 'BLOCK'] as const).map((dec) => (
            <button
              key={dec}
              type="button"
              onClick={() => setFilterDecision(dec)}
              className={`px-2 py-1 rounded-lg font-medium transition-all ${
                filterDecision === dec
                  ? 'bg-slate-800 text-white shadow-sm font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {dec === 'ALL' ? 'All' : dec}
            </button>
          ))}
        </div>
      </div>

      {/* History Table Container */}
      <div className="flex-1 overflow-x-auto min-h-[220px]">
        {filteredHistory.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center text-slate-500 space-y-2">
            <Clock className="w-8 h-8 opacity-40" />
            <p className="text-xs">{t.historyEmpty}</p>
          </div>
        ) : (
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800/80 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                <th className="py-2.5 px-3">{t.colPayee}</th>
                <th className="py-2.5 px-3">{t.colAmount}</th>
                <th className="py-2.5 px-3">{t.colScore}</th>
                <th className="py-2.5 px-3">{t.colDecision}</th>
                <th className="py-2.5 px-3">{t.colUserAction}</th>
                <th className="py-2.5 px-3 text-right">{t.colTime}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50 text-slate-300">
              {filteredHistory.map((rec) => {
                const badge = getDecisionBadge(rec.decision, lang);
                const actionLabel = getActionText(rec.userAction, lang);

                return (
                  <tr
                    key={rec.id}
                    className="hover:bg-slate-800/40 transition-colors group cursor-default"
                  >
                    {/* Payee */}
                    <td className="py-3 px-3">
                      <div className="font-semibold text-slate-200 truncate max-w-[150px] sm:max-w-[200px]">
                        {rec.payeeUpi}
                      </div>
                      {rec.payeeName && (
                        <div className="text-[10px] text-slate-500 truncate max-w-[150px]">
                          {rec.payeeName}
                        </div>
                      )}
                    </td>

                    {/* Amount */}
                    <td className="py-3 px-3 font-semibold text-white whitespace-nowrap">
                      ₹{rec.amount.toLocaleString('en-IN')}
                    </td>

                    {/* Score */}
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-1.5">
                        <span className={`font-mono font-bold text-xs ${
                          rec.score >= 76
                            ? 'text-rose-400'
                            : rec.score >= 41
                            ? 'text-amber-400'
                            : 'text-emerald-400'
                        }`}>
                          {rec.score}
                        </span>
                        <div className="w-12 bg-slate-800 rounded-full h-1 hidden sm:block">
                          <div
                            className={`h-1 rounded-full ${
                              rec.score >= 76
                                ? 'bg-rose-500'
                                : rec.score >= 41
                                ? 'bg-amber-500'
                                : 'bg-emerald-500'
                            }`}
                            style={{ width: `${rec.score}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    {/* Decision */}
                    <td className="py-3 px-3">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold border uppercase tracking-wider ${badge.bg} ${badge.textCol} ${badge.border}`}
                      >
                        {rec.decision === 'ALLOW' && <ShieldCheck className="w-3 h-3" />}
                        {rec.decision === 'WARN' && <AlertTriangle className="w-3 h-3" />}
                        {rec.decision === 'BLOCK' && <ShieldAlert className="w-3 h-3" />}
                        {badge.text}
                      </span>
                    </td>

                    {/* User Action */}
                    <td className="py-3 px-3">
                      <span className={`text-[11px] font-medium leading-tight block ${
                        rec.userAction === 'APPROVED' || rec.userAction === 'PROCEEDED_AFTER_WARN' || rec.userAction === 'OVERRIDDEN_AND_PAID'
                          ? 'text-emerald-300'
                          : 'text-rose-300'
                      }`}>
                        {actionLabel}
                      </span>
                    </td>

                    {/* Time / Latency */}
                    <td className="py-3 px-3 text-right text-[11px] text-slate-400 whitespace-nowrap">
                      <div>{rec.timestamp}</div>
                      <div className="text-[10px] text-cyan-400/80 font-mono">
                        {rec.responseTimeMs}ms
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};
