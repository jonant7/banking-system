import {Component, EventEmitter, HostListener, Input, Output, TemplateRef} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Pagination} from '@shared/components/ui/pagination/pagination';

export interface TableColumn<T = any> {
  key: string;
  label: string;
  sortable?: boolean;
  width?: string;
  template?: TemplateRef<any>;
  pipe?: (value: any, row: T) => any;
}

export interface TableAction<T = any> {
  label: string;
  variant?: 'primary' | 'danger' | 'secondary' | 'success' | 'warning';
  action: (row: T) => void;
  condition?: (row: T) => boolean;
  disabled?: (row: T) => boolean;
}

export interface SortEvent {
  column: string;
  direction: 'asc' | 'desc';
}

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [CommonModule, Pagination],
  templateUrl: './table.html',
  styleUrl: './table.css'
})
export class Table<T = any> {
  @Input() columns: TableColumn<T>[] = [];
  @Input() data: T[] = [];
  @Input() actions: TableAction<T>[] = [];
  @Input() loading = false;
  @Input() emptyMessage = 'No hay datos disponibles';

  @Input() showPagination = true;
  @Input() currentPage = 1;
  @Input() totalPages = 1;
  @Input() pageSize = 10;
  @Input() totalItems = 0;

  @Input() sortColumn: string | null = null;
  @Input() sortDirection: 'asc' | 'desc' = 'asc';

  @Input() rowClickable = false;

  @Output() rowClicked = new EventEmitter<T>();
  @Output() sortChanged = new EventEmitter<SortEvent>();
  @Output() pageChanged = new EventEmitter<number>();

  openMenuIndex: number | null = null;

  get showActionsColumn(): boolean {
    return this.actions.length > 0;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.actions-menu-wrapper')) {
      this.openMenuIndex = null;
    }
  }

  toggleMenu(index: number, event: Event): void {
    event.stopPropagation();
    this.openMenuIndex = this.openMenuIndex === index ? null : index;
  }

  onSort(column: TableColumn<T>): void {
    if (!column.sortable) return;

    if (this.sortColumn === column.key) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column.key;
      this.sortDirection = 'asc';
    }

    this.sortChanged.emit({
      column: column.key,
      direction: this.sortDirection
    });
  }

  onRowClick(row: T, event: Event): void {
    if (!this.rowClickable) return;

    const target = event.target as HTMLElement;
    if (target.closest('.actions-menu-wrapper')) return;

    this.rowClicked.emit(row);
  }

  getCellValue(row: T, column: TableColumn<T>): any {
    const value = column.key.split('.').reduce((obj: any, k) => obj?.[k], row);

    if (column.pipe) {
      return column.pipe(value, row);
    }

    return value;
  }

  onPageChange(page: number): void {
    this.pageChanged.emit(page);
  }

  getVisibleActions(row: T): TableAction<T>[] {
    return this.actions.filter(action => {
      if (action.condition) {
        return action.condition(row);
      }
      return true;
    });
  }

  isActionDisabled(action: TableAction<T>, row: T): boolean {
    if (action.disabled) {
      return action.disabled(row);
    }
    return false;
  }

  executeAction(action: TableAction<T>, row: T, event: Event): void {
    event.stopPropagation();
    this.openMenuIndex = null;
    action.action(row);
  }

  trackByFn(index: number, item: any): any {
    return item.id || item.clienteId || index;
  }

}
