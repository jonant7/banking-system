import {Component, computed, inject, OnInit, signal} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import {AccountService} from '@core/services/account.service';
import {AccountApiResponse} from '@core/models/account';
import {TransactionTableComponent} from '../../components/transaction-table/transaction-table.component';
import {SelectComponent} from '@shared/components/ui/select/select.component';
import {ButtonComponent} from '@shared/components/ui/button/button.component';
import {CardComponent} from '@shared/components/ui/card/card/card.component';

@Component({
  selector: 'app-transaction-list',
  standalone: true,
  imports: [FormsModule, SelectComponent, ButtonComponent, CardComponent, TransactionTableComponent],
  templateUrl: './transaction-list.page.html',
  styleUrl: './transaction-list.page.css'
})
export class TransactionListPage implements OnInit {
  private accountService = inject(AccountService);
  private route = inject(ActivatedRoute);

  accounts = signal<AccountApiResponse[]>([]);
  selectedAccountId = signal<string>('');
  startDate = signal<string>('');
  endDate = signal<string>('');
  appliedStartDate = signal<string>('');
  appliedEndDate = signal<string>('');
  loading = signal(false);

  accountOptions = computed(() => {
    return this.accounts().map(account => ({
      value: account.id,
      label: `${account.accountNumber} - ${account.customerName || 'Sin nombre'} (${this.formatCurrency(account.currentBalance)})`
    }));
  });

  selectedAccount = computed(() => {
    return this.accounts().find(acc => acc.id === this.selectedAccountId());
  });

  hasDateFilter = computed(() => {
    return !!this.appliedStartDate() && !!this.appliedEndDate();
  });

  ngOnInit(): void {
    this.loadAccounts();
    this.checkQueryParams();
  }

  private loadAccounts(): void {
    this.loading.set(true);
    this.accountService.getAll({
      page: 0,
      size: 1000,
      sortBy: 'number',
      sortDirection: 'ASC'
    }).subscribe({
      next: (response) => {
        this.accounts.set(response.content ?? []);
        this.loading.set(false);
        this.checkQueryParams();
      },
      error: () => {
        this.loading.set(false);
      }
    });
  }

  private checkQueryParams(): void {
    this.route.queryParams.subscribe(params => {
      const accountId = params['accountId'];
      if (accountId && this.accounts().length > 0) {
        const accountExists = this.accounts().some(acc => acc.id === accountId);
        if (accountExists) {
          this.selectedAccountId.set(accountId);
        }
      }
    });
  }

  onAccountChange(accountId: string | number): void {
    this.selectedAccountId.set(accountId.toString());
    this.startDate.set('');
    this.endDate.set('');
    this.appliedStartDate.set('');
    this.appliedEndDate.set('');
  }

  applyDateFilter(): void {
    if (!this.startDate() || !this.endDate()) return;

    if (new Date(this.startDate()) > new Date(this.endDate())) {
      alert('La fecha inicial no puede ser mayor a la fecha final');
      return;
    }

    this.appliedStartDate.set(this.startDate());
    this.appliedEndDate.set(this.endDate());
  }

  clearDateFilter(): void {
    this.startDate.set('');
    this.endDate.set('');
    this.appliedStartDate.set('');
    this.appliedEndDate.set('');
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('es-EC', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  }

}
