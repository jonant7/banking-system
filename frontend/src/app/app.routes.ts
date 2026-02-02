import {Routes} from '@angular/router';
import {MainLayout} from '@shared/components/layout/main-layout/main-layout';

export const routes: Routes = [
  {
    path: '',
    component: MainLayout,
    children: [
      {
        path: '',
        redirectTo: 'customers',
        pathMatch: 'full'
      },
      {
        path: 'customers',
        loadComponent: () =>
          import('./core/features/customers/pages/customer-list/customer-list.page').then(
            (m) => m.CustomerListPage
          )
      },
      {
        path: 'customers/new',
        loadComponent: () =>
          import('./core/features/customers/pages/customer-form/customer-form.page').then(
            (m) => m.CustomerFormPage
          )
      },
      {
        path: 'customers/:id/edit',
        loadComponent: () =>
          import('./core/features/customers/pages/customer-form/customer-form.page').then(
            (m) => m.CustomerFormPage
          )
      },
      {
        path: 'accounts',
        loadComponent: () =>
          import('./core/features/accounts/pages/account-list/account-list.page').then(
            (m) => m.AccountListPage
          )
      },
      {
        path: 'accounts/new',
        loadComponent: () =>
          import('./core/features/accounts/pages/account-form/account-form.page').then(
            (m) => m.AccountFormPage
          )
      },
      {
        path: 'accounts/:id',
        loadComponent: () =>
          import('./core/features/accounts/pages/account-form/account-form.page').then(
            (m) => m.AccountFormPage
          )
      },
      {
        path: 'transactions',
        loadComponent: () =>
          import('./core/features/transactions/pages/transaction-list/transaction-list.page').then(
            (m) => m.TransactionListPage
          )
      },
      {
        path: 'transactions/new',
        loadComponent: () =>
          import('./core/features/transactions/pages/transaction-form/transaction-form.page').then(
            (m) => m.TransactionFormPage
          )
      },
      {
        path: 'reports',
        loadComponent: () =>
          import('./core/features/reports/pages/report-list/report-list.page').then(
            (m) => m.ReportListPage
          )
      }
    ]
  }
];
