import {Component, inject} from '@angular/core';
import {NotificationService} from '@core/services/notification.service';
import {NotificationComponent} from '@shared/components/ui/notification/notification.component';

@Component({
  selector: 'app-notification-container',
  imports: [NotificationComponent],
  template: `
    <div class="notification-container">
      @for (notification of notificationService.notifications$(); track notification.id) {
        <app-notification
          [notification]="notification"
          (closed)="notificationService.remove($event)">
        </app-notification>
      }
    </div>
  `,
  styles: [`
    .notification-container {
      position: fixed;
      top: 80px;
      right: var(--spacing-lg);
      z-index: 9999;
      display: flex;
      flex-direction: column;
      gap: var(--spacing-sm);
      max-width: 400px;
    }
  `]
})
export class NotificationContainer {
  notificationService = inject(NotificationService);
}
