import {Component, Input} from '@angular/core';
import {ValidationErrors} from '@angular/forms';

@Component({
  selector: 'app-form-error',
  standalone: true,
  imports: [],
  templateUrl: './form-error.component.html',
  styleUrl: './form-error.component.css'
})
export class FormErrorComponent {
  @Input() errors: ValidationErrors | null = null;
  @Input() show = false;
  @Input() message = '';

  getErrorMessage(): string {
    if (this.message) {
      return this.message;
    }

    if (!this.errors) {
      return '';
    }

    if (this.errors['required']) {
      return 'Este campo es requerido';
    }

    if (this.errors['email']) {
      return 'Email inválido';
    }

    if (this.errors['minlength']) {
      const requiredLength = this.errors['minlength'].requiredLength;
      return `Mínimo ${requiredLength} caracteres`;
    }

    if (this.errors['maxlength']) {
      const requiredLength = this.errors['maxlength'].requiredLength;
      return `Máximo ${requiredLength} caracteres`;
    }

    if (this.errors['min']) {
      const min = this.errors['min'].min;
      return `El valor mínimo es ${min}`;
    }

    if (this.errors['max']) {
      const max = this.errors['max'].max;
      return `El valor máximo es ${max}`;
    }

    if (this.errors['pattern']) {
      return 'Formato inválido';
    }

    return 'Campo inválido';
  }

  get shouldShow(): boolean {
    return this.show || !!this.errors;
  }

}
