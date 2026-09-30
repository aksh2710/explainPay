/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Language, 
  PaymentFormValues, 
  RiskEvaluation, 
  TransactionRecord, 
  UserAction 
} from './types';
import { translations } from './utils/translations';
import { 
  evaluatePaymentRisk, 
  PRESET_SCENARIOS, 
  BASELINE_SPEND 
} from './utils/fraudEngine';
import { PaymentForm } from './components/PaymentForm';
import { RiskVerdictModal } from './components/RiskVerdictModal';
import { StatsOverview } from './components/StatsOverview';
import { TransactionHistory } from './components/TransactionHistory';
import { UpiPinModal } from './components/UpiPinModal';
import { PaymentReceiptModal } from './components/PaymentReceiptModal';
import { 
  ShieldCheck, 
  Sparkles, 
  Info, 
  Zap, 
  Cpu, 
  Lock, 
  CheckCircle2, 
  HelpCircle,
  X
} from 'lucide-react';

// Pre-filled initial history so counters and table show realistic demo state immediately
const INITIAL_HISTORY: TransactionRecord[] = [
  {
    id: 'tx_demo_1',
    timestamp: '10:42 AM',
    payeeUpi: 'freshmart.groceries@paytm',
    payeeName: 'FreshMart Organics',
    amount: 520,
    score: 12,
    decision: 'ALLOW',
    userAction: 'APPROVED',
    responseTimeMs: 19,
    topReasonsSummary: 'Normal spend baseline, trusted primary device',
  },
  {
    id: 'tx_demo_2',
    timestamp: 'Yesterday, 8:15 PM',
    payeeUpi: 'croma.retail@okicici',
    payeeName: 'Croma Electronics',
    amount: 12000,
    score: 58,
    decision: 'WARN',
    userAction: 'PROCEEDED_AFTER_WARN',
    responseTimeMs: 24,
    topReasonsSummary: '6x usual spending, first-time payee',
  },
  {
    id: 'tx_demo_3',
    timestamp: 'Yesterday, 2:40 AM',
    payeeUpi: 'urgent.crypto99@ybl',
    payeeName: 'Quick Loan Clearing',
    amount: 45000,
    score: 94,
    decision: 'BLOCK',
    userAction: 'BLOCKED_BY_USER',
    responseTimeMs: 22,
    topReasonsSummary: '22x spend, 2:40 AM odd hour, new device',
  },
];

