import {Component, computed, DestroyRef, inject, OnInit, signal} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {AccountService} from '@core/services/account.service';
import {TransactionService} from '@core/services/transaction.service';
import {AccountApiResponse, AccountType, AccountTypeHelper} from '@core/models/account';
import {CreateTransactionRequest, TransactionType, TransactionTypeHelper} from '@core/models/transaction';
import {CardComponent} from '@shared/components/ui/card/card/card.component';
import {FormFieldComponent} from '@shared/components/forms/form-field/form-field.component';
import {SelectComponent} from '@shared/components/ui/select/select.component';
import {InputComponent} from '@shared/components/ui/input/input.component';
import {ButtonComponent} from '@shared/components/ui/button/button.component';

@Component({
  selector: 'app-transaction-form',
  standalone: true,
  imports: [ReactiveFormsModule, CardComponent, FormFieldComponent, InputComponent, SelectComponent, ButtonComponent],
  templateUrl: './transaction-form.page.html',
  styleUrl: './transaction-form.page.css'
})
export class TransactionFormPage implements OnInit {
  private fb = inject(FormBuilder);
  private accountService = inject(AccountService);
  private transactionService = inject(TransactionService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private destroyRef = inject(DestroyRef);

  loading = signal(false);
  accounts = signal<AccountApiResponse[]>([]);
  selectedAccount = signal<AccountApiResponse | null>(null);
  isAccountLocked = signal(false);

  form!: FormGroup;

  transactionTypeOptions = TransactionTypeHelper.getOptions();

  accountOptions = computed(() =>
    this.accounts()
      .filter(acc => acc.status)
      .map(account => ({
        value: account.id,
        label: `${account.accountNumber} - ${account.customerName || 'Sin nombre'}`
      }))
  );

  selectedType = computed(() =>
    this.form?.get('type')?.value as TransactionType | null
  );

  isWithdrawal = computed(() =>
    this.selectedType() === TransactionType.WITHDRAWAL
  );

  currentBalance = computed(() =>
    this.selectedAccount()?.currentBalance ?? 0
  );

  insufficientBalance = computed(() => {
    if (!this.isWithdrawal()) return false;
    const amount = this.form?.get('amount')?.value;
    if (!amount) return false;
    return amount > this.currentBalance();
  });

  newBalance = computed(() => {
    const amount = this.form?.get('amount')?.value || 0;
    const type = this.selectedType();
    if (!type) return this.currentBalance();
    return type === TransactionType.DEPOSIT
      ? this.currentBalance() + amount
      : this.currentBalance() - amount;
  });

  ngOnInit(): void {
    this.initForm();
    this.loadAccounts();
    this.checkPreselectedAccount();
    this.setupFormListeners();
  }

  private initForm(): void {
    this.form = this.fb.group({
      accountId: ['', Validators.required],
      type: [null, Validators.required],
      amount: [null, [Validators.required, Validators.min(0.01)]],
      reference: ['', Validators.maxLength(200)]
    });
  }

  private loadAccounts(): void {
    this.loading.set(true);
    this.accountService.getAll({
      page: 0,
      size: 1000,
      sortBy: 'number',
      sortDirection: 'ASC'
    })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          this.accounts.set(response.content ?? []);
          this.loading.set(false);
        },
        error: () => {
          this.loading.set(false);
        }
      });
  }

  private checkPreselectedAccount(): void {
    const accountId = this.route.snapshot.queryParamMap.get('accountId');
    if (accountId) {
      // Si viene del listado, bloqueamos la cuenta
      this.isAccountLocked.set(true);

      // Esperamos a que las cuentas se carguen
      const checkAccountsLoaded = setInterval(() => {
        if (this.accounts().length > 0) {
          clearInterval(checkAccountsLoaded);
          this.form.patchValue({accountId});
          this.onAccountChange(accountId);
          // Deshabilitamos el campo para que no se pueda cambiar
          this.form.get('accountId')?.disable();
        }
      }, 100);
    }
  }

  private setupFormListeners(): void {
    this.form.get('accountId')?.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(accountId => {
        if (accountId) {
          this.onAccountChange(accountId);
        }
      });

    this.form.get('amount')?.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        if (this.insufficientBalance()) {
          this.form.get('amount')?.setErrors({insufficientBalance: true});
        }
      });
  }

  onAccountChange(accountId: string): void {
    const account = this.accounts().find(acc => acc.id === accountId);
    this.selectedAccount.set(account || null);
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    if (this.insufficientBalance()) return;

    // Obtenemos el accountId, ya sea del valor o del form deshabilitado
    const accountId = this.form.get('accountId')?.value || this.form.getRawValue().accountId;
    const request: CreateTransactionRequest = {
      type: this.form.value.type,
      amount: this.form.value.amount,
      reference: this.form.value.reference?.trim() || undefined
    };

    this.loading.set(true);

    this.transactionService.executeTransaction(accountId, request)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.loading.set(false);
          // Redirigir al listado con el accountId como query param
          // para que se mantenga la cuenta seleccionada
          this.router.navigate(['/transactions'], {
            queryParams: {accountId}
          });
        },
        error: () => {
          this.loading.set(false);
        }
      });
  }

  onCancel(): void {
    // Si venía de una cuenta específica, volver con ese parámetro
    const accountId = this.route.snapshot.queryParamMap.get('accountId');
    if (accountId) {
      this.router.navigate(['/transactions'], {
        queryParams: {accountId}
      });
    } else {
      this.router.navigate(['/transactions']);
    }
  }

  getFieldError(fieldName: string): string {
    const field = this.form.get(fieldName);
    if (!field?.errors || !field.touched) return '';

    const errors = field.errors;

    if (errors['required']) return 'Este campo es requerido';
    if (errors['min']) return `El valor mínimo es ${errors['min'].min}`;
    if (errors['maxlength']) return `Máximo ${errors['maxlength'].requiredLength} caracteres`;
    if (errors['insufficientBalance']) return `Saldo insuficiente. Disponible: ${this.formatCurrency(this.currentBalance())}`;

    return 'Campo inválido';
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('es-EC', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  }

  getTypeLabel(type: TransactionType): string {
    return TransactionTypeHelper.getLabel(type);
  }

  getAccountTypeLabel(type: AccountType): string {
    return AccountTypeHelper.getLabel(type);
  }

}
