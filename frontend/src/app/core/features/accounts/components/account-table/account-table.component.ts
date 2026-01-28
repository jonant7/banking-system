import {Component, EventEmitter, inject, Output, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {AccountApiResponse, AccountFilter, AccountStatusHelper, AccountTypeHelper} from '@core/models/account';
import {AccountService} from '@core/services/account.service';
import {
  DataTableComponent,
  DataTableConfig,
  DataTableParams,
  DataTableResponse
} from '@shared/components/ui/data-table/data-table.component';
import {ButtonComponent} from '@shared/components/ui/button/button.component';

@Component({
  selector: 'app-account-table',
  standalone: true,
  imports: [DataTableComponent, ButtonComponent],
  templateUrl: './account-table.component.html',
  styleUrl: './account-table.component.css'
})
export class AccountTableComponent {
  @ViewChild(DataTableComponent) dataTableComponent?: DataTableComponent;

  @Output() editAccount = new EventEmitter<AccountApiResponse>();
  @Output() toggleStatus = new EventEmitter<AccountApiResponse>();

  private readonly accountService = inject(AccountService);
  private readonly router = inject(Router);

  protected readonly tableConfig: DataTableConfig<AccountApiResponse> = {
    columns: [
      {
        key: 'accountNumber',
        label: 'Número de Cuenta',
        sortable: true,
        width: '150px'
      },
      {
        key: 'accountType',
        label: 'Tipo',
        sortable: true,
        width: '120px',
        pipe: (value) => AccountTypeHelper.getLabel(value)
      },
      {
        key: 'initialBalance',
        label: 'Saldo Inicial',
        sortable: true,
        width: '130px',
        pipe: (value: number) => this.formatCurrency(value)
      },
      {
        key: 'currentBalance',
        label: 'Saldo Actual',
        sortable: true,
        width: '130px',
        pipe: (value: number) => this.formatCurrency(value)
      },
      {
        key: 'status',
        label: 'Estado',
        sortable: true,
        width: '100px',
        pipe: (value) => AccountStatusHelper.getLabel(value)
      },
      {
        key: 'customerName',
        label: 'Cliente ID',
        sortable: false,
        width: '100px'
      }
    ],
    actions: [
      {
        label: 'Activar',
        variant: 'success',
        action: (account) => this.onToggle(account),
        condition: (account) => !AccountStatusHelper.isActive(account.status)
      },
      {
        label: 'Desactivar',
        variant: 'warning',
        action: (account) => this.onToggle(account),
        condition: (account) => AccountStatusHelper.isActive(account.status)
      }
    ],
    showSearch: true,
    showPagination: true,
    searchPlaceholder: 'Buscar por número de cuenta...',
    pageSize: 10,
    rowClickable: false
  };

  protected readonly loadAccounts = (
    params: DataTableParams
  ): Observable<DataTableResponse<AccountApiResponse>> => {
    const filter: AccountFilter = {
      page: params.page,
      size: params.pageSize,
      sortBy: params.sortBy || 'createdAt',
      sortDirection: params.sortDirection
    };

    const search = params.search?.trim();
    if (search) {
      filter.accountNumber = search;
    }

    return this.accountService.getAll(filter).pipe(
      map(response => ({
        content: response.content ?? [],
        totalPages: response.totalPages ?? 1,
        totalElements: response.totalElements ?? 0
      }))
    );
  };

  protected onToggle(account: AccountApiResponse): void {
    this.toggleStatus.emit(account);
  }

  refresh(): void {
    this.dataTableComponent?.refresh();
  }

  protected onCreateNew(): void {
    this.router.navigate(['/accounts/new']);
  }

  private formatCurrency(amount: number): string {
    return new Intl.NumberFormat('es-EC', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  }

}
