import {ApiEnvironment} from '../app/core/models/common/models/api-config.model';

export const environment = {
  production: false,
  api: {
    services: {
      customer: {
        baseUrl: 'http://localhost:8081',
        version: 'v1'
      },
      account: {
        baseUrl: 'http://localhost:8082',
        version: 'v1'
      }
    },
    routes: {
      '/api/customers': 'customer',
      '/api/accounts': 'account',
      '/api/transactions': 'account',
      '/api/reports': 'account'
    }
  } as ApiEnvironment
};
