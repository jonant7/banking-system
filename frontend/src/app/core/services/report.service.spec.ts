import {TestBed} from '@angular/core/testing';
import {HttpTestingController, provideHttpClientTesting} from '@angular/common/http/testing';
import {ReportService} from './report.service';
import {AccountStatementResponse} from '@core/models/report';
import {ApiResponse} from '@core/models/common';
import {provideHttpClient, withInterceptors} from '@angular/common/http';
import {serviceUrlInterceptor} from '../interceptors/service-url.interceptor';
import {PdfDownloadService} from './pdf-download.service';

describe('ReportService', () => {
  let service: ReportService;
  let httpMock: HttpTestingController;
  let pdfDownloadService: jest.Mocked<PdfDownloadService>;
  const baseUrl = 'api/reports';

  beforeEach(() => {
    pdfDownloadService = {
      downloadFromBase64: jest.fn(),
      openInNewTab: jest.fn()
    } as any;

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([serviceUrlInterceptor])),
        provideHttpClientTesting(),
        {provide: PdfDownloadService, useValue: pdfDownloadService}
      ]
    });

    service = TestBed.inject(ReportService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    jest.clearAllMocks();
  });

  describe('generateAccountStatement', () => {
    it('should generate account statement', () => {
      const customerId = 'customer-123';
      const startDate = '2024-01-01T00:00:00';
      const endDate = '2024-01-31T23:59:59';

      const mockResponse: ApiResponse<AccountStatementResponse> = {
        success: true,
        data: {
          customerId: customerId,
          customerName: 'John Doe',
          reportGeneratedAt: '2024-02-01T00:00:00',
          startDate: startDate,
          endDate: endDate,
          accounts: []
        },
        timestamp: '2024-02-01T00:00:00'
      };

      service.generateAccountStatement(customerId, startDate, endDate).subscribe(response => {
        expect(response).toEqual(mockResponse);
        expect(response.data?.customerId).toBe(customerId);
        expect(response.data?.customerName).toBe('John Doe');
      });

      const req = httpMock.expectOne(req =>
        req.url === baseUrl &&
        req.params.get('customerId') === customerId &&
        req.params.get('startDate') === startDate &&
        req.params.get('endDate') === endDate
      );
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });

    it('should handle empty account statement', () => {
      const customerId = 'customer-456';
      const startDate = '2024-01-01T00:00:00';
      const endDate = '2024-01-31T23:59:59';

      const mockResponse: ApiResponse<AccountStatementResponse> = {
        success: true,
        data: {
          customerId: customerId,
          customerName: 'Jane Smith',
          reportGeneratedAt: '2024-02-01T00:00:00',
          startDate: startDate,
          endDate: endDate,
          accounts: []
        },
        message: 'No accounts found for this customer',
        timestamp: '2024-02-01T00:00:00'
      };

      service.generateAccountStatement(customerId, startDate, endDate).subscribe(response => {
        expect(response).toEqual(mockResponse);
        expect(response.data?.accounts.length).toBe(0);
      });

      const req = httpMock.expectOne(req => req.url === baseUrl);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });
  });

  describe('generateAccountStatementWithPdf', () => {
    it('should generate account statement with PDF', () => {
      const customerId = 'customer-123';
      const startDate = '2024-01-01T00:00:00';
      const endDate = '2024-01-31T23:59:59';
      const mockPdfBase64 = 'JVBERi0xLjQKJdPr6eEKMSAwIG9iago8PC9UeXBl';

      const mockResponse: ApiResponse<AccountStatementResponse> = {
        success: true,
        data: {
          customerId: customerId,
          customerName: 'John Doe',
          reportGeneratedAt: '2024-02-01T00:00:00',
          startDate: startDate,
          endDate: endDate,
          accounts: [],
          pdfBase64: mockPdfBase64
        },
        timestamp: '2024-02-01T00:00:00'
      };

      service.generateAccountStatementWithPdf(customerId, startDate, endDate).subscribe(response => {
        expect(response).toEqual(mockResponse);
        expect(response.data?.pdfBase64).toBe(mockPdfBase64);
        expect(response.data?.pdfBase64).toBeTruthy();
      });

      const req = httpMock.expectOne(req =>
        req.url === `${baseUrl}/pdf` &&
        req.params.get('customerId') === customerId &&
        req.params.get('startDate') === startDate &&
        req.params.get('endDate') === endDate
      );
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });

    it('should generate account statement with PDF and accounts', () => {
      const customerId = 'customer-123';
      const startDate = '2024-01-01T00:00:00';
      const endDate = '2024-01-31T23:59:59';

      const mockResponse: ApiResponse<AccountStatementResponse> = {
        success: true,
        data: {
          customerId: customerId,
          customerName: 'John Doe',
          reportGeneratedAt: '2024-02-01T00:00:00',
          startDate: startDate,
          endDate: endDate,
          accounts: [
            {
              account: {
                id: 'account-1',
                accountNumber: '123456',
                accountType: 'SAVINGS' as any,
                initialBalance: 1000,
                currentBalance: 1500,
                status: 'ACTIVE' as any,
                customerId: customerId,
                createdAt: '2024-01-01T00:00:00',
                updatedAt: '2024-01-31T00:00:00'
              },
              transactions: []
            }
          ],
          pdfBase64: 'JVBERi0xLjQKJdPr6eEKMSAwIG9iago8PC9UeXBl'
        },
        timestamp: '2024-02-01T00:00:00'
      };

      service.generateAccountStatementWithPdf(customerId, startDate, endDate).subscribe(response => {
        expect(response).toEqual(mockResponse);
        expect(response.data?.accounts.length).toBe(1);
        expect(response.data?.pdfBase64).toBeTruthy();
      });

      const req = httpMock.expectOne(req => req.url === `${baseUrl}/pdf`);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });
  });

  describe('downloadPdf', () => {
    it('should call PdfDownloadService.downloadFromBase64', () => {
      const pdfBase64 = 'JVBERi0xLjQKJdPr6eEKMSAwIG9iago8PC9UeXBl';
      const filename = 'test-report.pdf';

      service.downloadPdf(pdfBase64, filename);

      expect(pdfDownloadService.downloadFromBase64).toHaveBeenCalledWith(pdfBase64, filename);
      expect(pdfDownloadService.downloadFromBase64).toHaveBeenCalledTimes(1);
    });
  });

  describe('openPdfInNewTab', () => {
    it('should call PdfDownloadService.openInNewTab', () => {
      const pdfBase64 = 'JVBERi0xLjQKJdPr6eEKMSAwIG9iago8PC9UeXBl';

      service.openPdfInNewTab(pdfBase64);

      expect(pdfDownloadService.openInNewTab).toHaveBeenCalledWith(pdfBase64);
      expect(pdfDownloadService.openInNewTab).toHaveBeenCalledTimes(1);
    });
  });
});
