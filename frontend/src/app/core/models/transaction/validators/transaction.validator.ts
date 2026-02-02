function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('es-EC', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
}

export const TransactionValidation = {
  isValidAmount: (amount: number | null): boolean => {
    if (amount === null || amount === undefined) return false;
    return amount > 0;
  },

  canExecuteWithdrawal: (amount: number, currentBalance: number): boolean => {
    return amount > 0 && currentBalance >= amount;
  },

  getInsufficientBalanceMessage: (amount: number, currentBalance: number): string => {
    return `Saldo insuficiente. Disponible: ${formatCurrency(currentBalance)}, Requerido: ${formatCurrency(amount)}`;
  }
};
