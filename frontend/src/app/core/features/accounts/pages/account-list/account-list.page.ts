import {Component, inject, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {AccountService} from '@core/services/account.service';
import {NotificationService} from '@core/services/notification.service';
import {AccountApiResponse, AccountStatusHelper} from '@core/models/account';
import {AccountTableComponent} from '../../components/account-table/account-table.component';

@Component({
  selector: 'app-account-list',
  standalone: true,
  imports: [AccountTableComponent],
  templateUrl: './account-list.page.html',
  styleUrl: './account-list.page.css'
})
export class AccountListPage {
  @ViewChild(AccountTableComponent) accountTable?: AccountTableComponent;

  private readonly accountService = inject(AccountService);
  private readonly notificationService = inject(NotificationService);
  private readonly router = inject(Router);

  protected onEdit(account: AccountApiResponse): void {
    this.router.navigate(['/accounts', account.id]);
  }

  protected onToggleStatus(account: AccountApiResponse): void {
    const isActive = AccountStatusHelper.isActive(account.status);

    const action = isActive
      ? this.accountService.deactivate(account.id)
      : this.accountService.activate(account.id);

    action.subscribe({
      next: () => {
        this.accountTable?.refresh();
      }
    });
  }
}
