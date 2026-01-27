import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {AccountApiResponse, AccountFilter, CreateAccountRequest} from '@core/models/account';
import {ApiResponse, PageResponse} from '@core/models/common';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'api/accounts';

  create(request: CreateAccountRequest): Observable<ApiResponse<AccountApiResponse>> {
    return this.http.post<ApiResponse<AccountApiResponse>>(this.baseUrl, request);
  }

  getAll(filter?: AccountFilter): Observable<PageResponse<AccountApiResponse>> {
    let params = new HttpParams();

    if (filter) {
      Object.entries(filter).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params = params.set(key, String(value));
        }
      });
    }

    return this.http.get<PageResponse<AccountApiResponse>>(this.baseUrl, {params});
  }

  getById(id: string): Observable<ApiResponse<AccountApiResponse>> {
    return this.http.get<ApiResponse<AccountApiResponse>>(`${this.baseUrl}/${id}`);
  }

  getByAccountNumber(accountNumber: string): Observable<ApiResponse<AccountApiResponse>> {
    return this.http.get<ApiResponse<AccountApiResponse>>(`${this.baseUrl}/number/${accountNumber}`);
  }

  activate(id: string): Observable<ApiResponse<AccountApiResponse>> {
    return this.http.patch<ApiResponse<AccountApiResponse>>(`${this.baseUrl}/${id}/activate`, {});
  }

  deactivate(id: string): Observable<ApiResponse<AccountApiResponse>> {
    return this.http.patch<ApiResponse<AccountApiResponse>>(`${this.baseUrl}/${id}/deactivate`, {});
  }

}