export default function App() {
  const [lang, setLang] = useState<Language>('en');
  const t = translations[lang];

  // Form state initialized with Normal Preset
  const [formValues, setFormValues] = useState<PaymentFormValues>(PRESET_SCENARIOS.normal);

  // History & Telemetry state
  const [history, setHistory] = useState<TransactionRecord[]>(INITIAL_HISTORY);

  // Workflow states
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [activeEvaluation, setActiveEvaluation] = useState<RiskEvaluation | null>(null);
  const [isVerdictOpen, setIsVerdictOpen] = useState(false);
  const [isPinModalOpen, setIsPinModalOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<UserAction | null>(null);
  const [receiptState, setReceiptState] = useState<{
    isOpen: boolean;
    type: 'SUCCESS' | 'CANCELLED';
    amount: number;
    payeeUpi: string;
    action: UserAction;
    score: number;
  }>({
    isOpen: false,
    type: 'SUCCESS',
    amount: 0,
    payeeUpi: '',
    action: 'APPROVED',
    score: 0,
  });

  const [showArchitectureModal, setShowArchitectureModal] = useState(false);

  // Evaluate risk when user clicks "Pay"
  const handlePayClick = () => {
    setIsEvaluating(true);

    // Simulate instant AI model inference with slight micro-delay for realistic UI feedback
    setTimeout(() => {
      const evaluation = evaluatePaymentRisk(formValues);
      setActiveEvaluation(evaluation);
      setIsEvaluating(false);
      setIsVerdictOpen(true);
    }, 280);
  };

  // User decides to proceed from the verdict screen
  const handleProceedVerdict = (action: UserAction) => {
    setIsVerdictOpen(false);
    setPendingAction(action);
    setIsPinModalOpen(true);
  };

  // User decides to cancel or block from the verdict screen
  const handleCancelVerdict = (action: UserAction) => {
    if (!activeEvaluation) return;

    setIsVerdictOpen(false);

    // Record decision in history
    const newRecord: TransactionRecord = {
      id: `tx_${Date.now()}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      payeeUpi: activeEvaluation.input.payeeUpi,
      payeeName: activeEvaluation.input.payeeName || activeEvaluation.input.payeeUpi.split('@')[0],
      amount: activeEvaluation.input.amount,
      score: activeEvaluation.score,
      decision: activeEvaluation.decision,
      userAction: action,
      responseTimeMs: activeEvaluation.responseTimeMs,
      topReasonsSummary: activeEvaluation.topReasons.map(r => r.name).join(', '),
    };

    setHistory(prev => [newRecord, ...prev]);

    // Show cancellation feedback
    setReceiptState({
      isOpen: true,
      type: 'CANCELLED',
      amount: activeEvaluation.input.amount,
      payeeUpi: activeEvaluation.input.payeeUpi,
      action: action,
      score: activeEvaluation.score,
    });
  };

  // User successfully enters UPI PIN
  const handlePinSuccess = () => {
    if (!activeEvaluation || !pendingAction) return;

    setIsPinModalOpen(false);

    // Record successfully processed transaction
    const newRecord: TransactionRecord = {
      id: `tx_${Date.now()}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      payeeUpi: activeEvaluation.input.payeeUpi,
      payeeName: activeEvaluation.input.payeeName || activeEvaluation.input.payeeUpi.split('@')[0],
      amount: activeEvaluation.input.amount,
      score: activeEvaluation.score,
      decision: activeEvaluation.decision,
      userAction: pendingAction,
      responseTimeMs: activeEvaluation.responseTimeMs,
      topReasonsSummary: activeEvaluation.topReasons.map(r => r.name).join(', '),
    };

    setHistory(prev => [newRecord, ...prev]);

    // Show success receipt
    setReceiptState({
      isOpen: true,
      type: 'SUCCESS',
      amount: activeEvaluation.input.amount,
      payeeUpi: activeEvaluation.input.payeeUpi,
      action: pendingAction,
      score: activeEvaluation.score,
    });

    setPendingAction(null);
  };

  const handleClearHistory = () => {
    setHistory([]);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-indigo-600 selection:text-white">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 bg-slate-900/90 border-b border-slate-800 backdrop-blur-md px-4 sm:px-6 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-500 p-0.5 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-indigo-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-extrabold tracking-tight text-white">
                  {t.appName}
                </h1>
                <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 uppercase tracking-wider">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  {t.liveBadge}
                </span>
              </div>
              <p className="text-xs text-slate-400 line-clamp-1">
                {t.appSubtitle}
              </p>
            </div>
          </div>

          {/* Right Header Controls */}
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => setShowArchitectureModal(true)}
              className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Cpu className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden md:inline">How XAI Works</span>
            </button>

            {/* Language Quick Switch */}
            <div className="flex items-center bg-slate-950 border border-slate-800 rounded-xl p-0.5 text-xs">
              <button
                type="button"
                onClick={() => setLang('en')}
                className={`px-2 py-1 rounded-lg font-medium transition-all ${
                  lang === 'en' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => setLang('hi')}
                className={`px-2 py-1 rounded-lg font-medium transition-all ${
                  lang === 'hi' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                हिन्दी
              </button>
              <button
                type="button"
                onClick={() => setLang('mr')}
                className={`px-2 py-1 rounded-lg font-medium transition-all ${
                  lang === 'mr' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                मराठी
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Single-Page Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Telemetry Counter Cards */}
        <StatsOverview history={history} lang={lang} />

        {/* 2-Column Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Payment Form Simulator (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <PaymentForm
              values={formValues}
              onChange={setFormValues}
              onSubmit={handlePayClick}
              lang={lang}
              onLanguageChange={setLang}
              isEvaluating={isEvaluating}
            />

            {/* Quick Demo Guidance Card */}
            <div className="p-4 rounded-2xl bg-indigo-950/20 border border-indigo-900/30 text-xs text-indigo-200/90 flex items-start gap-3">
              <Info className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-semibold text-white">
                  Explainable AI (XAI) Prototype Instructions:
                </p>
                <p className="text-slate-400 leading-relaxed">
                  Click any of the 3 presets above to see the 3 distinct thresholds:
                  <span className="text-emerald-400 font-semibold ml-1">Normal (0-40 Allow)</span>,
                  <span className="text-amber-400 font-semibold ml-1">Suspicious (41-75 Warn)</span>, and
                  <span className="text-rose-400 font-semibold ml-1">High-Risk (76-100 Block)</span>.
                  Every evaluation provides top 3 plain-language explanations with point contributions and instant millisecond latency.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Transaction History & Audit Trail (5 cols) */}
          <div className="lg:col-span-5 h-full">
            <TransactionHistory
              history={history}
              lang={lang}
              onClear={handleClearHistory}
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-900 py-5 px-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>
            ExplainPay · Real-Time UPI Fraud Prevention & Explainable AI Architecture
          </p>
          <div className="flex items-center gap-4 text-slate-400">
            <span className="flex items-center gap-1 text-emerald-400">
              <Zap className="w-3.5 h-3.5" /> Real-time &lt; 30ms SLA
            </span>
            <span>·</span>
            <span>SHAP Attribution Scoring</span>
          </div>
        </div>
      </footer>

      {/* Evaluation Result Screen (Allow, Warn, Block) */}
      <RiskVerdictModal
        evaluation={activeEvaluation}
        isOpen={isVerdictOpen}
        lang={lang}
        onProceed={handleProceedVerdict}
        onCancel={handleCancelVerdict}
        onClose={() => setIsVerdictOpen(false)}
      />

      {/* Realistic UPI PIN Modal */}
      <UpiPinModal
        isOpen={isPinModalOpen}
        amount={activeEvaluation?.input.amount || 0}
        payeeUpi={activeEvaluation?.input.payeeUpi || ''}
        lang={lang}
        onSuccess={handlePinSuccess}
        onCancel={() => {
          setIsPinModalOpen(false);
          setPendingAction(null);
        }}
      />

      {/* Outcome / Receipt Modal */}
      <PaymentReceiptModal
        isOpen={receiptState.isOpen}
        type={receiptState.type}
        amount={receiptState.amount}
        payeeUpi={receiptState.payeeUpi}
        action={receiptState.action}
        score={receiptState.score}
        lang={lang}
        onClose={() => setReceiptState(prev => ({ ...prev, isOpen: false }))}
      />

      {/* Architecture & XAI Explainer Modal */}
      {showArchitectureModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-2xl p-6 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Cpu className="w-5 h-5 text-indigo-400" />
                <h3 className="text-base font-bold text-white">
                  ExplainPay XAI Architecture
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowArchitectureModal(false)}
                className="text-slate-400 hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                <span className="font-bold text-indigo-400 uppercase tracking-wider text-[10px]">
                  1. Local Feature Attribution (SHAP values)
                </span>
                <p>
                  Instead of black-box ML, ExplainPay calculates exact additive feature importance. Each risk factor (amount deviation, novel beneficiary, nocturnal hour, new device, foreign geo) yields transparent contribution points.
                </p>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                <span className="font-bold text-cyan-400 uppercase tracking-wider text-[10px]">
                  2. Synergy & Compound Fraud Vectors
                </span>
                <p>
                  Scammers frequently combine multiple high-risk factors simultaneously (e.g. 3 AM transfer of large sums to an unseen VPA from a freshly paired handset). Compound interactions incur compounding multipliers.
                </p>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                <span className="font-bold text-emerald-400 uppercase tracking-wider text-[10px]">
                  3. In-Line Latency & Tri-Zone Decision Gates
                </span>
                <p>
                  Evaluations execute within 15–30 milliseconds, well within NPCI UPI transaction turnaround thresholds:
                </p>
                <ul className="list-disc pl-4 space-y-0.5 pt-1 text-slate-400">
                  <li><strong className="text-emerald-400">0 – 40 (ALLOW):</strong> Friction-free instant clearance.</li>
                  <li><strong className="text-amber-400">41 – 75 (WARN):</strong> Two-click friction brake with top 3 driver disclosures.</li>
                  <li><strong className="text-rose-400">76 – 100 (BLOCK):</strong> Protective lockout requiring explicit legal acknowledgment & override.</li>
                </ul>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                <span className="font-bold text-purple-400 uppercase tracking-wider text-[10px]">
                  4. Native Vernacular Accessibility
                </span>
                <p>
                  Complete localization in English, Hindi (हिन्दी), and Marathi (मराठी) ensures non-English speaking UPI users clearly understand why a transaction was flagged without technical jargon.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowArchitectureModal(false)}
              className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
