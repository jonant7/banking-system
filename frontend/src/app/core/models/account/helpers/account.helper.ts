import {AccountStatus, AccountType} from '@core/models/account';

export const AccountTypeHelper = {
  isSavings: (type: AccountType): boolean => type === AccountType.SAVINGS,

  isChecking: (type: AccountType): boolean => type === AccountType.CHECKING,

  getLabel: (type: AccountType): string => {
    switch (type) {
      case AccountType.SAVINGS:
        return 'Ahorros';
      case AccountType.CHECKING:
        return 'Corriente';
      default:
        return '';
    }
  },

  getOptions: (): Array<{ value: AccountType; label: string }> => [
    {value: AccountType.SAVINGS, label: 'Ahorros'},
    {value: AccountType.CHECKING, label: 'Corriente'}
  ]
};

export const AccountStatusHelper = {
  isActive: (status: AccountStatus): boolean => status === AccountStatus.ACTIVE,

  isInactive: (status: AccountStatus): boolean => status === AccountStatus.INACTIVE,

  isSuspended: (status: AccountStatus): boolean => status === AccountStatus.SUSPENDED,

  isClosed: (status: AccountStatus): boolean => status === AccountStatus.CLOSED,

  allowsTransactions: (status: AccountStatus): boolean => status === AccountStatus.ACTIVE,

  canTransitionTo: (currentStatus: AccountStatus, newStatus: AccountStatus): boolean => {
    if (currentStatus === AccountStatus.CLOSED) {
      return false;
    }
    return currentStatus !== newStatus;
  },

  getLabel: (status: AccountStatus): string => {
    switch (status) {
      case AccountStatus.ACTIVE:
        return 'Activa';
      case AccountStatus.INACTIVE:
        return 'Inactiva';
      case AccountStatus.SUSPENDED:
        return 'Suspendida';
      case AccountStatus.CLOSED:
        return 'Cerrada';
      default:
        return '';
    }
  },

  getOptions: (): Array<{ value: AccountStatus; label: string }> => [
    {value: AccountStatus.ACTIVE, label: 'Activa'},
    {value: AccountStatus.INACTIVE, label: 'Inactiva'},
    {value: AccountStatus.SUSPENDED, label: 'Suspendida'},
    {value: AccountStatus.CLOSED, label: 'Cerrada'}
  ]
};
