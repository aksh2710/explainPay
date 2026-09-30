import React, { useState } from 'react';
import { Decision, Language, RiskEvaluation, UserAction } from '../types';
import { translations } from '../utils/translations';
import { RiskGauge } from './RiskGauge';
import { 
  ShieldCheck, 
  AlertTriangle, 
  ShieldAlert, 
  ArrowRight, 
  X, 
  CheckCircle2, 
  Clock, 
  Smartphone, 
  MapPin, 
  UserX, 
  TrendingUp, 
  Layers,
  Lock,
  ExternalLink
} from 'lucide-react';

interface RiskVerdictModalProps {
  evaluation: RiskEvaluation | null;
  isOpen: boolean;
  lang: Language;
  onProceed: (action: UserAction) => void;
  onCancel: (action: UserAction) => void;
  onClose: () => void;
}

export const RiskVerdictModal: React.FC<RiskVerdictModalProps> = ({
  evaluation,
  isOpen,
  lang,
  onProceed,
  onCancel,
  onClose,
}) => {
  if (!isOpen || !evaluation) return null;

  const t = translations[lang];
  const { decision, score, responseTimeMs, topReasons, input } = evaluation;
  const [overrideAcknowledged, setOverrideAcknowledged] = useState(false);
  const [showOverrideSection, setShowOverrideSection] = useState(false);

  // Icon mapping for reasons
  const getFactorIcon = (category: string) => {
    switch (category) {
      case 'amount':
        return <TrendingUp className="w-4 h-4 text-amber-400" />;
      case 'payee':
        return <UserX className="w-4 h-4 text-purple-400" />;
      case 'timing':
        return <Clock className="w-4 h-4 text-sky-400" />;
      case 'device':
        return <Smartphone className="w-4 h-4 text-indigo-400" />;
      case 'location':
        return <MapPin className="w-4 h-4 text-rose-400" />;
      case 'synergy':
      default:
        return <Layers className="w-4 h-4 text-orange-400" />;
    }
  };

  const getDecisionTheme = () => {
    switch (decision) {
      case 'ALLOW':
        return {
          bannerBg: 'bg-emerald-950/70 border-emerald-500/40 text-emerald-100',
          accentColor: 'emerald',
          headerBg: 'bg-emerald-500/10 border-emerald-500/20',
          title: t.decisionAllowTitle,
          subtitle: t.decisionAllowSubtitle,
          message: t.decisionAllowMessage,
          icon: ShieldCheck,
          iconColor: 'text-emerald-400',
          glow: 'shadow-[0_0_35px_rgba(16,185,129,0.15)]',
          badgeText: t.decisionAllowBadge,
          badgeClass: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
        };
      case 'WARN':
        return {
          bannerBg: 'bg-amber-950/70 border-amber-500/40 text-amber-100',
          accentColor: 'amber',
          headerBg: 'bg-amber-500/10 border-amber-500/20',
          title: t.decisionWarnTitle,
          subtitle: t.decisionWarnSubtitle,
          message: t.decisionWarnMessage,
          icon: AlertTriangle,
          iconColor: 'text-amber-400',
          glow: 'shadow-[0_0_35px_rgba(245,158,11,0.2)]',
          badgeText: t.decisionWarnBadge,
          badgeClass: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
        };
      case 'BLOCK':
        return {
          bannerBg: 'bg-rose-950/70 border-rose-500/40 text-rose-100',
          accentColor: 'rose',
          headerBg: 'bg-rose-500/10 border-rose-500/20',
          title: t.decisionBlockTitle,
          subtitle: t.decisionBlockSubtitle,
          message: t.decisionBlockMessage,
          icon: ShieldAlert,
          iconColor: 'text-rose-400',
          glow: 'shadow-[0_0_40px_rgba(239,68,68,0.25)]',
          badgeText: t.decisionBlockBadge,
          badgeClass: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
        };
    }
  };

  const theme = getDecisionTheme();
  const DecisionIcon = theme.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div 
        className={`relative w-full max-w-xl my-auto bg-slate-900 border ${theme.bannerBg.split(' ')[1]} rounded-2xl ${theme.glow} shadow-2xl overflow-hidden flex flex-col`}
      >
        {/* Header Bar */}
        <div className={`px-5 py-4 border-b flex items-center justify-between ${theme.headerBg}`}>
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl bg-slate-900/90 border border-slate-700/50 ${theme.iconColor}`}>
              <DecisionIcon className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold tracking-tight text-white">
                  {theme.title}
                </h2>
                <span className={`text-[11px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${theme.badgeClass}`}>
                  {theme.badgeText}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {theme.subtitle} · {responseTimeMs}ms XAI
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body content */}
        <div className="p-4 sm:p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Main Transaction Summary Pill */}
          <div className="flex items-center justify-between p-3.5 bg-slate-950/60 rounded-xl border border-slate-800/80 text-sm">
            <div className="space-y-0.5">
              <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider block">
                {t.colPayee}
              </span>
              <span className="font-semibold text-slate-200 break-all">
                {input.payeeUpi}
              </span>
            </div>
            <div className="text-right pl-3">
              <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider block">
                {t.colAmount}
              </span>
              <span className="text-lg font-bold text-white tracking-tight">
                ₹{input.amount.toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          {/* Risk Gauge Visual Component */}
          <RiskGauge
            score={score}
            decision={decision}
            responseTimeMs={responseTimeMs}
            lang={lang}
          />

          {/* Descriptive Verdict Note */}
          <div className={`p-3.5 rounded-xl border text-xs sm:text-sm leading-relaxed ${
            decision === 'ALLOW' 
              ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-200' 
              : decision === 'WARN' 
              ? 'bg-amber-950/40 border-amber-500/30 text-amber-200'
              : 'bg-rose-950/40 border-rose-500/30 text-rose-200'
          }`}>
            <p>{theme.message}</p>
          </div>

          {/* Explainable AI: Top 3 Reasons Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                  <span className="w-1.5 h-3.5 bg-indigo-500 rounded-sm"></span>
                  {t.topReasonsHeader}
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  {t.topReasonsSub}
                </p>
              </div>
              <span className="text-[11px] text-slate-400 font-medium bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                Top {topReasons.length}
              </span>
            </div>

            <div className="space-y-2.5">
              {topReasons.map((factor, index) => {
                const text = factor.explanation[lang] || factor.explanation.en;
                const detail = factor.detailNote ? (factor.detailNote[lang] || factor.detailNote.en) : null;
                return (
                  <div
                    key={factor.id}
                    className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl space-y-2 hover:border-slate-700 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-2.5">
                        <div className="mt-0.5 p-1.5 rounded-lg bg-slate-900 border border-slate-800 shrink-0">
                          {getFactorIcon(factor.category)}
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs sm:text-sm font-semibold text-slate-200 leading-snug">
                            {text}
                          </p>
                          {detail && (
                            <p className="text-[11px] text-slate-400">
                              {detail}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Points Contribution Badge */}
                      <div className="shrink-0 flex flex-col items-end">
                        <span className={`px-2 py-0.5 text-xs font-bold rounded font-mono ${
                          factor.points >= 20
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                            : factor.points >= 10
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        }`}>
                          +{factor.points} pts
                        </span>
                      </div>
                    </div>

                    {/* Impact Bar */}
                    <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                      <div
                        className={`h-1.5 rounded-full transition-all duration-500 ${
                          factor.points >= 20
                            ? 'bg-rose-500'
                            : factor.points >= 10
                            ? 'bg-amber-500'
                            : 'bg-emerald-500'
                        }`}
                        style={{ width: `${Math.min(100, Math.max(12, factor.relativeWeight))}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Conditional Override Section for BLOCK */}
          {decision === 'BLOCK' && (
            <div className="p-4 bg-slate-950 border border-rose-900/60 rounded-xl space-y-3">
              <div className="flex items-start gap-2.5 text-rose-300 text-xs">
                <Lock className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
                <div>
                  <p className="font-semibold text-rose-200">
                    {t.blockRecommendedAction}
                  </p>
                  <p className="text-slate-400 text-[11px] mt-0.5">
                    {t.blockOverrideNotice}
                  </p>
                </div>
              </div>

              {!showOverrideSection ? (
                <button
                  type="button"
                  onClick={() => setShowOverrideSection(true)}
                  className="text-xs text-slate-400 hover:text-slate-200 underline decoration-slate-600 transition-colors flex items-center gap-1"
                >
                  Need to send anyway? Open security override options
                </button>
              ) : (
                <div className="pt-2 border-t border-slate-800/80 space-y-3">
                  <label className="flex items-start gap-2.5 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={overrideAcknowledged}
                      onChange={(e) => setOverrideAcknowledged(e.target.checked)}
                      className="mt-0.5 w-4 h-4 rounded border-slate-700 bg-slate-900 text-rose-600 focus:ring-rose-500 focus:ring-offset-slate-900"
                    />
                    <span className="text-xs text-slate-300 leading-normal">
                      {t.blockOverrideCheckbox}
                    </span>
                  </label>

                  <button
                    type="button"
                    disabled={!overrideAcknowledged}
                    onClick={() => onProceed('OVERRIDDEN_AND_PAID')}
                    className={`w-full py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold tracking-wide transition-all ${
                      overrideAcknowledged
                        ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-900/40 cursor-pointer'
                        : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                    }`}
                  >
                    {t.blockOverrideButton}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Actions Based on Decision Rules */}
        <div className="px-5 py-4 bg-slate-950 border-t border-slate-800 flex flex-col sm:flex-row items-center gap-3">
          {/* Rule 1: ALLOW (0 - 40): Green screen, proceed with payment */}
          {decision === 'ALLOW' && (
            <div className="w-full flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="w-1/3 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
              >
                {t.upiPinCancel}
              </button>
              <button
                type="button"
                onClick={() => onProceed('APPROVED')}
                className="w-2/3 py-3 px-5 rounded-xl text-xs sm:text-sm font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-950/50 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <span>{t.allowProceedButton}{input.amount.toLocaleString('en-IN')}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Rule 2: WARN (41 - 75): Amber screen, "Proceed anyway" and "Cancel" buttons */}
          {decision === 'WARN' && (
            <div className="w-full flex flex-col-reverse sm:flex-row items-center gap-2.5">
              <button
                type="button"
                onClick={() => onCancel('CANCELLED_AFTER_WARN')}
                className="w-full sm:w-1/2 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all cursor-pointer"
              >
                {t.warnCancelButton}
              </button>
              <button
                type="button"
                onClick={() => onProceed('PROCEEDED_AFTER_WARN')}
                className="w-full sm:w-1/2 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-lg shadow-amber-950/50 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <span>{t.warnProceedButton}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Rule 3: BLOCK (76 - 100): Red screen, Recommend blocking, Cancel is primary */}
          {decision === 'BLOCK' && (
            <div className="w-full flex items-center">
              <button
                type="button"
                onClick={() => onCancel('BLOCKED_BY_USER')}
                className="w-full py-3 px-5 rounded-xl text-xs sm:text-sm font-bold bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-950/60 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>{t.blockCancelButton}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
