import {Gender} from '@core/models/customer/enums/gender.enum';
import {CustomerStatus} from '@core/models/customer';

export interface CustomerApiResponse {
  id: string;
  name: string;
  lastName: string;
  fullName?: string;
  gender: Gender;
  birthDate: string;
  age?: number;
  identification: string;
  address: string;
  phone?: string;
  customerId: string;
  status: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Customer {
  id: string;
  name: string;
  lastName: string;
  fullName?: string;
  gender: Gender;
  birthDate: string;
  age?: number;
  identification: string;
  address: string;
  phone?: string;
  customerId: string;
  status: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCustomerRequest {
  name: string;
  lastName: string;
  gender: Gender;
  birthDate: string;
  identification: string;
  address: string;
  phone?: string;
  customerId: string;
  password: string;
}

export interface UpdateCustomerRequest {
  name: string;
  lastName: string;
  gender: Gender;
  birthDate: string;
  address: string;
  phone?: string;
  password?: string;
}

export interface PatchCustomerRequest {
  address?: string;
  phone?: string;
  password?: string;
  status?: boolean;
}

export interface CustomerFilter {
  name?: string;
  lastName?: string;
  identification?: string;
  customerId?: string;
  gender?: Gender;
  birthDateFrom?: string;
  birthDateTo?: string;
  minAge?: number;
  maxAge?: number;
  status?: CustomerStatus;
  address?: string;
  phone?: string;
  page?: number;
  size?: number;
  sortBy?: string;
  sortDirection?: 'ASC' | 'DESC';
}

export interface CustomerFormData {
  name: string;
  lastName: string;
  gender: Gender | null;
  birthDate: Date | string | null;
  identification: string;
  address: string;
  phone: string;
  customerId: string;
  password: string;
  confirmPassword?: string;
}

export interface CustomerTableRow {
  id: string;
  fullName: string;
  identification: string;
  gender: string;
  age: number;
  address: string;
  phone: string;
  customerId: string;
  status: boolean;
  statusLabel: string;
  createdAt: Date;
}
