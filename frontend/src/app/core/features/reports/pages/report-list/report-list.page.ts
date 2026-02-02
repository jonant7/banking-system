import {Component, computed, inject, OnInit, signal} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {CustomerService} from '@core/services/customer.service';
import {ReportService} from '@core/services/report.service';
import {CustomerApiResponse} from '@core/models/customer';
import {AccountStatementResponse} from '@core/models/report';
import {SelectComponent} from '@shared/components/ui/select/select.component';
import {ButtonComponent} from '@shared/components/ui/button/button.component';
import {CardComponent} from '@shared/components/ui/card/card/card.component';
import {BadgeComponent} from '@shared/components/ui/badge/badge.component';
import {AccountStatus, AccountType, AccountTypeHelper, TransactionType, TransactionTypeHelper} from '@core/models';

@Component({
  selector: 'app-report-list',
  standalone: true,
  imports: [
    FormsModule,
    SelectComponent,
    ButtonComponent,
    CardComponent,
    BadgeComponent
  ],
  templateUrl: './report-list.page.html',
  styleUrl: './report-list.page.css'
})
export class ReportListPage implements OnInit {
  private customerService = inject(CustomerService);
  private reportService = inject(ReportService);

  public readonly accountStatus = AccountStatus;

  customers = signal<CustomerApiResponse[]>([]);
  selectedCustomerId = signal<string>('');
  startDate = signal<string>('');
  endDate = signal<string>('');
  loading = signal(false);
  reportData = signal<AccountStatementResponse | null>(null);

  customerOptions = computed(() => {
    return this.customers().map(customer => ({
      value: customer.id,
      label: `${customer.name} - ${customer.identification}`
    }));
  });

  selectedCustomer = computed(() => {
    return this.customers().find(c => c.id === this.selectedCustomerId());
  });

  canGenerateReport = computed(() => {
    return !!(
      this.selectedCustomerId() &&
      this.startDate() &&
      this.endDate() &&
      !this.loading()
    );
  });

  ngOnInit(): void {
    this.loadCustomers();
    this.setDefaultDates();
  }

  private loadCustomers(): void {
    this.loading.set(true);
    this.customerService.getAll({
      page: 0,
      size: 1000,
      sortBy: 'name',
      sortDirection: 'ASC'
    }).subscribe({
      next: (response) => {
        this.customers.set(response.content ?? []);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading customers:', error);
        this.loading.set(false);
      }
    });
  }

  private setDefaultDates(): void {
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // Formato ISO local para datetime-local input
    this.startDate.set(this.formatDateTimeLocal(firstDayOfMonth));
    this.endDate.set(this.formatDateTimeLocal(now));
  }

  private formatDateTimeLocal(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }

  onCustomerChange(customerId: string | number): void {
    this.selectedCustomerId.set(customerId.toString());
    this.reportData.set(null);
  }

  generateReport(): void {
    if (!this.canGenerateReport()) return;

    if (!this.validateDates()) return;

    this.loading.set(true);
    this.reportData.set(null);

    this.reportService.generateAccountStatement(
      this.selectedCustomerId(),
      this.startDate(),
      this.endDate()
    ).subscribe({
      next: (response) => {
        if (response.data) {
          this.reportData.set(response.data);
        }
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error generating report:', error);
        alert('Error al generar el reporte. Por favor, intente nuevamente.');
        this.loading.set(false);
      }
    });
  }

  generateAndDownloadReport(): void {
    if (!this.canGenerateReport()) return;

    if (!this.validateDates()) return;

    this.loading.set(true);
    this.reportData.set(null);

    this.reportService.generateAccountStatementWithPdf(
      this.selectedCustomerId(),
      this.startDate(),
      this.endDate()
    ).subscribe({
      next: (response) => {
        if (response.data) {
          this.reportData.set(response.data);

          if (response.data.pdfBase64) {
            const customer = this.selectedCustomer();
            const filename = `Estado_Cuenta_${customer?.name.replace(/\s+/g, '_')}_${this.formatDateForFilename(this.startDate())}_${this.formatDateForFilename(this.endDate())}.pdf`;
            this.reportService.downloadPdf(response.data.pdfBase64, filename);
          }
        }
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error generating report with PDF:', error);
        alert('Error al generar el reporte con PDF. Por favor, intente nuevamente.');
        this.loading.set(false);
      }
    });
  }

  downloadPdf(): void {
    const report = this.reportData();
    if (!report?.pdfBase64) return;

    const customer = this.selectedCustomer();
    const filename = `Estado_Cuenta_${customer?.name.replace(/\s+/g, '_')}_${this.formatDateForFilename(this.startDate())}_${this.formatDateForFilename(this.endDate())}.pdf`;

    this.reportService.downloadPdf(report.pdfBase64, filename);
  }

  openPdfInNewTab(): void {
    const report = this.reportData();
    if (!report?.pdfBase64) return;

    this.reportService.openPdfInNewTab(report.pdfBase64);
  }

  private validateDates(): boolean {
    const start = new Date(this.startDate());
    const end = new Date(this.endDate());

    if (start > end) {
      alert('La fecha inicial no puede ser mayor a la fecha final');
      return false;
    }

    return true;
  }

  private formatDateForFilename(dateStr: string): string {
    const date = new Date(dateStr);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}${month}${day}`;
  }

  formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('es-EC', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  }

  formatDateTime(dateStr: string): string {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('es-EC', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('es-EC', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  }

  getTypeBadgeVariant(type: string): 'success' | 'danger' | 'warning' {
    switch (type?.toUpperCase()) {
      case 'DEPOSIT':
      case 'INCOME':
        return 'success';
      case 'WITHDRAWAL':
      case 'EXPENSE':
        return 'danger';
      default:
        return 'warning';
    }
  }

  getAmountBadgeVariant(amount: number): 'success' | 'danger' {
    return amount >= 0 ? 'success' : 'danger';
  }

  getTransactionTypeLabel(type: TransactionType): string {
    return TransactionTypeHelper.getLabel(type);
  }

  getAccountTypeLabel(type: AccountType): string {
    return AccountTypeHelper.getLabel(type);
  }

}
