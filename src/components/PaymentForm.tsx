import React from 'react';
import { Language, PaymentFormValues } from '../types';
import { translations } from '../utils/translations';
import { PRESET_SCENARIOS, BASELINE_SPEND } from '../utils/fraudEngine';
import { 
  Sparkles, 
  Clock, 
  Smartphone, 
  MapPin, 
  UserCheck, 
  UserX, 
  ShieldCheck, 
  AlertTriangle, 
  ShieldAlert, 
  IndianRupee, 
  SendHorizontal,
  Moon,
  Sun
} from 'lucide-react';

interface PaymentFormProps {
  values: PaymentFormValues;
  onChange: (values: PaymentFormValues) => void;
  onSubmit: () => void;
  lang: Language;
  onLanguageChange: (lang: Language) => void;
  isEvaluating: boolean;
}

export const PaymentForm: React.FC<PaymentFormProps> = ({
  values,
  onChange,
  onSubmit,
  lang,
  onLanguageChange,
  isEvaluating,
}) => {
  const t = translations[lang];

  const handlePresetSelect = (presetKey: 'normal' | 'suspicious' | 'high_risk') => {
    const selected = PRESET_SCENARIOS[presetKey];
    onChange({ ...selected });
  };

  const updateField = <K extends keyof PaymentFormValues>(
    field: K,
    val: PaymentFormValues[K]
  ) => {
    onChange({
      ...values,
      [field]: val,
    });
  };

  const isNightHour = values.hour >= 0 && values.hour <= 4;

  const formatHourDisplay = (hour: number) => {
    const period = hour >= 12 ? 'PM' : 'AM';
    const h = hour % 12 === 0 ? 12 : hour % 12;
    return `${h}:00 ${period} (${hour.toString().padStart(2, '0')}:00)`;
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xl backdrop-blur-md space-y-6">
      {/* Top Bar: Language & Baseline Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300">
              UPI Payment Gateway Simulator
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            {t.usualSpendBaseline}
          </p>
        </div>

        {/* Language Selector */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-950/80 rounded-xl border border-slate-800">
          <span className="text-[11px] font-semibold text-slate-400 px-2">
            {t.languageLabel}:
          </span>
          <button
            type="button"
            onClick={() => onLanguageChange('en')}
            className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
              lang === 'en'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            English
          </button>
          <button
            type="button"
            onClick={() => onLanguageChange('hi')}
            className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
              lang === 'hi'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            हिन्दी
          </button>
          <button
            type="button"
            onClick={() => onLanguageChange('mr')}
            className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
              lang === 'mr'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            मराठी
          </button>
        </div>
      </div>

      {/* Preset Buttons Section */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          {t.presetsLabel}
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {/* Preset 1: Normal */}
          <button
            type="button"
            onClick={() => handlePresetSelect('normal')}
            className="flex flex-col text-left p-3 rounded-xl border border-emerald-900/40 bg-emerald-950/20 hover:bg-emerald-950/40 hover:border-emerald-500/50 transition-all group cursor-pointer"
          >
            <div className="flex items-center justify-between w-full">
              <span className="text-xs font-bold text-emerald-400 group-hover:text-emerald-300 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                {t.presetNormal}
              </span>
              <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                Safe
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">
              {t.presetNormalDesc}
            </p>
          </button>

          {/* Preset 2: Suspicious */}
          <button
            type="button"
            onClick={() => handlePresetSelect('suspicious')}
            className="flex flex-col text-left p-3 rounded-xl border border-amber-900/40 bg-amber-950/20 hover:bg-amber-950/40 hover:border-amber-500/50 transition-all group cursor-pointer"
          >
            <div className="flex items-center justify-between w-full">
              <span className="text-xs font-bold text-amber-400 group-hover:text-amber-300 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5" />
                {t.presetSuspicious}
              </span>
              <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300">
                Warn
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">
              {t.presetSuspiciousDesc}
            </p>
          </button>

          {/* Preset 3: High-Risk */}
          <button
            type="button"
            onClick={() => handlePresetSelect('high_risk')}
            className="flex flex-col text-left p-3 rounded-xl border border-rose-900/40 bg-rose-950/20 hover:bg-rose-950/40 hover:border-rose-500/50 transition-all group cursor-pointer"
          >
            <div className="flex items-center justify-between w-full">
              <span className="text-xs font-bold text-rose-400 group-hover:text-rose-300 flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5" />
                {t.presetHighRisk}
              </span>
              <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300">
                Block
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">
              {t.presetHighRiskDesc}
            </p>
          </button>
        </div>
      </div>

      {/* Main Payment Inputs */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
        className="space-y-4"
      >
        {/* Field 1: Payee UPI ID */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
            <span>{t.payeeUpiLabel}</span>
            <span className="text-[11px] text-slate-500">Virtual Payment Address (VPA)</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500 font-mono text-xs">
              @
            </div>
            <input
              type="text"
              required
              value={values.payeeUpi}
              onChange={(e) => updateField('payeeUpi', e.target.value)}
              placeholder={t.payeeUpiPlaceholder}
              className="w-full pl-8 pr-4 py-2.5 bg-slate-950/80 border border-slate-700/80 rounded-xl text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
            />
          </div>
          {/* Quick handle pills */}
          <div className="flex flex-wrap gap-1.5 pt-1 text-[11px] text-slate-400">
            <span className="text-slate-500 self-center">Popular:</span>
            {['kirana.supermart@paytm', 'rajesh.gadgets@okicici', 'rahul.verma@oksbi', 'urgent.prize99@ybl'].map((handle) => (
              <button
                type="button"
                key={handle}
                onClick={() => updateField('payeeUpi', handle)}
                className="px-2 py-0.5 rounded bg-slate-800/80 hover:bg-slate-700 text-slate-300 transition-colors"
              >
                {handle.split('@')[0]}@{handle.split('@')[1]}
              </button>
            ))}
          </div>
        </div>

        {/* Field 2: Amount in INR */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-slate-300">
              {t.amountLabel}
            </label>
            <span className="text-[11px] text-slate-400">
              {values.amount > BASELINE_SPEND ? (
                <span className="text-amber-400 font-medium">
                  {(values.amount / BASELINE_SPEND).toFixed(1)}x user average
                </span>
              ) : (
                <span className="text-emerald-400 font-medium">
                  Within usual spend (avg ₹2,000)
                </span>
              )}
            </span>
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <IndianRupee className="w-4 h-4" />
            </div>
            <input
              type="number"
              min="1"
              max="500000"
              required
              value={values.amount || ''}
              onChange={(e) => updateField('amount', Math.max(0, Number(e.target.value)))}
              placeholder={t.amountPlaceholder}
              className="w-full pl-9 pr-4 py-2.5 bg-slate-950/80 border border-slate-700/80 rounded-xl text-base font-bold tracking-tight text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
            />
          </div>

          {/* Quick amount chips */}
          <div className="flex items-center gap-1.5 pt-1 text-xs">
            {[450, 2000, 6500, 14500, 48000].map((amt) => (
              <button
                type="button"
                key={amt}
                onClick={() => updateField('amount', amt)}
                className={`px-2.5 py-1 rounded-lg border text-xs font-medium transition-all ${
                  values.amount === amt
                    ? 'bg-indigo-600/30 border-indigo-500 text-indigo-200'
                    : 'bg-slate-800/60 border-slate-700/60 text-slate-400 hover:text-slate-200'
                }`}
              >
                ₹{amt.toLocaleString('en-IN')}
              </button>
            ))}
          </div>
        </div>

        {/* Field 3: Time of Day (Hour) */}
        <div className="space-y-1.5 p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-indigo-400" />
              {t.timeOfDayLabel}
            </label>
            <div className="flex items-center gap-1.5">
              {isNightHour ? (
                <span className="flex items-center gap-1 text-[11px] font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/30">
                  <Moon className="w-3 h-3" /> Odd Hours (12 AM - 5 AM)
                </span>
              ) : (
                <span className="flex items-center gap-1 text-[11px] font-medium text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                  <Sun className="w-3 h-3 text-amber-400" /> Regular Business Hours
                </span>
              )}
              <span className="font-mono text-xs font-bold text-slate-200 bg-slate-800 px-2 py-0.5 rounded">
                {formatHourDisplay(values.hour)}
              </span>
            </div>
          </div>

          <input
            type="range"
            min="0"
            max="23"
            step="1"
            value={values.hour}
            onChange={(e) => updateField('hour', Number(e.target.value))}
            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
          />

          <div className="flex justify-between text-[10px] text-slate-500">
            <span>12 AM (Midnight)</span>
            <span>6 AM</span>
            <span>12 PM (Noon)</span>
            <span>6 PM</span>
            <span>11 PM</span>
          </div>
        </div>

        {/* Contextual Risk Toggles (Yes / No) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Toggle 1: New Payee */}
          <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80 flex flex-col justify-between space-y-2">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-200">
                {values.isNewPayee ? (
                  <UserX className="w-4 h-4 text-purple-400" />
                ) : (
                  <UserCheck className="w-4 h-4 text-emerald-400" />
                )}
                <span>{t.newPayeeLabel}</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1 leading-snug">
                {t.newPayeeSub}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-900 rounded-lg border border-slate-800">
              <button
                type="button"
                onClick={() => updateField('isNewPayee', false)}
                className={`py-1 text-xs font-semibold rounded-md transition-all ${
                  !values.isNewPayee
                    ? 'bg-slate-700 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {t.no}
              </button>
              <button
                type="button"
                onClick={() => updateField('isNewPayee', true)}
                className={`py-1 text-xs font-semibold rounded-md transition-all ${
                  values.isNewPayee
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {t.yes}
              </button>
            </div>
          </div>

          {/* Toggle 2: New Device */}
          <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80 flex flex-col justify-between space-y-2">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-200">
                <Smartphone className="w-4 h-4 text-indigo-400" />
                <span>{t.newDeviceLabel}</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1 leading-snug">
                {t.newDeviceSub}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-900 rounded-lg border border-slate-800">
              <button
                type="button"
                onClick={() => updateField('isNewDevice', false)}
                className={`py-1 text-xs font-semibold rounded-md transition-all ${
                  !values.isNewDevice
                    ? 'bg-slate-700 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {t.no}
              </button>
              <button
                type="button"
                onClick={() => updateField('isNewDevice', true)}
                className={`py-1 text-xs font-semibold rounded-md transition-all ${
                  values.isNewDevice
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {t.yes}
              </button>
            </div>
          </div>

          {/* Toggle 3: Unusual Location */}
          <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80 flex flex-col justify-between space-y-2">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-200">
                <MapPin className="w-4 h-4 text-rose-400" />
                <span>{t.unusualLocationLabel}</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1 leading-snug">
                {t.unusualLocationSub}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-900 rounded-lg border border-slate-800">
              <button
                type="button"
                onClick={() => updateField('isUnusualLocation', false)}
                className={`py-1 text-xs font-semibold rounded-md transition-all ${
                  !values.isUnusualLocation
                    ? 'bg-slate-700 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {t.no}
              </button>
              <button
                type="button"
                onClick={() => updateField('isUnusualLocation', true)}
                className={`py-1 text-xs font-semibold rounded-md transition-all ${
                  values.isUnusualLocation
                    ? 'bg-rose-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {t.yes}
              </button>
            </div>
          </div>
        </div>

        {/* Primary Pay Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isEvaluating || !values.payeeUpi || values.amount <= 0}
            className={`w-full py-3.5 px-6 rounded-xl font-bold text-base flex items-center justify-center gap-2.5 transition-all shadow-lg ${
              isEvaluating || !values.payeeUpi || values.amount <= 0
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-900/30 hover:shadow-indigo-800/50 cursor-pointer active:scale-[0.99]'
            }`}
          >
            {isEvaluating ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>{t.evaluatingButton}</span>
              </>
            ) : (
              <>
                <SendHorizontal className="w-5 h-5" />
                <span>{t.payButton} (₹{values.amount.toLocaleString('en-IN')})</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
