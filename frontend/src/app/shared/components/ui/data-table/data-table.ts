import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Observable} from 'rxjs';
import {SortEvent, Table, TableAction, TableColumn} from '@shared/components/ui/table/table';
import {SearchBox} from '@shared/components/ui/search-box/search-box';

export interface DataTableConfig<T> {
  columns: TableColumn<T>[];
  actions?: TableAction<T>[];
  showSearch?: boolean;
  showPagination?: boolean;
  searchPlaceholder?: string;
  searchDebounce?: number;
  pageSize?: number;
  emptyMessage?: string;
  rowClickable?: boolean;
}

export interface DataTableParams {
  page: number;
  pageSize: number;
  search: string;
  sortBy: string | null;
  sortDirection: 'ASC' | 'DESC';
}

export interface DataTableResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
}

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [CommonModule, Table, SearchBox],
  templateUrl: './data-table.html',
  styleUrl: './data-table.css'
})
export class DataTable<T = any> implements OnInit, OnChanges {
  @ViewChild(Table) tableComponent?: Table<T>;

  @Input() config!: DataTableConfig<T>;
  @Input() dataSource!: (params: DataTableParams) => Observable<DataTableResponse<T>>;
  @Input() loading = false;

  @Output() rowClicked = new EventEmitter<T>();

  data: T[] = [];
  currentPage = 1;
  totalPages = 1;
  totalItems = 0;
  searchQuery = '';
  sortColumn: string | null = null;
  sortDirection: 'asc' | 'desc' = 'asc';

  constructor(private cdr: ChangeDetectorRef) {
  }

  get showSearchBox(): boolean {
    return this.config?.showSearch !== false;
  }

  get showPaginationControl(): boolean {
    return this.config?.showPagination !== false;
  }

  get pageSize(): number {
    return this.config?.pageSize || 10;
  }

  get searchPlaceholder(): string {
    return this.config?.searchPlaceholder || 'Buscar...';
  }

  get searchDebounce(): number {
    return this.config?.searchDebounce || 400;
  }

  ngOnInit(): void {
    setTimeout(() => this.loadData());
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['dataSource'] && !changes['dataSource'].firstChange) {
      this.loadData();
    }
  }

  onSearch(query: string): void {
    this.searchQuery = query;
    this.currentPage = 1;
    this.loadData();
  }

  onSort(event: SortEvent): void {
    this.sortColumn = event.column;
    this.sortDirection = event.direction;
    this.loadData();
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadData();
  }

  onRowClick(row: T): void {
    this.rowClicked.emit(row);
  }

  private loadData(): void {
    if (!this.dataSource) return;

    this.loading = true;

    const params: DataTableParams = {
      page: this.currentPage - 1,
      pageSize: this.pageSize,
      search: this.searchQuery,
      sortBy: this.sortColumn,
      sortDirection: this.sortDirection === 'asc' ? 'ASC' : 'DESC'
    };

    this.dataSource(params).subscribe({
      next: (response) => {
        this.data = response.content;
        this.totalPages = response.totalPages;
        this.totalItems = response.totalElements;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error al cargar datos:', error);
        this.loading = false;
        this.data = [];
        this.totalPages = 1;
        this.totalItems = 0;
        this.cdr.detectChanges();
      }
    });
  }

  refresh(): void {
    this.loadData();
  }

  reset(): void {
    this.searchQuery = '';
    this.currentPage = 1;
    this.sortColumn = null;
    this.sortDirection = 'asc';
    this.loadData();
  }

}
