import {AccountStatus, AccountType} from '@core/models/account';

export interface AccountApiResponse {
  id: string;
  accountNumber: string;
  accountType: AccountType;
  initialBalance: number;
  currentBalance: number;
  status: AccountStatus;
  customerId: string;
  customerName: string;
  createdAt: string;
  updatedAt: string;
}

export interface Account {
  id: string;
  accountNumber: string;
  accountType: AccountType;
  initialBalance: number;
  currentBalance: number;
  status: AccountStatus;
  customerId: string;
  customerName: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAccountRequest {
  accountNumber: string;
  accountType: AccountType;
  initialBalance: number;
  customerId: string;
}

export interface AccountFilter {
  accountNumber?: string;
  accountType?: AccountType;
  status?: AccountStatus;
  customerId?: string;
  minBalance?: number;
  maxBalance?: number;
  page?: number;
  size?: number;
  sortBy?: string;
  sortDirection?: 'ASC' | 'DESC';
}

export interface AccountFormData {
  accountNumber: string;
  accountType: AccountType | null;
  initialBalance: number | null;
  customerId: string;
}

export interface AccountTableRow {
  id: string;
  accountNumber: string;
  accountType: string;
  accountTypeLabel: string;
  initialBalance: number;
  currentBalance: number;
  status: AccountStatus;
  statusLabel: string;
  customerId: string;
  customerName: string;
  createdAt: Date;
}

export interface AccountCard {
  id: string;
  accountNumber: string;
  accountType: AccountType;
  accountTypeLabel: string;
  currentBalance: number;
  formattedBalance: string;
  status: AccountStatus;
  statusLabel: string;
  isActive: boolean;
}
