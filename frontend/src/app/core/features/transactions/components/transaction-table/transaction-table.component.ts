import {Component, inject, Input, OnChanges, OnDestroy, SimpleChanges, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {Observable, of} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {TransactionService} from '@core/services/transaction.service';
import {TransactionApiResponse, TransactionType, TransactionTypeHelper} from '@core/models/transaction';
import {ApiResponse, PageResponse} from '@core/models';
import {DateUtils} from '@core/utils/date.utils';
import {FormatUtils} from '@core/utils/format.utils';
import {
  CellDefDirective,
  ColumnDefDirective,
  HeaderCellDefDirective
} from '@shared/components/ui/table/table-column.directives';
import {DataSourceQuery, RemoteTableDataSource} from '@shared/components/ui/table/table-data-source';
import {BadgeComponent} from '@shared/components/ui/badge/badge.component';
import {ButtonComponent} from '@shared/components/ui/button/button.component';
import {AdvancedTableComponent} from '@shared/components/ui/table/advanced-table.component';

@Component({
  selector: 'app-transaction-table',
  imports: [
    AdvancedTableComponent,
    ColumnDefDirective,
    CellDefDirective,
    HeaderCellDefDirective,
    BadgeComponent,
    ButtonComponent,
  ],
  templateUrl: './transaction-table.component.html',
  styleUrls: ['./transaction-table.component.css'],
})
export class TransactionTableComponent implements OnChanges, OnDestroy {
  @ViewChild(AdvancedTableComponent) table?: AdvancedTableComponent<TransactionApiResponse>;

  @Input({required: true}) accountId!: string;
  @Input() startDate = '';
  @Input() endDate = '';

  private readonly transactionService = inject(TransactionService);
  private readonly router = inject(Router);

  displayedColumns = ['createdAt', 'type', 'amount', 'balanceBefore', 'balanceAfter', 'reference'];
  dataSource: RemoteTableDataSource<TransactionApiResponse>;

  constructor() {
    this.dataSource = new RemoteTableDataSource(
      (query) => this.loadTransactions(query),
      {
        pageSize: 10,
        searchDebounceTime: 400,
        defaultSortBy: 'createdAt',
        defaultSortDirection: 'DESC',
      }
    );
  }

  ngOnChanges(changes: SimpleChanges): void {
    const hasRelevantChanges = changes['accountId'] || changes['startDate'] || changes['endDate'];
    if (hasRelevantChanges) {
      setTimeout(() => this.dataSource.refresh());
    }
  }

  ngOnDestroy(): void {
    this.dataSource.disconnect();
  }

  private loadTransactions(query: DataSourceQuery): Observable<PageResponse<TransactionApiResponse>> {
    if (!this.accountId) {
      return of(this.emptyResponse());
    }

    if (this.hasDateRange()) {
      return this.loadByDateRange(query);
    }

    return this.loadPaginated(query);
  }

  private loadByDateRange(query: DataSourceQuery): Observable<PageResponse<TransactionApiResponse>> {
    return this.transactionService
      .getByDateRange(this.accountId, this.startDate, this.endDate)
      .pipe(
        map((apiResponse: ApiResponse<TransactionApiResponse[]>) => {
          const data = apiResponse.data || [];
          const filtered = query.search
            ? data.filter((t) => JSON.stringify(t).toLowerCase().includes(query.search.toLowerCase()))
            : data;

          return this.buildPageResponse(filtered, 0, filtered.length);
        }),
        catchError((error) => {
          console.error('Error loading transactions (date range):', error);
          return of(this.emptyResponse());
        })
      );
  }

  private loadPaginated(query: DataSourceQuery): Observable<PageResponse<TransactionApiResponse>> {
    return this.transactionService
      .getByAccountId(
        this.accountId,
        query.page,
        query.pageSize,
        query.sortBy || 'createdAt',
        query.sortDirection
      )
      .pipe(
        catchError((error) => {
          console.error('Error loading transactions (pagination):', error);
          return of(this.emptyResponse());
        })
      );
  }

  private buildPageResponse(
    content: TransactionApiResponse[],
    page: number,
    size: number
  ): PageResponse<TransactionApiResponse> {
    const totalElements = content.length;
    const totalPages = Math.max(1, Math.ceil(totalElements / size));

    return {
      content,
      totalElements,
      totalPages,
      page,
      size,
      first: page === 0,
      last: page >= totalPages - 1,
      hasNext: page < totalPages - 1,
      hasPrevious: page > 0,
    };
  }

  private emptyResponse(): PageResponse<TransactionApiResponse> {
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

  private hasDateRange(): boolean {
    return !!(this.startDate && this.endDate);
  }

  canCreateTransaction(): boolean {
    return !!this.accountId;
  }

  createTransaction(): void {
    if (!this.canCreateTransaction()) return;

    this.router.navigate(['/transactions/new'], {
      queryParams: {accountId: this.accountId},
    });
  }

  refresh(): void {
    this.dataSource.refresh();
  }

  formatDate(date: string): string {
    return DateUtils.formatDate(date);
  }

  formatDateTime(date: string): string {
    return DateUtils.formatDateTime(date);
  }

  formatCurrency(amount: number): string {
    return FormatUtils.formatCurrency(amount);
  }

  getTypeBadgeVariant(type: string): 'success' | 'danger' | 'warning' {
    switch (type?.toUpperCase()) {
      case 'DEPOSIT':
      case 'INCOME':
        return 'success';
      case 'WITHDRAWAL':
      case 'EXPENSE':
        return 'danger';
      default:
        return 'warning';
    }
  }

  getAmountBadgeVariant(type: TransactionType): 'success' | 'danger' {
    return TransactionTypeHelper.isDeposit(type) ? 'success' : 'danger';
  }

  getTypeLabel(type: TransactionType): string {
    return TransactionTypeHelper.getLabel(type);
  }

  getTypeIcon(type: TransactionType): string {
    return TransactionTypeHelper.getIcon(type);
  }

}
