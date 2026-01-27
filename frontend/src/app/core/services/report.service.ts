import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {AccountStatementResponse} from '@core/models/report';
import {ApiResponse} from '@core/models/common';
import {PdfDownloadService} from './pdf-download.service';

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  private readonly http = inject(HttpClient);
  private readonly pdfDownloadService = inject(PdfDownloadService);
  private readonly baseUrl = 'api/reports';

  generateAccountStatement(
    customerId: string,
    startDate: string,
    endDate: string
  ): Observable<ApiResponse<AccountStatementResponse>> {
    const params = new HttpParams()
      .set('customerId', customerId)
      .set('startDate', startDate)
      .set('endDate', endDate);

    return this.http.get<ApiResponse<AccountStatementResponse>>(this.baseUrl, {params});
  }

  generateAccountStatementWithPdf(
    customerId: string,
    startDate: string,
    endDate: string
  ): Observable<ApiResponse<AccountStatementResponse>> {
    const params = new HttpParams()
      .set('customerId', customerId)
      .set('startDate', startDate)
      .set('endDate', endDate);

    return this.http.get<ApiResponse<AccountStatementResponse>>(`${this.baseUrl}/pdf`, {params});
  }

  downloadPdf(pdfBase64: string, filename: string): void {
    this.pdfDownloadService.downloadFromBase64(pdfBase64, filename);
  }

  openPdfInNewTab(pdfBase64: string): void {
    this.pdfDownloadService.openInNewTab(pdfBase64);
  }
}
