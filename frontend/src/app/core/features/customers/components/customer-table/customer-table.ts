import {Component, EventEmitter, inject, Output, ViewChild} from '@angular/core';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {CustomerApiResponse, CustomerFilter} from '@core/models/customer';
import {CustomerService} from '@core/services/customer.service';
import {
  DataTableComponent,
  DataTableConfig,
  DataTableParams,
  DataTableResponse
} from '@shared/components/ui/data-table/data-table.component';
import {ButtonComponent} from '@shared/components/ui/button/button.component';
import {Router} from '@angular/router';

@Component({
  selector: 'app-customer-table',
  standalone: true,
  imports: [DataTableComponent, ButtonComponent],
  templateUrl: './customer-table.html',
  styleUrl: './customer-table.css'
})
export class CustomerTable {
  @ViewChild(DataTableComponent) dataTableComponent?: DataTableComponent;

  @Output() editCustomer = new EventEmitter<CustomerApiResponse>();
  @Output() toggleStatus = new EventEmitter<CustomerApiResponse>();

  private customerService = inject(CustomerService);
  private router = inject(Router);

  tableConfig: DataTableConfig<CustomerApiResponse> = {
    columns: [
      {
        key: 'customerId',
        label: 'ID',
        sortable: true,
        width: '80px'
      },
      {
        key: 'fullName',
        label: 'Nombre',
        sortable: true
      },
      {
        key: 'identification',
        label: 'Identificación',
        sortable: true
      },
      {
        key: 'address',
        label: 'Dirección',
        sortable: false
      },
      {
        key: 'phone',
        label: 'Teléfono',
        sortable: false
      },
      {
        key: 'status',
        label: 'Estado',
        sortable: true,
        pipe: (value: boolean) => value ? 'Activo' : 'Inactivo'
      }
    ],
    actions: [
      {
        label: 'Editar',
        variant: 'primary',
        action: (customer) => this.onEdit(customer)
      },
      {
        label: 'Activar',
        variant: 'success',
        action: (customer) => this.onToggle(customer),
        condition: (customer) => !customer.status
      },
      {
        label: 'Desactivar',
        variant: 'warning',
        action: (customer) => this.onToggle(customer),
        condition: (customer) => customer.status
      }
    ],
    showSearch: true,
    showPagination: true,
    searchPlaceholder: 'Buscar por nombre o identificación ...',
    pageSize: 10,
    rowClickable: false
  };

  loadCustomers = (
    params: DataTableParams
  ): Observable<DataTableResponse<CustomerApiResponse>> => {

    const filter: CustomerFilter = {
      page: params.page,
      size: params.pageSize,
      sortBy: params.sortBy || 'createdAt',
      sortDirection: params.sortDirection
    };

    const search = params.search?.trim();
    if (search) {
      filter.name = search;
      filter.identification = search;
    }

    return this.customerService.getAll(filter).pipe(
      map(response => ({
        content: response.content ?? [],
        totalPages: response.totalPages ?? 1,
        totalElements: response.totalElements ?? 0
      }))
    );
  };

  onEdit(customer: CustomerApiResponse): void {
    this.editCustomer.emit(customer);
  }

  onToggle(customer: CustomerApiResponse): void {
    this.toggleStatus.emit(customer);
  }

  refresh(): void {
    this.dataTableComponent?.refresh();
  }

  onCreateNew(): void {
    this.router.navigate(['/customers/new']);
  }

}
