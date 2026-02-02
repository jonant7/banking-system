import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-form-field',
  imports: [],
  templateUrl: './form-field.component.html',
  styleUrl: './form-field.component.css'
})
export class FormFieldComponent {
  @Input() label = '';
  @Input() required = false;
  @Input() error = '';
  @Input() hint = '';
}
