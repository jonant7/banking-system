import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {Subject, takeUntil} from 'rxjs';
import {TableDataSource} from './table-data-source';

@Component({
  selector: 'app-table-pagination',
  imports: [CommonModule, FormsModule],
  templateUrl: './table-pagination.component.html',
  styleUrls: ['./table-pagination.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TablePaginationComponent<T = any> implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject<void>();

  @Input({required: true}) dataSource!: TableDataSource<T>;
  @Input() showPageInfo = true;
  @Input() showPageSizeOptions = false;
  @Input() pageSizeOptions = [5, 10, 25, 50, 100];

  currentPage = 0;
  totalPages = 0;
  totalElements = 0;
  pageSize = 10;

  constructor(private cdr: ChangeDetectorRef) {
  }

  ngOnInit(): void {
    const state = this.dataSource.getState();
    this.currentPage = state.page;
    this.pageSize = state.pageSize;

    this.dataSource.pageSize$
      .pipe(takeUntil(this.destroy$))
      .subscribe((pageSize) => {
        this.pageSize = pageSize;
        this.cdr.markForCheck();
      });

    this.dataSource.currentPage$
      .pipe(takeUntil(this.destroy$))
      .subscribe((page) => {
        this.currentPage = page;
        this.cdr.markForCheck();
      });

    this.dataSource.totalPages$
      .pipe(takeUntil(this.destroy$))
      .subscribe((total) => {
        this.totalPages = total;
        this.cdr.markForCheck();
      });

    this.dataSource.totalElements$
      .pipe(takeUntil(this.destroy$))
      .subscribe((total) => {
        this.totalElements = total;
        this.cdr.markForCheck();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  get pages(): (number | null)[] {
    const pages: (number | null)[] = [];
    const maxVisible = 7;

    if (this.totalPages <= maxVisible) {
      for (let i = 0; i < this.totalPages; i++) pages.push(i);
    } else {
      if (this.currentPage <= 3) {
        for (let i = 0; i < 5; i++) pages.push(i);
        pages.push(null);
        pages.push(this.totalPages - 1);
      } else if (this.currentPage >= this.totalPages - 4) {
        pages.push(0);
        pages.push(null);
        for (let i = this.totalPages - 5; i < this.totalPages; i++) pages.push(i);
      } else {
        pages.push(0);
        pages.push(null);
        for (let i = this.currentPage - 1; i <= this.currentPage + 1; i++) pages.push(i);
        pages.push(null);
        pages.push(this.totalPages - 1);
      }
    }

    return pages;
  }

  get startItem(): number {
    if (this.totalElements === 0) return 0;
    return this.currentPage * this.pageSize + 1;
  }

  get endItem(): number {
    return Math.min((this.currentPage + 1) * this.pageSize, this.totalElements);
  }

  get canGoPrevious(): boolean {
    return this.currentPage > 0;
  }

  get canGoNext(): boolean {
    return this.currentPage < this.totalPages - 1;
  }

  goToPage(page: number): void {
    if (page >= 0 && page < this.totalPages && page !== this.currentPage) {
      this.dataSource.setPage(page);
    }
  }

  goToPrevious(): void {
    if (this.canGoPrevious) {
      this.dataSource.setPage(this.currentPage - 1);
    }
  }

  goToNext(): void {
    if (this.canGoNext) {
      this.dataSource.setPage(this.currentPage + 1);
    }
  }

  goToFirst(): void {
    this.goToPage(0);
  }

  goToLast(): void {
    this.goToPage(this.totalPages - 1);
  }

  changePageSize(newSize: number): void {
    if (!isNaN(newSize) && newSize > 0 && newSize !== this.pageSize) {
      this.dataSource.setPageSize(newSize);
    }
  }
}
