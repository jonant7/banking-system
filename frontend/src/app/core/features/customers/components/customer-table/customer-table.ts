import {Component, EventEmitter, inject, OnDestroy, Output, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {Observable, of} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {CustomerApiResponse, CustomerFilter} from '@core/models/customer';
import {CustomerService} from '@core/services/customer.service';
import {PageResponse} from '@core/models';
import {DataSourceQuery, RemoteTableDataSource} from '@shared/components/ui/table/table-data-source';
import {ButtonComponent} from '@shared/components/ui/button/button.component';
import {AdvancedTableComponent} from '@shared/components/ui/table/advanced-table.component';
import {
  ActionCellDefDirective,
  CellDefDirective,
  ColumnDefDirective,
  HeaderCellDefDirective
} from '@shared/components/ui/table/table-column.directives';

@Component({
  selector: 'app-customer-table',
  imports: [
    ButtonComponent,
    AdvancedTableComponent,
    ColumnDefDirective,
    HeaderCellDefDirective,
    CellDefDirective,
    ActionCellDefDirective,
  ],
  templateUrl: './customer-table.html',
  styleUrls: ['./customer-table.css'],
})
export class CustomerTable implements OnDestroy {
  @ViewChild(AdvancedTableComponent) table?: AdvancedTableComponent<CustomerApiResponse>;

  @Output() editCustomer = new EventEmitter<CustomerApiResponse>();
  @Output() toggleStatus = new EventEmitter<CustomerApiResponse>();

  private readonly customerService = inject(CustomerService);
  private readonly router = inject(Router);

  displayedColumns = [
    'customerId',
    'fullName',
    'identification',
    'address',
    'phone',
    'status',
    'actions',
  ];

  dataSource: RemoteTableDataSource<CustomerApiResponse>;

  constructor() {
    this.dataSource = new RemoteTableDataSource(
      (query) => this.loadCustomers(query),
      {
        pageSize: 10,
        searchDebounceTime: 400,
        defaultSortBy: 'createdAt',
        defaultSortDirection: 'DESC',
      }
    );
  }

  ngOnDestroy(): void {
    this.dataSource.disconnect();
  }

  private loadCustomers(query: DataSourceQuery): Observable<PageResponse<CustomerApiResponse>> {
    const filter: CustomerFilter = {
      page: query.page,
      size: query.pageSize,
      sortBy: query.sortBy || 'createdAt',
      sortDirection: query.sortDirection,
    };

    const search = query.search?.trim();
    if (search) {
      filter.name = search;
      filter.identification = search;
    }

    return this.customerService.getAll(filter).pipe(
      catchError((error) => {
        console.error('Error loading customers:', error);
        return of(this.emptyResponse(query));
      })
    );
  }

  private emptyResponse(query: DataSourceQuery): PageResponse<CustomerApiResponse> {
    return {
      content: [],
      totalElements: 0,
      totalPages: 0,
      page: query.page,
      size: query.pageSize,
      first: true,
      last: true,
      hasNext: false,
      hasPrevious: false,
    };
  }

  onEdit(customer: CustomerApiResponse): void {
    this.editCustomer.emit(customer);
  }

  onToggle(customer: CustomerApiResponse): void {
    this.toggleStatus.emit(customer);
  }

  refresh(): void {
    this.dataSource.refresh();
  }

  onCreateNew(): void {
    this.router.navigate(['/customers/new']);
  }

  getStatusLabel(status: boolean): string {
    return status ? 'Activo' : 'Inactivo';
  }

  isActive(status: boolean): boolean {
    return status;
  }

}
