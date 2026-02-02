import {Component, signal} from '@angular/core';
import {RouterLink, RouterLinkActive} from '@angular/router';

interface MenuItem {
  label: string;
  route: string;
}

@Component({
  selector: 'app-sidebar',
  imports: [
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {

  protected readonly menuItems = signal<MenuItem[]>([
    {label: 'Clientes', route: '/customers'},
    {label: 'Cuentas', route: '/accounts'},
    {label: 'Movimientos', route: '/transactions'},
    {label: 'Reportes', route: '/reports'}
  ]);

}
