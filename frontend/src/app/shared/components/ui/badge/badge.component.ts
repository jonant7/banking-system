import {ChangeDetectionStrategy, Component, Input, ViewEncapsulation,} from '@angular/core';
import {CommonModule} from '@angular/common';

export type BadgeVariant = 'success' | 'danger' | 'warning' | 'info' | 'secondary';

@Component({
  selector: 'app-badge',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span
      class="badge"
      [class]="variant"
      [attr.aria-label]="ariaLabel"
      role="status">
      <ng-content></ng-content>
    </span>
  `,
  styles: [`
    :host {
      display: inline-flex;
    }

    .badge {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 0.25rem 0.75rem;
      font-size: 0.75rem;
      font-weight: 600;
      line-height: 1;
      border-radius: 9999px;
      white-space: nowrap;
      text-transform: uppercase;
      letter-spacing: 0.025em;
      transition: all 0.2s ease-in-out;
    }

    .badge.success {
      background-color: #dcfce7;
      color: #166534;
    }

    .badge.danger {
      background-color: #fee2e2;
      color: #991b1b;
    }

    .badge.warning {
      background-color: #fef3c7;
      color: #92400e;
    }

    .badge.info {
      background-color: #dbeafe;
      color: #1e40af;
    }

    .badge.secondary {
      background-color: #f3f4f6;
      color: #374151;
    }

    .badge.success:hover {
      background-color: #bbf7d0;
    }

    .badge.danger:hover {
      background-color: #fecaca;
    }

    .badge.warning:hover {
      background-color: #fde68a;
    }

    .badge.info:hover {
      background-color: #bfdbfe;
    }

    .badge.secondary:hover {
      background-color: #e5e7eb;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class BadgeComponent {
  @Input() variant: BadgeVariant = 'secondary';
  @Input() ariaLabel?: string;
}
