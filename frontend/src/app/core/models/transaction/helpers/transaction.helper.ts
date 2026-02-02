import {TransactionType} from '@core/models/transaction';

export const TransactionTypeHelper = {
  isDeposit: (type: TransactionType): boolean => type === TransactionType.DEPOSIT,

  isWithdrawal: (type: TransactionType): boolean => type === TransactionType.WITHDRAWAL,

  getLabel: (type: TransactionType): string => {
    switch (type) {
      case TransactionType.DEPOSIT:
        return 'Depósito';
      case TransactionType.WITHDRAWAL:
        return 'Retiro';
      default:
        return '';
    }
  },

  getIcon: (type: TransactionType): string => {
    switch (type) {
      case TransactionType.DEPOSIT:
        return '↓';
      case TransactionType.WITHDRAWAL:
        return '↑';
      default:
        return '';
    }
  },

  getColorClass: (type: TransactionType): string => {
    switch (type) {
      case TransactionType.DEPOSIT:
        return 'text-success';
      case TransactionType.WITHDRAWAL:
        return 'text-danger';
      default:
        return '';
    }
  },

  getOptions: (): Array<{ value: TransactionType; label: string }> => [
    {value: TransactionType.DEPOSIT, label: 'Depósito'},
    {value: TransactionType.WITHDRAWAL, label: 'Retiro'}
  ]
};
