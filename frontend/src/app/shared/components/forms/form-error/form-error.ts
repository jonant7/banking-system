import {Component, Input} from '@angular/core';
import {ValidationErrors} from '@angular/forms';

@Component({
  selector: 'app-form-error',
  imports: [],
  templateUrl: './form-error.html',
  styleUrl: './form-error.css'
})
export class FormError {
  @Input() errors: ValidationErrors | null = null;

  getErrorMessage(): string {
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
}
