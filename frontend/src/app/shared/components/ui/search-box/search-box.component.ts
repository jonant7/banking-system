import {Component, EventEmitter, Input, OnDestroy, Output} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {Subject} from 'rxjs';
import {debounceTime, distinctUntilChanged} from 'rxjs/operators';

@Component({
  selector: 'app-search-box',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './search-box.component.html',
  styleUrl: './search-box.component.css'
})
export class SearchBoxComponent implements OnDestroy {
  @Input() placeholder = 'Buscar...';
  @Input() debounce = 400;
  @Input() value = '';

  @Output() searchChanged = new EventEmitter<string>();
  @Output() cleared = new EventEmitter<void>();

  private searchSubject = new Subject<string>();
  private subscription = this.searchSubject
    .pipe(
      debounceTime(this.debounce),
      distinctUntilChanged()
    )
    .subscribe(value => this.searchChanged.emit(value));

  onInput(value: string): void {
    this.searchSubject.next(value);
  }

  onClear(): void {
    this.value = '';
    this.searchSubject.next('');
    this.cleared.emit();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.searchSubject.complete();
  }
}
