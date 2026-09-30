import React, { useState } from 'react';
import { Language } from '../types';
import { translations } from '../utils/translations';
import { Lock, X, Check, Delete, ArrowRight } from 'lucide-react';

interface UpiPinModalProps {
  isOpen: boolean;
  amount: number;
  payeeUpi: string;
  lang: Language;
  onSuccess: () => void;
  onCancel: () => void;
}

export const UpiPinModal: React.FC<UpiPinModalProps> = ({
  isOpen,
  amount,
  payeeUpi,
  lang,
  onSuccess,
  onCancel,
}) => {
  if (!isOpen) return null;

  const t = translations[lang];
  const [pin, setPin] = useState<string>('');
  const [isVerifying, setIsVerifying] = useState(false);

  const handleDigit = (digit: string) => {
    if (pin.length < 6) {
      setPin((prev) => prev + digit);
    }
  };

  const handleDelete = () => {
    setPin((prev) => prev.slice(0, -1));
  };

  const handleSubmit = () => {
    if (pin.length < 4) return;
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      onSuccess();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-sm bg-slate-900 border border-slate-700/80 rounded-2xl p-6 shadow-2xl space-y-5 text-center">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2 text-indigo-400">
            <Lock className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
              UPI Security PIN
            </span>
          </div>
          <button
            type="button"
            onClick={onCancel}
            className="text-slate-400 hover:text-slate-200 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Transfer context */}
        <div className="space-y-1">
          <p className="text-xs text-slate-400">Transferring to</p>
          <p className="text-sm font-semibold text-white break-all">{payeeUpi}</p>
          <p className="text-2xl font-extrabold text-white mt-1">
            ₹{amount.toLocaleString('en-IN')}
          </p>
        </div>

        {/* PIN Dots (6 digits) */}
        <div className="space-y-2">
          <p className="text-xs text-slate-400">{t.enterUpiPinTitle}</p>
          <div className="flex justify-center gap-3 py-2">
            {[0, 1, 2, 3, 4, 5].map((idx) => (
              <div
                key={idx}
                className={`w-3.5 h-3.5 rounded-full border transition-all ${
                  idx < pin.length
                    ? 'bg-indigo-500 border-indigo-400 scale-110 shadow-sm shadow-indigo-500/50'
                    : 'bg-slate-800 border-slate-700'
                }`}
              />
            ))}
          </div>
          <p className="text-[11px] text-slate-500">{t.enterUpiPinDesc}</p>
        </div>

        {/* Keypad */}
        <div className="grid grid-cols-3 gap-2 pt-2">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
            <button
              key={digit}
              type="button"
              onClick={() => handleDigit(digit)}
              className="py-3 rounded-xl bg-slate-950/80 hover:bg-slate-800 border border-slate-800/80 text-lg font-bold text-white transition-colors cursor-pointer active:scale-95"
            >
              {digit}
            </button>
          ))}
          <button
            type="button"
            onClick={handleDelete}
            className="py-3 rounded-xl bg-slate-950/40 hover:bg-slate-800 border border-slate-800/80 text-slate-400 flex items-center justify-center transition-colors cursor-pointer active:scale-95"
          >
            <Delete className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={() => handleDigit('0')}
            className="py-3 rounded-xl bg-slate-950/80 hover:bg-slate-800 border border-slate-800/80 text-lg font-bold text-white transition-colors cursor-pointer active:scale-95"
          >
            0
          </button>
          <button
            type="button"
            disabled={pin.length < 4 || isVerifying}
            onClick={handleSubmit}
            className={`py-3 rounded-xl flex items-center justify-center font-bold transition-all cursor-pointer ${
              pin.length >= 4 && !isVerifying
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-950/50 active:scale-95'
                : 'bg-slate-800 text-slate-600 border border-slate-800 cursor-not-allowed'
            }`}
          >
            {isVerifying ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Check className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Bottom Helper */}
        <div className="flex items-center justify-between pt-2 text-xs">
          <button
            type="button"
            onClick={() => setPin('123456')}
            className="text-[11px] text-indigo-400 hover:text-indigo-300 underline"
          >
            Demo: Autofill PIN (123456)
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="text-slate-400 hover:text-slate-200"
          >
            {t.upiPinCancel}
          </button>
        </div>
      </div>
    </div>
  );
};
