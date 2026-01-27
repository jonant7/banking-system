import {TransactionType} from '@core/models/transaction';

export interface TransactionApiResponse {
  id: string;
  type: TransactionType;
  amount: number;
  balanceBefore: number;
  balanceAfter: number;
  reference?: string;
  accountId: string;
  createdAt: string;
}

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  balanceBefore: number;
  balanceAfter: number;
  reference?: string;
  accountId: string;
  createdAt: string;
}

export interface CreateTransactionRequest {
  type: TransactionType;
  amount: number;
  reference?: string;
}

export interface TransactionFormData {
  accountId: string;
  type: TransactionType | null;
  amount: number | null;
  reference: string;
}

export interface TransactionTableRow {
  id: string;
  date: Date;
  formattedDate: string;
  type: TransactionType;
  typeLabel: string;
  amount: number;
  formattedAmount: string;
  balanceBefore: number;
  balanceAfter: number;
  formattedBalanceAfter: string;
  reference: string;
  accountId: string;
  isDeposit: boolean;
}

export interface TransactionSummary {
  totalDeposits: number;
  totalWithdrawals: number;
  transactionCount: number;
  netChange: number;
  formattedTotalDeposits: string;
  formattedTotalWithdrawals: string;
  formattedNetChange: string;
}
