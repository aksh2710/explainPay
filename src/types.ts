export type Language = 'en' | 'hi' | 'mr';

export type Decision = 'ALLOW' | 'WARN' | 'BLOCK';

export type UserAction = 
  | 'APPROVED' 
  | 'PROCEEDED_AFTER_WARN' 
  | 'CANCELLED_AFTER_WARN' 
  | 'BLOCKED_BY_USER' 
  | 'OVERRIDDEN_AND_PAID';

export interface PaymentFormValues {
  payeeUpi: string;
  payeeName?: string;
  amount: number;
  hour: number; // 0 - 23
  isNewPayee: boolean;
  isNewDevice: boolean;
  isUnusualLocation: boolean;
  notes?: string;
}

export interface RiskFactor {
  id: string;
  name: string;
  category: 'amount' | 'payee' | 'timing' | 'device' | 'location' | 'synergy';
  points: number; // Positive contribution to fraud score
  relativeWeight: number; // percentage or impact ratio
  explanation: {
    en: string;
    hi: string;
    mr: string;
  };
  detailNote?: {
    en: string;
    hi: string;
    mr: string;
  };
}

export interface RiskEvaluation {
  score: number; // 0 - 100
  decision: Decision;
  responseTimeMs: number;
  topReasons: RiskFactor[];
  allFactors: RiskFactor[];
  modelConfidence: number; // e.g. 98.4%
  evaluatedAt: string;
  input: PaymentFormValues;
}

export interface TransactionRecord {
  id: string;
  timestamp: string;
  payeeUpi: string;
  payeeName: string;
  amount: number;
  score: number;
  decision: Decision;
  userAction: UserAction;
  responseTimeMs: number;
  topReasonsSummary: string;
}
