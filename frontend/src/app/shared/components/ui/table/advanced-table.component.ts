import {
  AfterContentInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  QueryList,
} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Subject, takeUntil} from 'rxjs';
import {TableDataSource} from './table-data-source';
import {ColumnDefDirective} from './table-column.directives';
import {TablePaginationComponent} from '@shared/components/ui/table/table-pagination.component';
import {TableSearchComponent} from '@shared/components/ui/table/table-search.component';

@Component({
  selector: 'app-advanced-table',
  standalone: true,
  imports: [
    CommonModule,
    TablePaginationComponent,
    TableSearchComponent,
  ],
  templateUrl: './advanced-table.component.html',
  styleUrls: ['./advanced-table.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdvancedTableComponent<T = any> implements OnInit, AfterContentInit, OnDestroy {
  private readonly destroy$ = new Subject<void>();

  @Input({required: true}) dataSource!: TableDataSource<T>;
  @Input({required: true}) displayedColumns: string[] = [];
  @Input() rowClickable = false;
  @Input() stickyHeader = false;
  @Input() showSearch = true;
  @Input() showPagination = true;
  @Input() showPageInfo = true;
  @Input() showPageSizeOptions = true;
  @Input() pageSizeOptions = [5, 10, 25, 50, 100];
  @Input() searchPlaceholder = 'Buscar...';
  @Input() searchAriaLabel = 'Buscar en la tabla';
  @Input() emptyMessage = 'No hay datos disponibles';
  @Input() loadingMessage = 'Cargando...';
  @Input() trackBy: (index: number, item: T) => any = (index) => index;

  @Output() rowClick = new EventEmitter<T>();
  @Output() sortChange = new EventEmitter<{ column: string; direction: 'ASC' | 'DESC' }>();

  @ContentChildren(ColumnDefDirective) columnDefs!: QueryList<ColumnDefDirective<T>>;

  data: T[] = [];
  loading = false;
  totalElements = 0;
  sortBy?: string;
  sortDirection?: 'ASC' | 'DESC';
  openActionMenuIndex: number | null = null;

  private columnDefMap = new Map<string, ColumnDefDirective<T>>();

  constructor(private cdr: ChangeDetectorRef) {
  }

  ngOnInit(): void {
    this.subscribeToDataSource();
    document.addEventListener('click', this.closeActionMenu.bind(this));
  }

  ngAfterContentInit(): void {
    this.buildColumnDefMap();
    this.columnDefs.changes
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.buildColumnDefMap());
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    document.removeEventListener('click', this.closeActionMenu.bind(this));
  }

  private subscribeToDataSource(): void {
    this.dataSource.data$
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.data = data;
        this.cdr.markForCheck();
      });

    this.dataSource.loading$
      .pipe(takeUntil(this.destroy$))
      .subscribe((loading) => {
        this.loading = loading;
        this.cdr.markForCheck();
      });

    this.dataSource.totalElements$
      .pipe(takeUntil(this.destroy$))
      .subscribe((total) => {
        this.totalElements = total;
        this.cdr.markForCheck();
      });

    const state = this.dataSource.getState();
    this.sortBy = state.sortBy;
    this.sortDirection = state.sortDirection;
  }

  private buildColumnDefMap(): void {
    this.columnDefMap.clear();
    this.columnDefs.forEach((def) => {
      this.columnDefMap.set(def.name, def);
    });
    this.cdr.markForCheck();
  }

  getColumnDef(columnName: string): ColumnDefDirective<T> | undefined {
    return this.columnDefMap.get(columnName);
  }

  getColumnWidth(columnName: string): string | undefined {
    return this.columnDefMap.get(columnName)?.width;
  }

  getHeaderClasses(columnName: string): string {
    const columnDef = this.columnDefMap.get(columnName);
    const classes: string[] = [];

    if (columnDef?.sortable) {
      classes.push('sortable');
    }

    if (columnDef?.align) {
      classes.push(`text-${columnDef.align}`);
    }

    if (columnDef?.headerClass) {
      classes.push(columnDef.headerClass);
    }

    return classes.join(' ');
  }

  getCellClasses(columnName: string, row: T): string {
    const columnDef = this.columnDefMap.get(columnName);
    const classes: string[] = [];

    if (columnDef?.align) {
      classes.push(`text-${columnDef.align}`);
    }

    if (columnDef?.cellClass) {
      if (typeof columnDef.cellClass === 'function') {
        classes.push(columnDef.cellClass(row));
      } else {
        classes.push(columnDef.cellClass);
      }
    }

    return classes.join(' ');
  }

  getRowClasses(row: T, index: number): string {
    const classes: string[] = ['table-row'];

    if (this.rowClickable) {
      classes.push('clickable');
    }

    if (index % 2 === 0) {
      classes.push('even');
    } else {
      classes.push('odd');
    }

    return classes.join(' ');
  }

  handleHeaderClick(columnName: string): void {
    const columnDef = this.columnDefMap.get(columnName);
    if (!columnDef?.sortable) return;

    let newDirection: 'ASC' | 'DESC';

    if (this.sortBy === columnName) {
      newDirection = this.sortDirection === 'ASC' ? 'DESC' : 'ASC';
    } else {
      newDirection = 'ASC';
    }

    this.sortBy = columnName;
    this.sortDirection = newDirection;

    this.dataSource.setSort(columnName, newDirection);
    this.sortChange.emit({column: columnName, direction: newDirection});
  }

  handleRowClick(row: T): void {
    if (this.rowClickable) {
      this.rowClick.emit(row);
    }
  }

  shouldShowSortIcon(columnName: string): boolean {
    return this.sortBy === columnName;
  }

  getAriaSortValue(columnName: string): string | null {
    const columnDef = this.columnDefMap.get(columnName);
    if (!columnDef?.sortable) return null;

    if (this.sortBy !== columnName) return 'none';
    return this.sortDirection === 'ASC' ? 'ascending' : 'descending';
  }

  getHeaderContext(columnName: string): any {
    return {column: columnName};
  }

  getCellContext(row: T, columnName: string, index: number): any {
    return {
      $implicit: row,
      value: (row as any)[columnName],
      index,
      column: columnName,
    };
  }

  getDefaultCellValue(row: T, columnName: string): any {
    return (row as any)[columnName] ?? '—';
  }

  toggleActionMenu(event: Event, rowIndex: number): void {
    event.stopPropagation();
    this.openActionMenuIndex = this.openActionMenuIndex === rowIndex ? null : rowIndex;
    this.cdr.markForCheck();
  }

  isActionMenuOpen(rowIndex: number): boolean {
    return this.openActionMenuIndex === rowIndex;
  }

  closeActionMenu(): void {
    if (this.openActionMenuIndex !== null) {
      this.openActionMenuIndex = null;
      this.cdr.markForCheck();
    }
  }
}
