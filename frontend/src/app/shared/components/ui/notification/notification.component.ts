import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  duration?: number;
}

@Component({
  selector: 'app-notification',
  imports: [],
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.css'
})
export class NotificationComponent implements OnInit {
  @Input() notification!: Notification;
  @Output() closed = new EventEmitter<string>();

  ngOnInit(): void {
    if (this.notification.duration) {
      setTimeout(() => {
        this.onClose();
      }, this.notification.duration);
    }
  }

  onClose(): void {
    this.closed.emit(this.notification.id);
  }

  getIcon(): string {
    const icons = {
      success: 'M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z',
      error: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z',
      warning: 'M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z',
      info: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z'
    };
    return icons[this.notification.type];
  }

}
