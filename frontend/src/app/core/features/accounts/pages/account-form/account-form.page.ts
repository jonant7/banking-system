import {Component, computed, DestroyRef, inject, OnInit, signal} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {AccountService} from '@core/services/account.service';
import {CustomerService} from '@core/services/customer.service';
import {AccountMapper, AccountTypeHelper} from '@core/models/account';

import {CustomerApiResponse} from '@core/models/customer';
import {CardComponent} from '@shared/components/ui/card/card/card.component';
import {FormFieldComponent} from '@shared/components/forms/form-field/form-field.component';
import {InputComponent} from '@shared/components/ui/input/input.component';
import {SelectComponent} from '@shared/components/ui/select/select.component';
import {ButtonComponent} from '@shared/components/ui/button/button.component';

@Component({
  selector: 'app-account-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CardComponent,
    FormFieldComponent,
    InputComponent,
    SelectComponent,
    ButtonComponent
  ],
  templateUrl: './account-form.page.html',
  styleUrl: './account-form.page.css'
})
export class AccountFormPage implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly accountService = inject(AccountService);
  private readonly customerService = inject(CustomerService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);

  protected form!: FormGroup;
  protected readonly loading = signal(false);
  protected readonly accountId = signal<string | null>(null);
  protected readonly isEditMode = computed(() => !!this.accountId());
  protected readonly accountTypeOptions = AccountTypeHelper.getOptions();
  protected readonly customerOptions = signal<Array<{ value: string; label: string }>>([]);
  protected readonly pageTitle = computed(() =>
    this.isEditMode() ? 'Ver Cuenta' : 'Nueva Cuenta'
  );

  ngOnInit(): void {
    this.initForm();
    this.loadCustomers();
    this.checkEditMode();
  }

  private initForm(): void {
    this.form = this.fb.group({
      accountNumber: [
        {value: '', disabled: false},
        [Validators.required, Validators.minLength(7), Validators.maxLength(15)]
      ],
      accountType: [
        {value: null, disabled: false},
        Validators.required
      ],
      initialBalance: [
        {value: null, disabled: false},
        [Validators.required, Validators.min(0)]
      ],
      customerId: [
        {value: '', disabled: false},
        Validators.required
      ]
    });
  }

  private loadCustomers(): void {
    this.customerService.getAll({page: 0, size: 1000, sortBy: 'name', sortDirection: 'ASC'})
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          const options = (response.content ?? []).map((customer: CustomerApiResponse) => ({
            value: customer.id,
            label: `${customer.fullName} - ${customer.customerId}`
          }));
          this.customerOptions.set(options);
        }
      });
  }

  private checkEditMode(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.accountId.set(id);
      this.loadAccount(id);
      this.configureEditMode();
    }
  }

  private configureEditMode(): void {
    this.form.get('accountNumber')?.disable();
    this.form.get('accountType')?.disable();
    this.form.get('initialBalance')?.disable();
    this.form.get('customerId')?.disable();
  }

  private loadAccount(id: string): void {
    this.loading.set(true);

    this.accountService.getById(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          if (!response.data) {
            this.router.navigate(['/accounts']);
            return;
          }

          const formData = AccountMapper.toFormData(response.data);
          this.form.patchValue(formData);
          this.loading.set(false);
        },
        error: () => {
          this.loading.set(false);
          this.router.navigate(['/accounts']);
        }
      });
  }

  protected onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    const formValue = this.form.getRawValue();

    const createRequest = AccountMapper.fromFormToCreateRequest(formValue);

    this.accountService.create(createRequest)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.loading.set(false);
          this.router.navigate(['/accounts']);
        },
        error: () => {
          this.loading.set(false);
        }
      });
  }

  protected onCancel(): void {
    this.router.navigate(['/accounts']);
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

    if (errors['maxlength']) {
      const maxLength = errors['maxlength'].requiredLength;
      return `Máximo ${maxLength} caracteres`;
    }

    if (errors['min']) {
      return `El valor mínimo es ${errors['min'].min}`;
    }

    return 'Campo inválido';
  }

}
