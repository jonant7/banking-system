import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HealthCheckService {
  private readonly http = inject(HttpClient);

  checkCustomerService(): Observable<any> {
    return this.http.get('/actuator/customers/health');
  }

  checkAccountService(): Observable<any> {
    return this.http.get('/actuator/accounts/health');
  }

}
