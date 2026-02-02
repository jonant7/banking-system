import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable, tap} from 'rxjs';
import {CreateTransactionRequest, TransactionApiResponse} from '@core/models/transaction';
import {ApiResponse, PageResponse} from '@core/models/common';
import {NotificationService} from './notification.service';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  private readonly http = inject(HttpClient);
  private readonly notificationService = inject(NotificationService);
  private readonly baseUrl = 'api/accounts';

  executeTransaction(accountId: string, request: CreateTransactionRequest): Observable<ApiResponse<TransactionApiResponse>> {
    return this.http.post<ApiResponse<TransactionApiResponse>>(
      `${this.baseUrl}/${accountId}/transactions`,
      request
    ).pipe(
      tap(() => this.notificationService.success('Transacción realizada exitosamente'))
    );
  }

  getById(transactionId: string): Observable<ApiResponse<TransactionApiResponse>> {
    return this.http.get<ApiResponse<TransactionApiResponse>>(
      `${this.baseUrl}/transactions/${transactionId}`
    );
  }

  getByAccountId(
    accountId: string,
    page: number = 0,
    size: number = 10,
    sortBy: string = 'createdAt',
    sortDirection: 'ASC' | 'DESC' = 'DESC'
  ): Observable<PageResponse<TransactionApiResponse>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sortBy', sortBy)
      .set('sortDirection', sortDirection);

    return this.http.get<PageResponse<TransactionApiResponse>>(
      `${this.baseUrl}/${accountId}/transactions`,
      {params}
    );
  }

  getByDateRange(
    accountId: string,
    startDate: string,
    endDate: string
  ): Observable<ApiResponse<TransactionApiResponse[]>> {
    const params = new HttpParams()
      .set('startDate', startDate)
      .set('endDate', endDate);

    return this.http.get<ApiResponse<TransactionApiResponse[]>>(
      `${this.baseUrl}/${accountId}/transactions/report`,
      {params}
    );
  }

}
