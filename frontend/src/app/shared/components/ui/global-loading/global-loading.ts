import {Component, inject} from '@angular/core';
import {LoadingService} from '@core/services/loading.service';
import {LoadingSpinnerComponent} from '@shared/components/ui/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-global-loading',
  imports: [LoadingSpinnerComponent],
  template: `
    @if (loadingService.isLoading()) {
      <app-loading-spinner
        [overlay]="true"
        [size]="'lg'"
        message="Cargando...">
      </app-loading-spinner>
    }
  `,
  styles: []
})
export class GlobalLoading {
  loadingService = inject(LoadingService);
}
