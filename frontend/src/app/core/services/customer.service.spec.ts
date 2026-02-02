import {TestBed} from '@angular/core/testing';
import {HttpTestingController, provideHttpClientTesting} from '@angular/common/http/testing';
import {CustomerService} from './customer.service';
import {
  CreateCustomerRequest,
  CustomerApiResponse,
  CustomerFilter,
  PatchCustomerRequest,
  UpdateCustomerRequest
} from '@core/models/customer';
import {Gender} from '@core/models/customer/enums/gender.enum';
import {ApiResponse, PageResponse} from '@core/models/common';
import {provideHttpClient, withInterceptors} from '@angular/common/http';
import {serviceUrlInterceptor} from '../interceptors/service-url.interceptor';

describe('CustomerService', () => {
  let service: CustomerService;
  let httpMock: HttpTestingController;
  const baseUrl = 'api/customers';

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([serviceUrlInterceptor])),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(CustomerService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('create', () => {
    it('should create a customer', () => {
      const request: CreateCustomerRequest = {
        name: 'John',
        lastName: 'Doe',
        gender: Gender.MALE,
        birthDate: '1990-01-01',
        identification: '1234567890',
        address: '123 Main St',
        phone: '1234567890',
        customerId: 'john.doe',
        password: 'password123'
      };

      const mockResponse: ApiResponse<CustomerApiResponse> = {
        success: true,
        data: {
          id: '123',
          name: 'John',
          lastName: 'Doe',
          gender: Gender.MALE,
          birthDate: '1990-01-01',
          identification: '1234567890',
          address: '123 Main St',
          phone: '1234567890',
          customerId: 'john.doe',
          status: true,
          createdAt: '2024-01-01T00:00:00',
          updatedAt: '2024-01-01T00:00:00'
        },
        timestamp: '2024-01-01T00:00:00'
      };

      service.create(request).subscribe(response => {
        expect(response).toEqual(mockResponse);
        expect(response.data?.name).toBe('John');
      });

      const req = httpMock.expectOne(baseUrl);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(request);
      req.flush(mockResponse);
    });
  });

  describe('getAll', () => {
    it('should get all customers with filters', () => {
      const filter: CustomerFilter = {
        name: 'John',
        page: 0,
        size: 10
      };

      const mockResponse: PageResponse<CustomerApiResponse> = {
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
      expect(req.request.params.get('name')).toBe('John');
      expect(req.request.params.get('page')).toBe('0');
      req.flush(mockResponse);
    });

    it('should get all customers without filters', () => {
      const mockResponse: PageResponse<CustomerApiResponse> = {
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
    it('should get customer by id', () => {
      const customerId = '123';
      const mockResponse: ApiResponse<CustomerApiResponse> = {
        success: true,
        data: {
          id: customerId,
          name: 'John',
          lastName: 'Doe',
          gender: Gender.MALE,
          birthDate: '1990-01-01',
          identification: '1234567890',
          address: '123 Main St',
          customerId: 'john.doe',
          status: true,
          createdAt: '2024-01-01T00:00:00',
          updatedAt: '2024-01-01T00:00:00'
        },
        timestamp: '2024-01-01T00:00:00'
      };

      service.getById(customerId).subscribe(response => {
        expect(response).toEqual(mockResponse);
        expect(response.data?.id).toBe(customerId);
      });

      const req = httpMock.expectOne(`${baseUrl}/${customerId}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });
  });

  describe('update', () => {
    it('should update customer', () => {
      const customerId = '123';
      const request: UpdateCustomerRequest = {
        name: 'John',
        lastName: 'Doe',
        gender: Gender.MALE,
        birthDate: '1990-01-01',
        address: '456 New St',
        phone: '9876543210'
      };

      const mockResponse: ApiResponse<CustomerApiResponse> = {
        success: true,
        data: {
          id: customerId,
          name: 'John',
          lastName: 'Doe',
          gender: Gender.MALE,
          birthDate: '1990-01-01',
          identification: '1234567890',
          address: '456 New St',
          phone: '9876543210',
          customerId: 'john.doe',
          status: true,
          createdAt: '2024-01-01T00:00:00',
          updatedAt: '2024-01-01T00:00:00'
        },
        timestamp: '2024-01-01T00:00:00'
      };

      service.update(customerId, request).subscribe(response => {
        expect(response).toEqual(mockResponse);
        expect(response.data?.address).toBe('456 New St');
      });

      const req = httpMock.expectOne(`${baseUrl}/${customerId}`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(request);
      req.flush(mockResponse);
    });
  });

  describe('patch', () => {
    it('should patch customer', () => {
      const customerId = '123';
      const request: PatchCustomerRequest = {
        address: '789 Updated St'
      };

      const mockResponse: ApiResponse<CustomerApiResponse> = {
        success: true,
        data: {
          id: customerId,
          name: 'John',
          lastName: 'Doe',
          gender: Gender.MALE,
          birthDate: '1990-01-01',
          identification: '1234567890',
          address: '789 Updated St',
          customerId: 'john.doe',
          status: true,
          createdAt: '2024-01-01T00:00:00',
          updatedAt: '2024-01-01T00:00:00'
        },
        timestamp: '2024-01-01T00:00:00'
      };

      service.patch(customerId, request).subscribe(response => {
        expect(response).toEqual(mockResponse);
        expect(response.data?.address).toBe('789 Updated St');
      });

      const req = httpMock.expectOne(`${baseUrl}/${customerId}`);
      expect(req.request.method).toBe('PATCH');
      expect(req.request.body).toEqual(request);
      req.flush(mockResponse);
    });
  });

  describe('activate', () => {
    it('should activate customer', () => {
      const customerId = '123';
      const mockResponse: ApiResponse<CustomerApiResponse> = {
        success: true,
        message: 'Customer activated successfully',
        timestamp: '2024-01-01T00:00:00'
      };

      service.activate(customerId).subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(`${baseUrl}/${customerId}/activate`);
      expect(req.request.method).toBe('PATCH');
      expect(req.request.body).toEqual({});
      req.flush(mockResponse);
    });
  });

  describe('deactivate', () => {
    it('should deactivate customer', () => {
      const customerId = '123';
      const mockResponse: ApiResponse<CustomerApiResponse> = {
        success: true,
        message: 'Customer deactivated successfully',
        timestamp: '2024-01-01T00:00:00'
      };

      service.deactivate(customerId).subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(`${baseUrl}/${customerId}/deactivate`);
      expect(req.request.method).toBe('PATCH');
      expect(req.request.body).toEqual({});
      req.flush(mockResponse);
    });
  });
});
