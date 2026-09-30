import React from 'react';
import { Language, UserAction } from '../types';
import { translations, getActionText } from '../utils/translations';
import { CheckCircle2, ShieldCheck, XCircle, ArrowRight, Share2, Download } from 'lucide-react';

interface PaymentReceiptModalProps {
  isOpen: boolean;
  type: 'SUCCESS' | 'CANCELLED';
  amount: number;
  payeeUpi: string;
  action: UserAction;
  score: number;
  lang: Language;
  onClose: () => void;
}

export const PaymentReceiptModal: React.FC<PaymentReceiptModalProps> = ({
  isOpen,
  type,
  amount,
  payeeUpi,
  action,
  score,
  lang,
  onClose,
}) => {
  if (!isOpen) return null;

  const t = translations[lang];
  const isSuccess = type === 'SUCCESS';
  const actionLabel = getActionText(action, lang);
  const upiRef = `UPI/${Math.floor(100000000000 + Math.random() * 900000000000)}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-sm bg-slate-900 border border-slate-700/80 rounded-2xl p-6 shadow-2xl text-center space-y-5">
        <div className="flex justify-center">
          {isSuccess ? (
            <div className="w-16 h-16 rounded-full bg-emerald-500/15 border-2 border-emerald-500/40 flex items-center justify-center text-emerald-400 animate-bounce">
              <CheckCircle2 className="w-9 h-9" />
            </div>
          ) : (
            <div className="w-16 h-16 rounded-full bg-rose-500/15 border-2 border-rose-500/40 flex items-center justify-center text-rose-400">
              <ShieldCheck className="w-9 h-9" />
            </div>
          )}
        </div>

        <div className="space-y-1">
          <h3 className="text-lg font-bold text-white">
            {isSuccess ? t.paymentSuccessTitle : t.paymentCancelledTitle}
          </h3>
          <p className="text-xs text-slate-400">
            {isSuccess ? t.paymentSuccessMessage : t.paymentCancelledMessage}
          </p>
        </div>

        {/* Receipt Box */}
        <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3.5 space-y-2 text-xs text-left">
          <div className="flex justify-between text-slate-400">
            <span>Recipient UPI:</span>
            <span className="font-semibold text-slate-200 truncate max-w-[170px]">{payeeUpi}</span>
          </div>
          <div className="flex justify-between text-slate-400">
            <span>Amount:</span>
            <span className="font-bold text-white">₹{amount.toLocaleString('en-IN')}</span>
          </div>
          <div className="flex justify-between text-slate-400">
            <span>Risk Score:</span>
            <span className={`font-mono font-bold ${
              score >= 76 ? 'text-rose-400' : score >= 41 ? 'text-amber-400' : 'text-emerald-400'
            }`}>
              {score} / 100
            </span>
          </div>
          <div className="flex justify-between text-slate-400">
            <span>Action Audit:</span>
            <span className="font-medium text-slate-300">{actionLabel}</span>
          </div>
          {isSuccess && (
            <div className="flex justify-between text-slate-500 text-[10px] pt-1 border-t border-slate-800/80">
              <span>UPI Ref No:</span>
              <span className="font-mono">{upiRef}</span>
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={onClose}
          className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
        >
          {t.doneButton}
        </button>
      </div>
    </div>
  );
};
