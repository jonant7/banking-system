import {Routes} from '@angular/router';
import {MainLayout} from './shared/components/layout/main-layout/main-layout';

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
    ]
  }
];
