import {Component, forwardRef, Input as CoreInput} from '@angular/core';
import {NG_VALUE_ACCESSOR} from '@angular/forms';

@Component({
  selector: 'app-input',
  imports: [],
  templateUrl: './input.html',
  styleUrl: './input.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => Input),
      multi: true
    }
  ]
})
export class Input {

  @CoreInput() type: 'text' | 'email' | 'password' | 'number' | 'tel' = 'text';
  @CoreInput() placeholder = '';
  @CoreInput() disabled = false;
  @CoreInput() readonly = false;

  value = '';
  onChange: (value: string) => void = () => {
  };
  onTouched: () => void = () => {
  };

  writeValue(value: string): void {
    this.value = value || '';
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.value = input.value;
    this.onChange(this.value);
  }

  onBlur(): void {
    this.onTouched();
  }

}
