import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-form-field',
  imports: [],
  templateUrl: './form-field.html',
  styleUrl: './form-field.css'
})
export class FormField {
  @Input() label = '';
  @Input() required = false;
  @Input() error = '';
  @Input() hint = '';
}
