import {ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {Subject} from 'rxjs';
import {TableDataSource} from './table-data-source';

@Component({
  selector: 'app-table-search',
  imports: [CommonModule, FormsModule],
  templateUrl: './table-search.component.html',
  styleUrls: ['./table-search.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableSearchComponent<T = any> implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject<void>();

  @Input({required: true}) dataSource!: TableDataSource<T>;
  @Input() placeholder = 'Buscar...';
  @Input() ariaLabel = 'Buscar en la tabla';

  searchValue = '';

  ngOnInit(): void {
    const state = this.dataSource.getState();
    this.searchValue = state.search;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSearchChange(value: string): void {
    this.dataSource.setSearch(value);
  }

  clearSearch(): void {
    this.searchValue = '';
    this.dataSource.setSearch('');
  }
}
