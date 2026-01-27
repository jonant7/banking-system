import {AccountApiResponse} from '@core/models/account';
import {TransactionApiResponse} from '@core/models/transaction';

export interface AccountStatementResponse {
  customerId: string;
  customerName: string;
  reportGeneratedAt: string;
  startDate: string;
  endDate: string;
  accounts: AccountWithTransactions[];
  pdfBase64?: string;
}

export interface AccountWithTransactions {
  account: AccountApiResponse;
  transactions: TransactionApiResponse[];
}

export interface AccountStatementReport {
  customerId: string;
  startDate: string;
  endDate: string;
  accounts: AccountWithTransactions[];
}

export interface ReportFilter {
  customerId: string;
  startDate: string | Date;
  endDate: string | Date;
  includePdf?: boolean;
}

export interface ReportDisplay {
  customerId: string;
  customerName: string;
  reportGeneratedAt: Date;
  formattedGeneratedAt: string;
  startDate: Date;
  formattedStartDate: string;
  endDate: Date;
  formattedEndDate: string;
  accounts: AccountReportDisplay[];
  totalAccounts: number;
  totalBalance: number;
  formattedTotalBalance: string;
  totalDeposits: number;
  formattedTotalDeposits: string;
  totalWithdrawals: number;
  formattedTotalWithdrawals: string;
  pdfBase64?: string;
}

export interface AccountReportDisplay {
  accountNumber: string;
  accountType: string;
  accountTypeLabel: string;
  initialBalance: number;
  currentBalance: number;
  formattedCurrentBalance: string;
  status: string;
  statusLabel: string;
  transactions: TransactionReportDisplay[];
  transactionCount: number;
  totalDeposits: number;
  formattedTotalDeposits: string;
  totalWithdrawals: number;
  formattedTotalWithdrawals: string;
  netMovement: number;
  formattedNetMovement: string;
}

export interface TransactionReportDisplay {
  date: Date;
  formattedDate: string;
  type: string;
  typeLabel: string;
  amount: number;
  formattedAmount: string;
  balanceAfter: number;
  formattedBalanceAfter: string;
  reference: string;
  isDeposit: boolean;
}

export interface ReportSummary {
  totalAccounts: number;
  activeAccounts: number;
  totalBalance: number;
  formattedTotalBalance: string;
  totalTransactions: number;
  totalDeposits: number;
  formattedTotalDeposits: string;
  totalWithdrawals: number;
  formattedTotalWithdrawals: string;
  netMovement: number;
  formattedNetMovement: string;
  dateRange: string;
}
