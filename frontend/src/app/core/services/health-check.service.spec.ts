import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { HealthCheckService } from './health-check.service';
import { serviceUrlInterceptor } from '../interceptors/service-url.interceptor';

describe('HealthCheckService', () => {
  let service: HealthCheckService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([serviceUrlInterceptor])),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(HealthCheckService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('checkCustomerService', () => {
    it('should call customer health endpoint', () => {
      const mockResponse = { status: 'UP', details: { db: 'connected' } };

      service.checkCustomerService().subscribe(response => {
        expect(response).toEqual(mockResponse);
        expect(response.status).toBe('UP');
      });

      const req = httpMock.expectOne('/actuator/customers/health');
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });

    it('should handle DOWN status', () => {
      const mockResponse = { status: 'DOWN', details: { db: 'disconnected' } };

      service.checkCustomerService().subscribe(response => {
        expect(response.status).toBe('DOWN');
      });

      const req = httpMock.expectOne('/actuator/customers/health');
      req.flush(mockResponse);
    });

    it('should handle error when customer service is unavailable', () => {
      const errorMessage = 'Service unavailable';

      service.checkCustomerService().subscribe({
        next: () => fail('should have failed with 503 error'),
        error: (error) => {
          expect(error.status).toBe(503);
          expect(error.statusText).toBe('Service Unavailable');
        }
      });

      const req = httpMock.expectOne('/actuator/customers/health');
      req.flush(errorMessage, { status: 503, statusText: 'Service Unavailable' });
    });

    it('should handle network error', () => {
      service.checkCustomerService().subscribe({
        next: () => fail('should have failed with network error'),
        error: (error) => {
          expect(error.error.type).toBe('error');
        }
      });

      const req = httpMock.expectOne('/actuator/customers/health');
      req.error(new ProgressEvent('error'));
    });
  });

  describe('checkAccountService', () => {
    it('should call account health endpoint', () => {
      const mockResponse = { status: 'UP', details: { db: 'connected' } };

      service.checkAccountService().subscribe(response => {
        expect(response).toEqual(mockResponse);
        expect(response.status).toBe('UP');
      });

      const req = httpMock.expectOne('/actuator/accounts/health');
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });

    it('should handle DOWN status', () => {
      const mockResponse = { status: 'DOWN', details: { db: 'disconnected' } };

      service.checkAccountService().subscribe(response => {
        expect(response.status).toBe('DOWN');
      });

      const req = httpMock.expectOne('/actuator/accounts/health');
      req.flush(mockResponse);
    });

    it('should handle error when account service is unavailable', () => {
      const errorMessage = 'Service unavailable';

      service.checkAccountService().subscribe({
        next: () => fail('should have failed with 503 error'),
        error: (error) => {
          expect(error.status).toBe(503);
          expect(error.statusText).toBe('Service Unavailable');
        }
      });

      const req = httpMock.expectOne('/actuator/accounts/health');
      req.flush(errorMessage, { status: 503, statusText: 'Service Unavailable' });
    });
  });

  describe('Multiple concurrent calls', () => {
    it('should handle multiple health checks simultaneously', () => {
      const customerResponse = { status: 'UP' };
      const accountResponse = { status: 'UP' };

      service.checkCustomerService().subscribe();
      service.checkAccountService().subscribe();

      const customerReq = httpMock.expectOne('/actuator/customers/health');
      const accountReq = httpMock.expectOne('/actuator/accounts/health');

      customerReq.flush(customerResponse);
      accountReq.flush(accountResponse);
    });
  });
});
