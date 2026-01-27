import {TestBed} from '@angular/core/testing';
import {HttpTestingController, provideHttpClientTesting} from '@angular/common/http/testing';
import {TransactionService} from './transaction.service';
import {CreateTransactionRequest, TransactionApiResponse} from '@core/models/transaction';
import {TransactionType} from '@core/models/transaction/enums/transaction-type.enum';
import {ApiResponse, PageResponse} from '@core/models/common';
import {provideHttpClient, withInterceptors} from '@angular/common/http';
import {serviceUrlInterceptor} from '../interceptors/service-url.interceptor';

describe('TransactionService', () => {
  let service: TransactionService;
  let httpMock: HttpTestingController;
  const baseUrl = 'api/accounts';

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([serviceUrlInterceptor])),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(TransactionService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('executeTransaction', () => {
    it('should execute a transaction', () => {
      const accountId = 'account-123';
      const request: CreateTransactionRequest = {
        type: TransactionType.DEPOSIT,
        amount: 500,
        reference: 'Test deposit'
      };

      const mockResponse: ApiResponse<TransactionApiResponse> = {
        success: true,
        data: {
          id: 'transaction-123',
          type: TransactionType.DEPOSIT,
          amount: 500,
          balanceBefore: 1000,
          balanceAfter: 1500,
          reference: 'Test deposit',
          accountId: accountId,
          createdAt: '2024-01-01T00:00:00'
        },
        timestamp: '2024-01-01T00:00:00'
      };

      service.executeTransaction(accountId, request).subscribe(response => {
        expect(response).toEqual(mockResponse);
        expect(response.data?.type).toBe(TransactionType.DEPOSIT);
        expect(response.data?.amount).toBe(500);
      });

      const req = httpMock.expectOne(`${baseUrl}/${accountId}/transactions`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(request);
      req.flush(mockResponse);
    });
  });

  describe('getById', () => {
    it('should get transaction by id', () => {
      const transactionId = 'transaction-123';
      const mockResponse: ApiResponse<TransactionApiResponse> = {
        success: true,
        data: {
          id: transactionId,
          type: TransactionType.DEPOSIT,
          amount: 500,
          balanceBefore: 1000,
          balanceAfter: 1500,
          reference: 'Test deposit',
          accountId: 'account-123',
          createdAt: '2024-01-01T00:00:00'
        },
        timestamp: '2024-01-01T00:00:00'
      };

      service.getById(transactionId).subscribe(response => {
        expect(response).toEqual(mockResponse);
        expect(response.data?.id).toBe(transactionId);
      });

      const req = httpMock.expectOne(`${baseUrl}/transactions/${transactionId}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });
  });

  describe('getByAccountId', () => {
    it('should get transactions by account id with default parameters', () => {
      const accountId = 'account-123';
      const mockResponse: PageResponse<TransactionApiResponse> = {
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

      service.getByAccountId(accountId).subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(req =>
        req.url === `${baseUrl}/${accountId}/transactions` &&
        req.params.get('page') === '0' &&
        req.params.get('size') === '10' &&
        req.params.get('sortBy') === 'createdAt' &&
        req.params.get('sortDirection') === 'DESC'
      );
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });

    it('should get transactions by account id with custom parameters', () => {
      const accountId = 'account-123';
      const mockResponse: PageResponse<TransactionApiResponse> = {
        content: [],
        page: 1,
        size: 20,
        totalElements: 0,
        totalPages: 0,
        first: false,
        last: true,
        hasNext: false,
        hasPrevious: true
      };

      service.getByAccountId(accountId, 1, 20, 'amount', 'ASC').subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(req =>
        req.url === `${baseUrl}/${accountId}/transactions` &&
        req.params.get('page') === '1' &&
        req.params.get('size') === '20' &&
        req.params.get('sortBy') === 'amount' &&
        req.params.get('sortDirection') === 'ASC'
      );
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });
  });

  describe('getByDateRange', () => {
    it('should get transactions by date range', () => {
      const accountId = 'account-123';
      const startDate = '2024-01-01T00:00:00';
      const endDate = '2024-01-31T23:59:59';

      const mockResponse: ApiResponse<TransactionApiResponse[]> = {
        success: true,
        data: [
          {
            id: 'transaction-1',
            type: TransactionType.DEPOSIT,
            amount: 500,
            balanceBefore: 1000,
            balanceAfter: 1500,
            accountId: accountId,
            createdAt: '2024-01-15T00:00:00'
          },
          {
            id: 'transaction-2',
            type: TransactionType.WITHDRAWAL,
            amount: 200,
            balanceBefore: 1500,
            balanceAfter: 1300,
            accountId: accountId,
            createdAt: '2024-01-20T00:00:00'
          }
        ],
        timestamp: '2024-01-01T00:00:00'
      };

      service.getByDateRange(accountId, startDate, endDate).subscribe(response => {
        expect(response).toEqual(mockResponse);
        expect(response.data?.length).toBe(2);
      });

      const req = httpMock.expectOne(req =>
        req.url === `${baseUrl}/${accountId}/transactions/report` &&
        req.params.get('startDate') === startDate &&
        req.params.get('endDate') === endDate
      );
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });
  });
});
