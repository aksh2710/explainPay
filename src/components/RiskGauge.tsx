import React, { useEffect, useState } from 'react';
import { Decision, Language } from '../types';
import { translations } from '../utils/translations';
import { Zap, ShieldCheck, AlertTriangle, ShieldAlert } from 'lucide-react';

interface RiskGaugeProps {
  score: number;
  decision: Decision;
  responseTimeMs: number;
  lang: Language;
}

export const RiskGauge: React.FC<RiskGaugeProps> = ({
  score,
  decision,
  responseTimeMs,
  lang,
}) => {
  const t = translations[lang];
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 600;
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // easeOutCubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setAnimatedScore(Math.round(eased * score));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [score]);

  // Semicircle gauge: 180 degrees from -180 to 0 (or left to right)
  // Let's use standard arc coordinates
  // Radius = 85, Center = (110, 110)
  // Angle for score 0 to 100 maps to -180 deg to 0 deg
  const angle = -180 + (animatedScore / 100) * 180;
  const radians = (angle * Math.PI) / 180;
  const needleLength = 70;
  const needleX = 110 + needleLength * Math.cos(radians);
  const needleY = 110 + needleLength * Math.sin(radians);

  const getDecisionTheme = () => {
    switch (decision) {
      case 'ALLOW':
        return {
          textColor: 'text-emerald-400',
          bgBadge: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
          glow: 'drop-shadow-[0_0_12px_rgba(16,185,129,0.35)]',
          icon: ShieldCheck,
          label: t.decisionAllowBadge,
        };
      case 'WARN':
        return {
          textColor: 'text-amber-400',
          bgBadge: 'bg-amber-500/10 border-amber-500/30 text-amber-400',
          glow: 'drop-shadow-[0_0_12px_rgba(245,158,11,0.35)]',
          icon: AlertTriangle,
          label: t.decisionWarnBadge,
        };
      case 'BLOCK':
        return {
          textColor: 'text-rose-400',
          bgBadge: 'bg-rose-500/10 border-rose-500/30 text-rose-400',
          glow: 'drop-shadow-[0_0_12px_rgba(239,68,68,0.35)]',
          icon: ShieldAlert,
          label: t.decisionBlockBadge,
        };
    }
  };

  const theme = getDecisionTheme();
  const IconComponent = theme.icon;

  return (
    <div className="flex flex-col items-center justify-center p-4 bg-slate-900/60 rounded-2xl border border-slate-800 backdrop-blur-md shadow-inner">
      <div className="flex items-center justify-between w-full px-2 mb-2 text-xs font-medium text-slate-400">
        <span className="uppercase tracking-wider font-semibold flex items-center gap-1.5">
          <IconComponent className="w-3.5 h-3.5 text-indigo-400" />
          {t.riskGaugeLabel}
        </span>
        <span className="flex items-center gap-1 text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded-md border border-slate-700/50">
          <Zap className="w-3 h-3 text-cyan-400" />
          {responseTimeMs} ms
        </span>
      </div>

      {/* SVG Speedometer Arc */}
      <div className="relative w-[220px] h-[125px] overflow-hidden">
        <svg viewBox="0 0 220 120" className="w-full h-full">
          {/* Background Arc track */}
          <path
            d="M 25 110 A 85 85 0 0 1 195 110"
            fill="none"
            stroke="#1e293b"
            strokeWidth="16"
            strokeLinecap="round"
          />

          {/* Segment 1: Safe 0 - 40 (0% to 40% of arc) -> -180 to -108 deg */}
          <path
            d="M 25 110 A 85 85 0 0 1 76 39"
            fill="none"
            stroke="#10b981"
            strokeWidth="14"
            strokeLinecap="round"
            className="opacity-80 hover:opacity-100 transition-opacity"
          />

          {/* Segment 2: Warn 41 - 75 -> 40% to 75% -> -108 to -45 deg */}
          <path
            d="M 81 35 A 85 85 0 0 1 150 43"
            fill="none"
            stroke="#f59e0b"
            strokeWidth="14"
            className="opacity-80 hover:opacity-100 transition-opacity"
          />

          {/* Segment 3: Danger 76 - 100 -> 75% to 100% -> -45 to 0 deg */}
          <path
            d="M 155 48 A 85 85 0 0 1 195 110"
            fill="none"
            stroke="#ef4444"
            strokeWidth="14"
            strokeLinecap="round"
            className="opacity-80 hover:opacity-100 transition-opacity"
          />

          {/* Needle Base Pin */}
          <circle cx="110" cy="110" r="8" fill="#38bdf8" />
          <circle cx="110" cy="110" r="4" fill="#0f172a" />

          {/* Needle */}
          <line
            x1="110"
            y1="110"
            x2={needleX}
            y2={needleY}
            stroke="#f8fafc"
            strokeWidth="3.5"
            strokeLinecap="round"
            className="transition-all duration-300 ease-out"
          />
        </svg>

        {/* Needle glow pulse on current center */}
        <div
          className={`absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1 w-6 h-6 rounded-full blur-sm opacity-50 ${
            decision === 'ALLOW'
              ? 'bg-emerald-500'
              : decision === 'WARN'
              ? 'bg-amber-500'
              : 'bg-rose-500'
          }`}
        />
      </div>

      {/* Score Readout */}
      <div className="flex flex-col items-center -mt-2">
        <div className="flex items-baseline gap-1">
          <span className={`text-4xl font-extrabold tracking-tight ${theme.textColor} ${theme.glow}`}>
            {animatedScore}
          </span>
          <span className="text-sm font-semibold text-slate-500">/ 100</span>
        </div>

        <div className="flex items-center gap-2 mt-1">
          <span className={`px-2.5 py-0.5 text-xs font-bold rounded border uppercase tracking-wider ${theme.bgBadge}`}>
            {theme.label}
          </span>
          <span className="text-xs text-slate-400">
            {decision === 'ALLOW'
              ? t.safeZone
              : decision === 'WARN'
              ? t.warningZone
              : t.dangerZone}
          </span>
        </div>
      </div>

      {/* Scale Legend */}
      <div className="grid grid-cols-3 w-full text-[10px] text-slate-400 mt-3 pt-2 border-t border-slate-800/80 text-center">
        <div className="flex items-center justify-center gap-1 text-emerald-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
          <span>0–40 Safe</span>
        </div>
        <div className="flex items-center justify-center gap-1 text-amber-400">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
          <span>41–75 Warn</span>
        </div>
        <div className="flex items-center justify-center gap-1 text-rose-400">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
          <span>76–100 Block</span>
        </div>
      </div>
    </div>
  );
};
