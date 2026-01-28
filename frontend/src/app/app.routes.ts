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
      }
    ]
  }
];
