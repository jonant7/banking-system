import {
  CreateCustomerRequest,
  CustomerApiResponse,
  CustomerFormData,
  CustomerTableRow,
  UpdateCustomerRequest
} from '@core/models/customer';

export const CustomerMapper = {
  toTableRow: (customer: CustomerApiResponse): CustomerTableRow => ({
    id: customer.id,
    fullName: customer.fullName || `${customer.name} ${customer.lastName}`,
    identification: customer.identification,
    gender: customer.gender,
    age: customer.age || 0,
    address: customer.address,
    phone: customer.phone || '',
    customerId: customer.customerId,
    status: customer.status,
    statusLabel: customer.status ? 'Activo' : 'Inactivo',
    createdAt: new Date(customer.createdAt)
  }),

  toFormData: (customer: CustomerApiResponse): Partial<CustomerFormData> => ({
    name: customer.name,
    lastName: customer.lastName,
    gender: customer.gender,
    birthDate: customer.birthDate,
    identification: customer.identification,
    address: customer.address,
    phone: customer.phone || '',
    customerId: customer.customerId
  }),

  fromFormToCreateRequest: (formData: CustomerFormData): CreateCustomerRequest => ({
    name: formData.name.trim(),
    lastName: formData.lastName.trim(),
    gender: formData.gender!,
    birthDate: typeof formData.birthDate === 'string'
      ? formData.birthDate
      : formData.birthDate!.toISOString().split('T')[0],
    identification: formData.identification.trim(),
    address: formData.address.trim(),
    phone: formData.phone?.trim(),
    customerId: formData.customerId.trim(),
    password: formData.password
  }),

  fromFormToUpdateRequest: (formData: Partial<CustomerFormData>): UpdateCustomerRequest => ({
    name: formData.name!.trim(),
    lastName: formData.lastName!.trim(),
    gender: formData.gender!,
    birthDate: typeof formData.birthDate === 'string'
      ? formData.birthDate
      : formData.birthDate!.toISOString().split('T')[0],
    address: formData.address!.trim(),
    phone: formData.phone?.trim(),
    password: formData.password
  })
};
