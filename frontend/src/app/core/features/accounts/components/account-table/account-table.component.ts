import {Component, EventEmitter, inject, OnDestroy, Output, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {Observable, of} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {
  AccountApiResponse,
  AccountFilter,
  AccountStatus,
  AccountStatusHelper,
  AccountType,
  AccountTypeHelper
} from '@core/models/account';
import {AccountService} from '@core/services/account.service';
import {PageResponse} from '@core/models';
import {
  ActionCellDefDirective,
  CellDefDirective,
  ColumnDefDirective,
  HeaderCellDefDirective
} from '@shared/components/ui/table/table-column.directives';
import {DataSourceQuery, RemoteTableDataSource} from '@shared/components/ui/table/table-data-source';
import {ButtonComponent} from '@shared/components/ui/button/button.component';
import {AdvancedTableComponent} from '@shared/components/ui/table/advanced-table.component';

@Component({
  selector: 'app-account-table',
  imports: [
    AdvancedTableComponent,
    ColumnDefDirective,
    CellDefDirective,
    HeaderCellDefDirective,
    ActionCellDefDirective,
    ButtonComponent,
  ],
  templateUrl: './account-table.component.html',
  styleUrls: ['./account-table.component.css'],
})
export class AccountTableComponent implements OnDestroy {
  @ViewChild(AdvancedTableComponent) table?: AdvancedTableComponent<AccountApiResponse>;

  @Output() editAccount = new EventEmitter<AccountApiResponse>();
  @Output() toggleStatus = new EventEmitter<AccountApiResponse>();

  private readonly accountService = inject(AccountService);
  private readonly router = inject(Router);

  displayedColumns = [
    'accountNumber',
    'accountType',
    'initialBalance',
    'currentBalance',
    'status',
    'customerName',
    'actions',
  ];

  dataSource: RemoteTableDataSource<AccountApiResponse>;

  constructor() {
    this.dataSource = new RemoteTableDataSource(
      (query) => this.loadAccounts(query),
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

  private loadAccounts(query: DataSourceQuery): Observable<PageResponse<AccountApiResponse>> {
    const filter: AccountFilter = {
      page: query.page,
      size: query.pageSize,
      sortBy: query.sortBy || 'createdAt',
      sortDirection: query.sortDirection,
    };

    const search = query.search?.trim();
    if (search) {
      filter.accountNumber = search;
    }

    return this.accountService.getAll(filter).pipe(
      catchError((error) => {
        console.error('Error loading accounts:', error);
        return of(this.emptyResponse());
      })
    );
  }

  private emptyResponse(): PageResponse<AccountApiResponse> {
    return {
      content: [],
      totalElements: 0,
      totalPages: 0,
      page: 0,
      size: 10,
      first: true,
      last: true,
      hasNext: false,
      hasPrevious: false,
    };
  }

  onToggle(account: AccountApiResponse): void {
    this.toggleStatus.emit(account);
  }

  refresh(): void {
    this.dataSource.refresh();
  }

  onCreateNew(): void {
    this.router.navigate(['/accounts/new']);
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('es-EC', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  }

  getAccountTypeLabel(type: AccountType): string {
    return AccountTypeHelper.getLabel(type);
  }

  getAccountStatusLabel(status: AccountStatus): string {
    return AccountStatusHelper.getLabel(status);
  }

  isAccountActive(status: AccountStatus): boolean {
    return AccountStatusHelper.isActive(status);
  }

}
