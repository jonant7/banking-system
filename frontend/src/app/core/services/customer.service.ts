import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {
  CreateCustomerRequest,
  CustomerApiResponse,
  CustomerFilter,
  PatchCustomerRequest,
  UpdateCustomerRequest
} from '@core/models/customer';
import {ApiResponse, PageResponse} from '@core/models/common';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'api/customers';

  create(request: CreateCustomerRequest): Observable<ApiResponse<CustomerApiResponse>> {
    return this.http.post<ApiResponse<CustomerApiResponse>>(this.baseUrl, request);
  }

  getAll(filter?: CustomerFilter): Observable<PageResponse<CustomerApiResponse>> {
    let params = new HttpParams();

    if (filter) {
      Object.entries(filter).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params = params.set(key, String(value));
        }
      });
    }

    return this.http.get<PageResponse<CustomerApiResponse>>(this.baseUrl, {params});
  }

  getById(id: string): Observable<ApiResponse<CustomerApiResponse>> {
    return this.http.get<ApiResponse<CustomerApiResponse>>(`${this.baseUrl}/${id}`);
  }

  update(id: string, request: UpdateCustomerRequest): Observable<ApiResponse<CustomerApiResponse>> {
    return this.http.put<ApiResponse<CustomerApiResponse>>(`${this.baseUrl}/${id}`, request);
  }

  patch(id: string, request: PatchCustomerRequest): Observable<ApiResponse<CustomerApiResponse>> {
    return this.http.patch<ApiResponse<CustomerApiResponse>>(`${this.baseUrl}/${id}`, request);
  }

  activate(id: string): Observable<ApiResponse<CustomerApiResponse>> {
    return this.http.patch<ApiResponse<CustomerApiResponse>>(`${this.baseUrl}/${id}/activate`, {});
  }

  deactivate(id: string): Observable<ApiResponse<CustomerApiResponse>> {
    return this.http.patch<ApiResponse<CustomerApiResponse>>(`${this.baseUrl}/${id}/deactivate`, {});
  }

}
