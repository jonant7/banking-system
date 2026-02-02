import {
  BehaviorSubject,
  catchError,
  debounceTime,
  distinctUntilChanged,
  finalize,
  merge,
  Observable,
  of,
  Subject,
  switchMap
} from 'rxjs';

export interface DataSourceQuery {
  page: number;
  pageSize: number;
  sortBy?: string;
  sortDirection?: 'ASC' | 'DESC';
  search: string;
}

export interface DataSourceState {
  page: number;
  pageSize: number;
  sortBy?: string;
  sortDirection?: 'ASC' | 'DESC';
  search: string;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  page: number;
  size: number;
  first: boolean;
  last: boolean;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface DataSourceConfig {
  pageSize?: number;
  searchDebounceTime?: number;
  defaultSortBy?: string;
  defaultSortDirection?: 'ASC' | 'DESC';
}

export abstract class TableDataSource<T> {
  protected readonly stateSubject: BehaviorSubject<DataSourceState>;
  protected readonly loadingSubject = new BehaviorSubject<boolean>(false);
  protected readonly dataSubject = new BehaviorSubject<T[]>([]);
  protected readonly totalElementsSubject = new BehaviorSubject<number>(0);
  protected readonly totalPagesSubject = new BehaviorSubject<number>(0);
  protected readonly currentPageSubject = new BehaviorSubject<number>(0);
  protected readonly pageSizeSubject = new BehaviorSubject<number>(10);

  readonly loading$ = this.loadingSubject.asObservable();
  readonly data$ = this.dataSubject.asObservable();
  readonly totalElements$ = this.totalElementsSubject.asObservable();
  readonly totalPages$ = this.totalPagesSubject.asObservable();
  readonly currentPage$ = this.currentPageSubject.asObservable();
  readonly pageSize$ = this.pageSizeSubject.asObservable();

  protected constructor(protected config: DataSourceConfig = {}) {
    const initialPageSize = config.pageSize ?? 10;
    const initialState: DataSourceState = {
      page: 0,
      pageSize: initialPageSize,
      sortBy: config.defaultSortBy,
      sortDirection: config.defaultSortDirection ?? 'ASC',
      search: '',
    };
    this.stateSubject = new BehaviorSubject(initialState);
    this.pageSizeSubject.next(initialPageSize);
    this.currentPageSubject.next(0);
  }

  abstract loadData(): void;

  getState(): DataSourceState {
    return this.stateSubject.value;
  }

  setPage(page: number): void {
    const state = this.stateSubject.value;
    if (state.page !== page) {
      this.stateSubject.next({...state, page});
      this.loadData();
    }
  }

  setPageSize(pageSize: number): void {
    const state = this.stateSubject.value;
    if (state.pageSize !== pageSize) {
      this.pageSizeSubject.next(pageSize);
      this.stateSubject.next({...state, pageSize, page: 0});
      this.currentPageSubject.next(0);
      this.loadData();
    }
  }

  setSort(sortBy: string, sortDirection: 'ASC' | 'DESC'): void {
    const state = this.stateSubject.value;
    this.stateSubject.next({...state, sortBy, sortDirection, page: 0});
    this.loadData();
  }

  setSearch(search: string): void {
    const state = this.stateSubject.value;
    if (state.search !== search) {
      this.stateSubject.next({...state, search, page: 0});
    }
  }

  refresh(): void {
    this.loadData();
  }

  disconnect(): void {
    this.loadingSubject.complete();
    this.dataSubject.complete();
    this.totalElementsSubject.complete();
    this.totalPagesSubject.complete();
    this.currentPageSubject.complete();
    this.pageSizeSubject.complete();
    this.stateSubject.complete();
  }

  protected updateData(response: PageResponse<T>): void {
    this.dataSubject.next(response.content);
    this.totalElementsSubject.next(response.totalElements);
    this.totalPagesSubject.next(response.totalPages);
    this.currentPageSubject.next(response.page);
    this.pageSizeSubject.next(response.size);
  }

  protected setLoading(loading: boolean): void {
    this.loadingSubject.next(loading);
  }
}

export class RemoteTableDataSource<T> extends TableDataSource<T> {
  private readonly searchSubject = new Subject<string>();
  private readonly paginationSubject = new Subject<void>();

  constructor(
    private loadFn: (query: DataSourceQuery) => Observable<PageResponse<T>>,
    config: DataSourceConfig = {}
  ) {
    super(config);
    this.initializeDataStream();
  }

  private initializeDataStream(): void {
    const searchDebounceTime = this.config.searchDebounceTime ?? 300;

    const searchStream$ = this.searchSubject.pipe(
      debounceTime(searchDebounceTime),
      distinctUntilChanged()
    );

    const paginationStream$ = this.paginationSubject.asObservable();

    merge(searchStream$, paginationStream$)
      .pipe(
        switchMap(() => {
          const state = this.stateSubject.value;
          this.setLoading(true);
          const query: DataSourceQuery = {
            page: state.page,
            pageSize: state.pageSize,
            sortBy: state.sortBy,
            sortDirection: state.sortDirection,
            search: state.search,
          };
          return this.loadFn(query).pipe(
            catchError((error) => {
              console.error('Error loading data:', error);
              return of(this.emptyResponse());
            }),
            finalize(() => this.setLoading(false))
          );
        })
      )
      .subscribe((response) => {
        this.updateData(response);
      });

    this.stateSubject.subscribe((state) => {
      this.searchSubject.next(state.search);
    });
  }

  override loadData(): void {
    this.paginationSubject.next();
  }

  private emptyResponse(): PageResponse<T> {
    const state = this.getState();
    return {
      content: [],
      totalElements: 0,
      totalPages: 0,
      page: state.page,
      size: state.pageSize,
      first: true,
      last: true,
      hasNext: false,
      hasPrevious: false,
    };
  }
}

export class LocalTableDataSource<T> extends TableDataSource<T> {
  private allData: T[] = [];

  constructor(data: T[] = [], config: DataSourceConfig = {}) {
    super(config);
    this.setData(data);
  }

  setData(data: T[]): void {
    this.allData = data;
    this.loadData();
  }

  override loadData(): void {
    const state = this.stateSubject.value;
    let filtered = [...this.allData];

    if (state.search) {
      const searchLower = state.search.toLowerCase();
      filtered = filtered.filter((item) =>
        JSON.stringify(item).toLowerCase().includes(searchLower)
      );
    }

    if (state.sortBy) {
      filtered.sort((a: any, b: any) => {
        const aVal = a[state.sortBy!];
        const bVal = b[state.sortBy!];
        const comparison = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
        return state.sortDirection === 'ASC' ? comparison : -comparison;
      });
    }

    const totalElements = filtered.length;
    const totalPages = Math.max(1, Math.ceil(totalElements / state.pageSize));
    const start = state.page * state.pageSize;
    const end = start + state.pageSize;
    const content = filtered.slice(start, end);

    const response: PageResponse<T> = {
      content,
      totalElements,
      totalPages,
      page: state.page,
      size: state.pageSize,
      first: state.page === 0,
      last: state.page >= totalPages - 1,
      hasNext: state.page < totalPages - 1,
      hasPrevious: state.page > 0,
    };

    this.updateData(response);
  }
}
