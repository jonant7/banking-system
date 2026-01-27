import {
  AccountApiResponse,
  AccountCard,
  AccountFormData,
  AccountStatus,
  AccountTableRow,
  AccountType,
  CreateAccountRequest
} from '@core/models/account';

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('es-EC', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
}

function getStatusLabel(status: AccountStatus): string {
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
}

export const AccountMapper = {
  toTableRow: (account: AccountApiResponse): AccountTableRow => ({
    id: account.id,
    accountNumber: account.accountNumber,
    accountType: account.accountType,
    accountTypeLabel: account.accountType === AccountType.SAVINGS ? 'Ahorros' : 'Corriente',
    initialBalance: account.initialBalance,
    currentBalance: account.currentBalance,
    status: account.status,
    statusLabel: getStatusLabel(account.status),
    customerId: account.customerId,
    createdAt: new Date(account.createdAt)
  }),

  toCard: (account: AccountApiResponse): AccountCard => ({
    id: account.id,
    accountNumber: account.accountNumber,
    accountType: account.accountType,
    accountTypeLabel: account.accountType === AccountType.SAVINGS ? 'Ahorros' : 'Corriente',
    currentBalance: account.currentBalance,
    formattedBalance: formatCurrency(account.currentBalance),
    status: account.status,
    statusLabel: getStatusLabel(account.status),
    isActive: account.status === AccountStatus.ACTIVE
  }),

  toFormData: (account: AccountApiResponse): Partial<AccountFormData> => ({
    accountNumber: account.accountNumber,
    accountType: account.accountType,
    initialBalance: account.initialBalance,
    customerId: account.customerId
  }),

  fromFormToCreateRequest: (formData: AccountFormData): CreateAccountRequest => ({
    accountNumber: formData.accountNumber.trim(),
    accountType: formData.accountType!,
    initialBalance: formData.initialBalance!,
    customerId: formData.customerId
  })
};
