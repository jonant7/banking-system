import {
  AccountReportDisplay,
  AccountStatementResponse,
  AccountWithTransactions,
  ReportDisplay,
  ReportFilter,
  ReportSummary,
  TransactionReportDisplay
} from '../models/report.model';
import {TransactionApiResponse} from '@core/models/transaction';

function formatDateTime(isoString: string): string {
  const date = new Date(isoString);
  return new Intl.DateTimeFormat('es-EC', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
}

function formatDate(isoString: string): string {
  const date = new Date(isoString);
  return new Intl.DateTimeFormat('es-EC', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).format(date);
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('es-EC', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
}

function getAccountTypeLabel(type: string): string {
  switch (type) {
    case 'SAVINGS':
      return 'Ahorros';
    case 'CHECKING':
      return 'Corriente';
    default:
      return type;
  }
}

function getStatusLabel(status: string): string {
  switch (status) {
    case 'ACTIVE':
      return 'Activa';
    case 'INACTIVE':
      return 'Inactiva';
    case 'SUSPENDED':
      return 'Suspendida';
    case 'CLOSED':
      return 'Cerrada';
    default:
      return status;
  }
}

function mapTransactionToDisplay(transaction: TransactionApiResponse): TransactionReportDisplay {
  const isDeposit = transaction.type === 'DEPOSIT';

  return {
    date: new Date(transaction.createdAt),
    formattedDate: formatDateTime(transaction.createdAt),
    type: transaction.type,
    typeLabel: isDeposit ? 'Depósito' : 'Retiro',
    amount: transaction.amount,
    formattedAmount: formatCurrency(transaction.amount),
    balanceAfter: transaction.balanceAfter,
    formattedBalanceAfter: formatCurrency(transaction.balanceAfter),
    reference: transaction.reference || '-',
    isDeposit
  };
}

function mapAccountToDisplay(accountWithTransactions: AccountWithTransactions): AccountReportDisplay {
  const {account, transactions} = accountWithTransactions;

  const totalDeposits = transactions
    .filter(t => t.type === 'DEPOSIT')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalWithdrawals = transactions
    .filter(t => t.type === 'WITHDRAWAL')
    .reduce((sum, t) => sum + t.amount, 0);

  const netMovement = totalDeposits - totalWithdrawals;

  return {
    accountNumber: account.accountNumber,
    accountType: account.accountType,
    accountTypeLabel: getAccountTypeLabel(account.accountType),
    initialBalance: account.initialBalance,
    currentBalance: account.currentBalance,
    formattedCurrentBalance: formatCurrency(account.currentBalance),
    status: account.status,
    statusLabel: getStatusLabel(account.status),
    transactions: transactions.map(mapTransactionToDisplay),
    transactionCount: transactions.length,
    totalDeposits,
    formattedTotalDeposits: formatCurrency(totalDeposits),
    totalWithdrawals,
    formattedTotalWithdrawals: formatCurrency(totalWithdrawals),
    netMovement,
    formattedNetMovement: formatCurrency(netMovement)
  };
}

export const ReportMapper = {
  toDisplay: (report: AccountStatementResponse): ReportDisplay => {
    const accounts = report.accounts.map(mapAccountToDisplay);

    const totalBalance = accounts.reduce((sum, acc) => sum + acc.currentBalance, 0);
    const totalDeposits = accounts.reduce((sum, acc) => sum + acc.totalDeposits, 0);
    const totalWithdrawals = accounts.reduce((sum, acc) => sum + acc.totalWithdrawals, 0);

    return {
      customerId: report.customerId,
      customerName: report.customerName,
      reportGeneratedAt: new Date(report.reportGeneratedAt),
      formattedGeneratedAt: formatDateTime(report.reportGeneratedAt),
      startDate: new Date(report.startDate),
      formattedStartDate: formatDate(report.startDate),
      endDate: new Date(report.endDate),
      formattedEndDate: formatDate(report.endDate),
      accounts,
      totalAccounts: accounts.length,
      totalBalance,
      formattedTotalBalance: formatCurrency(totalBalance),
      totalDeposits,
      formattedTotalDeposits: formatCurrency(totalDeposits),
      totalWithdrawals,
      formattedTotalWithdrawals: formatCurrency(totalWithdrawals),
      pdfBase64: report.pdfBase64
    };
  },

  toSummary: (report: ReportDisplay): ReportSummary => ({
    totalAccounts: report.totalAccounts,
    activeAccounts: report.accounts.filter(a => a.status === 'ACTIVE').length,
    totalBalance: report.totalBalance,
    formattedTotalBalance: report.formattedTotalBalance,
    totalTransactions: report.accounts.reduce((sum, acc) => sum + acc.transactionCount, 0),
    totalDeposits: report.totalDeposits,
    formattedTotalDeposits: report.formattedTotalDeposits,
    totalWithdrawals: report.totalWithdrawals,
    formattedTotalWithdrawals: report.formattedTotalWithdrawals,
    netMovement: report.totalDeposits - report.totalWithdrawals,
    formattedNetMovement: formatCurrency(report.totalDeposits - report.totalWithdrawals),
    dateRange: `${report.formattedStartDate} - ${report.formattedEndDate}`
  }),

  fromFilterToQueryParams: (filter: ReportFilter): Record<string, string> => {
    const startDate = typeof filter.startDate === 'string'
      ? filter.startDate
      : filter.startDate.toISOString();

    const endDate = typeof filter.endDate === 'string'
      ? filter.endDate
      : filter.endDate.toISOString();

    return {
      customerId: filter.customerId,
      startDate,
      endDate
    };
  }
};
