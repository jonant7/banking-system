import {Component, inject, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {CustomerService} from '@core/services/customer.service';
import {NotificationService} from '@core/services/notification.service';
import {CustomerApiResponse} from '@core/models/customer';
import {CustomerTable} from '../../components/customer-table/customer-table';

@Component({
  selector: 'app-customer-list',
  standalone: true,
  imports: [CustomerTable],
  templateUrl: './customer-list.page.html',
  styleUrl: './customer-list.page.css'
})
export class CustomerListPage implements OnInit {
  @ViewChild(CustomerTable) customerTable?: CustomerTable;

  private customerService = inject(CustomerService);
  private notificationService = inject(NotificationService);
  private router = inject(Router);

  ngOnInit(): void {
  }

  onEdit(customer: CustomerApiResponse): void {
    this.router.navigate(['/customers', customer.id, 'edit']);
  }

  onToggleStatus(customer: CustomerApiResponse): void {
    const action = customer.status
      ? this.customerService.deactivate(customer.id)
      : this.customerService.activate(customer.id);

    const actionText = customer.status ? 'desactivado' : 'activado';

    action.subscribe({
      next: () => {
        this.notificationService.success(`Cliente ${actionText} correctamente`);
        this.customerTable?.refresh();
      },
      error: () => {
        this.notificationService.error(`Error al ${actionText.slice(0, -1)}r el cliente`);
      }
    });
  }
}
