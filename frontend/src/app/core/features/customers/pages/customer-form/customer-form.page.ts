import {Component, computed, DestroyRef, inject, OnInit, signal} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators
} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {CustomerService} from '@core/services/customer.service';
import {CustomerMapper, GenderHelper} from '@core/models/customer';
import {ValidationUtils} from '@core/utils/validation.utils';
import {ButtonComponent} from '@shared/components/ui/button/button.component';
import {InputComponent} from '@shared/components/ui/input/input.component';
import {SelectComponent} from '@shared/components/ui/select/select.component';
import {FormFieldComponent} from '@shared/components/forms/form-field/form-field.component';
import {DatePickerComponent} from '@shared/components/forms/date-picker/date-picker.component';
import {CardComponent} from '@shared/components/ui/card/card/card.component';

@Component({
  selector: 'app-customer-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    ButtonComponent,
    InputComponent,
    SelectComponent,
    CardComponent,
    FormFieldComponent,
    DatePickerComponent
  ],
  templateUrl: './customer-form.page.html',
  styleUrl: './customer-form.page.css'
})
export class CustomerFormPage implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly customerService = inject(CustomerService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);

  protected form!: FormGroup;
  protected readonly loading = signal(false);
  protected readonly customerId = signal<string | null>(null);
  protected readonly isEditMode = computed(() => !!this.customerId());
  protected readonly genderOptions = GenderHelper.getOptions();
  protected readonly pageTitle = computed(() =>
    this.isEditMode() ? 'Editar Cliente' : 'Nuevo Cliente'
  );

  ngOnInit(): void {
    this.initForm();
    this.checkEditMode();
  }

  private initForm(): void {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      gender: [{value: null, disabled: false}, Validators.required],
      birthDate: ['', Validators.required],
      identification: [{value: '', disabled: false}, [Validators.required, Validators.minLength(10)]],
      address: ['', Validators.required],
      phone: ['', [Validators.required, this.phoneValidator.bind(this)]],
      customerId: [{value: '', disabled: false}, [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(4)]],
    });
  }

  private checkEditMode(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.customerId.set(id);
      this.loadCustomer(id);
      this.configureEditMode();
    }
  }

  private configureEditMode(): void {
    this.form.get('customerId')?.disable();
    this.form.get('identification')?.disable();
    this.form.get('password')?.clearValidators();
    this.form.get('password')?.updateValueAndValidity();
    this.form.get('confirmPassword')?.clearValidators();
  }

  private loadCustomer(id: string): void {
    this.loading.set(true);

    this.customerService.getById(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          if (!response.data) {
            this.router.navigate(['/customers']);
            return;
          }

          const formData = CustomerMapper.toFormData(response.data);
          this.form.patchValue(formData);
          this.loading.set(false);
        },
        error: () => {
          this.loading.set(false);
          this.router.navigate(['/customers']);
        }
      });
  }

  private phoneValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return null;
    return ValidationUtils.isValidPhone(control.value) ? null : {invalidPhone: true};
  }

  protected onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    const formValue = this.form.getRawValue();

    const request$ = this.isEditMode()
      ? this.customerService.update(
        this.customerId()!,
        CustomerMapper.fromFormToUpdateRequest(formValue)
      )
      : this.customerService.create(
        CustomerMapper.fromFormToCreateRequest(formValue)
      );

    request$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.loading.set(false);
          this.router.navigate(['/customers']);
        },
        error: () => {
          this.loading.set(false);
        }
      });
  }

  protected onCancel(): void {
    this.router.navigate(['/customers']);
  }

  protected getFieldError(fieldName: string): string {
    const field = this.form.get(fieldName);

    if (!field?.errors || !field.touched) {
      return '';
    }

    const errors = field.errors;

    if (errors['required']) {
      return 'Este campo es requerido';
    }

    if (errors['minlength']) {
      const minLength = errors['minlength'].requiredLength;
      return `Mínimo ${minLength} caracteres`;
    }

    if (errors['invalidPhone']) {
      return 'Teléfono inválido';
    }

    if (errors['passwordMismatch']) {
      return 'Las contraseñas no coinciden';
    }

    return 'Campo inválido';
  }

  protected hasError(fieldName: string): boolean {
    const field = this.form.get(fieldName);
    return !!(field?.invalid && field.touched);
  }

  protected isFieldDisabled(fieldName: string): boolean {
    return this.form.get(fieldName)?.disabled ?? false;
  }

}
