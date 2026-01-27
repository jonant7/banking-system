import {CustomerStatus, Gender} from '@core/models/customer';

export const GenderHelper = {
  getLabel: (gender: Gender): string => {
    switch (gender) {
      case Gender.MALE:
        return 'Masculino';
      case Gender.FEMALE:
        return 'Femenino';
      default:
        return '';
    }
  },

  getOptions: (): Array<{ value: Gender; label: string }> => [
    {value: Gender.MALE, label: 'Masculino'},
    {value: Gender.FEMALE, label: 'Femenino'}
  ]
};

export const CustomerStatusHelper = {
  isActive: (status: CustomerStatus): boolean => status === CustomerStatus.ACTIVE,

  isInactive: (status: CustomerStatus): boolean => status === CustomerStatus.INACTIVE,

  getLabel: (status: CustomerStatus): string => {
    switch (status) {
      case CustomerStatus.ACTIVE:
        return 'Activo';
      case CustomerStatus.INACTIVE:
        return 'Inactivo';
      default:
        return '';
    }
  },

  getOptions: (): Array<{ value: CustomerStatus; label: string }> => [
    {value: CustomerStatus.ACTIVE, label: 'Activo'},
    {value: CustomerStatus.INACTIVE, label: 'Inactivo'}
  ]
};
