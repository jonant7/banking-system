import {TestBed} from '@angular/core/testing';
import {HttpTestingController, provideHttpClientTesting} from '@angular/common/http/testing';
import {AccountService} from './account.service';
import {AccountApiResponse, AccountFilter, CreateAccountRequest} from '@core/models/account';
import {AccountType} from '@core/models/account/enums/account-type.enum';
import {AccountStatus} from '@core/models/account/enums/account-status.enum';
import {ApiResponse, PageResponse} from '@core/models/common';
import {provideHttpClient, withInterceptors} from '@angular/common/http';
import {serviceUrlInterceptor} from '../interceptors/service-url.interceptor';

describe('AccountService', () => {
  let service: AccountService;
  let httpMock: HttpTestingController;
  const baseUrl = 'api/accounts';

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([serviceUrlInterceptor])),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(AccountService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('create', () => {
    it('should create an account', () => {
      const request: CreateAccountRequest = {
        accountNumber: '123456',
        accountType: AccountType.SAVINGS,
        initialBalance: 1000,
        customerId: 'customer-123'
      };

      const mockResponse: ApiResponse<AccountApiResponse> = {
        success: true,
        data: {
          id: 'account-123',
          accountNumber: '123456',
          accountType: AccountType.SAVINGS,
          initialBalance: 1000,
          currentBalance: 1000,
          status: AccountStatus.ACTIVE,
          customerId: 'customer-123',
          createdAt: '2024-01-01T00:00:00',
          updatedAt: '2024-01-01T00:00:00'
        },
        timestamp: '2024-01-01T00:00:00'
      };

      service.create(request).subscribe(response => {
        expect(response).toEqual(mockResponse);
        expect(response.data?.accountNumber).toBe('123456');
      });

      const req = httpMock.expectOne(baseUrl);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(request);
      req.flush(mockResponse);
    });
  });

  describe('getAll', () => {
    it('should get all accounts with filters', () => {
      const filter: AccountFilter = {
        customerId: 'customer-123',
        page: 0,
        size: 10
      };

      const mockResponse: PageResponse<AccountApiResponse> = {
        content: [],
        page: 0,
        size: 10,
        totalElements: 0,
        totalPages: 0,
        first: true,
        last: true,
        hasNext: false,
        hasPrevious: false
      };

      service.getAll(filter).subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(req => req.url === baseUrl);
      expect(req.request.method).toBe('GET');
      expect(req.request.params.get('customerId')).toBe('customer-123');
      req.flush(mockResponse);
    });

    it('should get all accounts without filters', () => {
      const mockResponse: PageResponse<AccountApiResponse> = {
        content: [],
        page: 0,
        size: 10,
        totalElements: 0,
        totalPages: 0,
        first: true,
        last: true,
        hasNext: false,
        hasPrevious: false
      };

      service.getAll().subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(baseUrl);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });
  });

  describe('getById', () => {
    it('should get account by id', () => {
      const accountId = 'account-123';
      const mockResponse: ApiResponse<AccountApiResponse> = {
        success: true,
        data: {
          id: accountId,
          accountNumber: '123456',
          accountType: AccountType.SAVINGS,
          initialBalance: 1000,
          currentBalance: 1000,
          status: AccountStatus.ACTIVE,
          customerId: 'customer-123',
          createdAt: '2024-01-01T00:00:00',
          updatedAt: '2024-01-01T00:00:00'
        },
        timestamp: '2024-01-01T00:00:00'
      };

      service.getById(accountId).subscribe(response => {
        expect(response).toEqual(mockResponse);
        expect(response.data?.id).toBe(accountId);
      });

      const req = httpMock.expectOne(`${baseUrl}/${accountId}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });
  });

  describe('getByAccountNumber', () => {
    it('should get account by account number', () => {
      const accountNumber = '123456';
      const mockResponse: ApiResponse<AccountApiResponse> = {
        success: true,
        data: {
          id: 'account-123',
          accountNumber: accountNumber,
          accountType: AccountType.SAVINGS,
          initialBalance: 1000,
          currentBalance: 1000,
          status: AccountStatus.ACTIVE,
          customerId: 'customer-123',
          createdAt: '2024-01-01T00:00:00',
          updatedAt: '2024-01-01T00:00:00'
        },
        timestamp: '2024-01-01T00:00:00'
      };

      service.getByAccountNumber(accountNumber).subscribe(response => {
        expect(response).toEqual(mockResponse);
        expect(response.data?.accountNumber).toBe(accountNumber);
      });

      const req = httpMock.expectOne(`${baseUrl}/number/${accountNumber}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });
  });

  describe('activate', () => {
    it('should activate account', () => {
      const accountId = 'account-123';
      const mockResponse: ApiResponse<AccountApiResponse> = {
        success: true,
        message: 'Account activated successfully',
        timestamp: '2024-01-01T00:00:00'
      };

      service.activate(accountId).subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(`${baseUrl}/${accountId}/activate`);
      expect(req.request.method).toBe('PATCH');
      expect(req.request.body).toEqual({});
      req.flush(mockResponse);
    });
  });

  describe('deactivate', () => {
    it('should deactivate account', () => {
      const accountId = 'account-123';
      const mockResponse: ApiResponse<AccountApiResponse> = {
        success: true,
        message: 'Account deactivated successfully',
        timestamp: '2024-01-01T00:00:00'
      };

      service.deactivate(accountId).subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(`${baseUrl}/${accountId}/deactivate`);
      expect(req.request.method).toBe('PATCH');
      expect(req.request.body).toEqual({});
      req.flush(mockResponse);
    });
  });
});
