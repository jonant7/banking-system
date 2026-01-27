import {
  CreateTransactionRequest,
  TransactionApiResponse,
  TransactionFormData,
  TransactionSummary,
  TransactionTableRow
} from '../models/transaction.model';
import {TransactionType} from '@core/models/transaction';

function formatDateTime(isoString: string): string {
  const date = new Date(isoString);
  return new Intl.DateTimeFormat('es-EC', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
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

export const TransactionMapper = {
  toTableRow: (transaction: TransactionApiResponse): TransactionTableRow => {
    const isDeposit = transaction.type === TransactionType.DEPOSIT;

    return {
      id: transaction.id,
      date: new Date(transaction.createdAt),
      formattedDate: formatDateTime(transaction.createdAt),
      type: transaction.type,
      typeLabel: isDeposit ? 'Depósito' : 'Retiro',
      amount: transaction.amount,
      formattedAmount: formatCurrency(transaction.amount),
      balanceBefore: transaction.balanceBefore,
      balanceAfter: transaction.balanceAfter,
      formattedBalanceAfter: formatCurrency(transaction.balanceAfter),
      reference: transaction.reference || '-',
      accountId: transaction.accountId,
      isDeposit
    };
  },

  toFormData: (transaction: TransactionApiResponse): Partial<TransactionFormData> => ({
    accountId: transaction.accountId,
    type: transaction.type,
    amount: transaction.amount,
    reference: transaction.reference || ''
  }),

  fromFormToCreateRequest: (formData: TransactionFormData): CreateTransactionRequest => ({
    type: formData.type!,
    amount: formData.amount!,
    reference: formData.reference?.trim() || undefined
  }),

  calculateSummary: (transactions: TransactionApiResponse[]): TransactionSummary => {
    const totalDeposits = transactions
      .filter(t => t.type === TransactionType.DEPOSIT)
      .reduce((sum, t) => sum + t.amount, 0);

    const totalWithdrawals = transactions
      .filter(t => t.type === TransactionType.WITHDRAWAL)
      .reduce((sum, t) => sum + t.amount, 0);

    const netChange = totalDeposits - totalWithdrawals;

    return {
      totalDeposits,
      totalWithdrawals,
      transactionCount: transactions.length,
      netChange,
      formattedTotalDeposits: formatCurrency(totalDeposits),
      formattedTotalWithdrawals: formatCurrency(totalWithdrawals),
      formattedNetChange: formatCurrency(netChange)
    };
  }
};
