export const environment = {
  production: true,
  api: {
    services: {
      customer: {
        baseUrl: '',
        version: 'v1'
      },
      account: {
        baseUrl: '',
        version: 'v1'
      }
    },
    routes: {
      '/api/customers': 'customer',
      '/api/accounts': 'account',
      '/api/transactions': 'account',
      '/api/reports': 'account'
    }
  }
};
