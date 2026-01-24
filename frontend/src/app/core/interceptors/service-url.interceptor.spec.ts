import { HttpRequest, HttpHandlerFn, HttpEvent, HttpHeaders } from '@angular/common/http';
import { serviceUrlInterceptor } from './service-url.interceptor';
import { Observable, of } from 'rxjs';

jest.mock('../../../environments/environment', () => ({
  environment: {
    production: false,
    api: {
      services: {
        customer: {
          baseUrl: 'http://localhost:8081',
          version: 'v1'
        },
        account: {
          baseUrl: 'http://localhost:8082',
          version: 'v1'
        }
      },
      routes: {
        '/api/customers': 'customer',
        '/api/accounts': 'account',
        '/api/transactions': 'account',
        '/api/reports': 'account'
      }
    }
  }
}));

describe('serviceUrlInterceptor', () => {
  let nextFn: HttpHandlerFn;
  let capturedRequest: HttpRequest<any> | null;

  beforeEach(() => {
    capturedRequest = null;
    nextFn = (req: HttpRequest<any>): Observable<HttpEvent<any>> => {
      capturedRequest = req;
      return of({} as HttpEvent<any>);
    };
  });

  describe('Customer Service Routes', () => {
    it('should transform customer service URL correctly', () => {
      const originalReq = new HttpRequest('GET', '/api/customers/123');

      serviceUrlInterceptor(originalReq, nextFn);

      expect(capturedRequest).not.toBeNull();
      expect(capturedRequest!.url).toBe('http://localhost:8081/api/v1/customers/123');
      expect(capturedRequest!.method).toBe('GET');
    });

    it('should handle customer service with query params', () => {
      const originalReq = new HttpRequest('GET', '/api/customers?status=active');

      serviceUrlInterceptor(originalReq, nextFn);

      expect(capturedRequest!.url).toBe('http://localhost:8081/api/v1/customers?status=active');
    });

    it('should handle nested customer paths', () => {
      const originalReq = new HttpRequest('GET', '/api/customers/123/accounts');

      serviceUrlInterceptor(originalReq, nextFn);

      expect(capturedRequest!.url).toBe('http://localhost:8081/api/v1/customers/123/accounts');
    });
  });

  describe('Account Service Routes', () => {
    it('should transform account service URL correctly', () => {
      const originalReq = new HttpRequest('GET', '/api/accounts/456');

      serviceUrlInterceptor(originalReq, nextFn);

      expect(capturedRequest!.url).toBe('http://localhost:8082/api/v1/accounts/456');
    });

    it('should transform transactions URL to account service', () => {
      const originalReq = new HttpRequest('GET', '/api/transactions/789');

      serviceUrlInterceptor(originalReq, nextFn);

      expect(capturedRequest!.url).toBe('http://localhost:8082/api/v1/transactions/789');
    });

    it('should transform reports URL to account service', () => {
      const originalReq = new HttpRequest('GET', '/api/reports/monthly');

      serviceUrlInterceptor(originalReq, nextFn);

      expect(capturedRequest!.url).toBe('http://localhost:8082/api/v1/reports/monthly');
    });
  });

  describe('Non-API URLs', () => {
    it('should not transform external URLs starting with http', () => {
      const externalUrl = 'http://api.github.com/users';
      const originalReq = new HttpRequest('GET', externalUrl);

      serviceUrlInterceptor(originalReq, nextFn);

      expect(capturedRequest!.url).toBe(externalUrl);
    });

    it('should not transform external URLs starting with https', () => {
      const externalUrl = 'https://jsonplaceholder.typicode.com/posts/1';
      const originalReq = new HttpRequest('GET', externalUrl);

      serviceUrlInterceptor(originalReq, nextFn);

      expect(capturedRequest!.url).toBe(externalUrl);
    });

    it('should not transform URLs that do not start with /api', () => {
      const relativeUrl = '/assets/config.json';
      const originalReq = new HttpRequest('GET', relativeUrl);

      serviceUrlInterceptor(originalReq, nextFn);

      expect(capturedRequest!.url).toBe(relativeUrl);
    });

    it('should not transform actuator URLs', () => {
      const actuatorUrl = '/actuator/customers/health';
      const originalReq = new HttpRequest('GET', actuatorUrl);

      serviceUrlInterceptor(originalReq, nextFn);

      expect(capturedRequest!.url).toBe(actuatorUrl);
    });
  });

  describe('HTTP Methods', () => {
    it('should handle POST requests correctly', () => {
      const body = { name: 'New Customer' };
      const originalReq = new HttpRequest('POST', '/api/customers', body);

      serviceUrlInterceptor(originalReq, nextFn);

      expect(capturedRequest!.url).toBe('http://localhost:8081/api/v1/customers');
      expect(capturedRequest!.method).toBe('POST');
      expect(capturedRequest!.body).toEqual(body);
    });

    it('should handle PUT requests correctly', () => {
      const body = { balance: 5000 };
      const originalReq = new HttpRequest('PUT', '/api/accounts/123', body);

      serviceUrlInterceptor(originalReq, nextFn);

      expect(capturedRequest!.url).toBe('http://localhost:8082/api/v1/accounts/123');
      expect(capturedRequest!.method).toBe('PUT');
      expect(capturedRequest!.body).toEqual(body);
    });

    it('should handle DELETE requests correctly', () => {
      const originalReq = new HttpRequest('DELETE', '/api/customers/123');

      serviceUrlInterceptor(originalReq, nextFn);

      expect(capturedRequest!.url).toBe('http://localhost:8081/api/v1/customers/123');
      expect(capturedRequest!.method).toBe('DELETE');
    });

    it('should handle PATCH requests correctly', () => {
      const body = { status: 'active' };
      const originalReq = new HttpRequest('PATCH', '/api/accounts/456', body);

      serviceUrlInterceptor(originalReq, nextFn);

      expect(capturedRequest!.url).toBe('http://localhost:8082/api/v1/accounts/456');
      expect(capturedRequest!.method).toBe('PATCH');
    });
  });

  describe('Edge Cases', () => {
    it('should handle unmatched /api routes', () => {
      const unmatchedUrl = '/api/unknown/endpoint';
      const originalReq = new HttpRequest('GET', unmatchedUrl);

      serviceUrlInterceptor(originalReq, nextFn);

      expect(capturedRequest!.url).toBe(unmatchedUrl);
    });

    it('should handle URL with multiple path segments', () => {
      const originalReq = new HttpRequest('GET', '/api/accounts/123/transactions/456');

      serviceUrlInterceptor(originalReq, nextFn);

      expect(capturedRequest!.url).toBe('http://localhost:8082/api/v1/accounts/123/transactions/456');
    });

    it('should preserve request properties when transforming URL', () => {
      const originalReq = new HttpRequest('GET', '/api/customers', null, {
        headers: new HttpHeaders({ 'Authorization': 'Bearer token123' })
      });

      serviceUrlInterceptor(originalReq, nextFn);

      expect(capturedRequest!.url).toBe('http://localhost:8081/api/v1/customers');
      expect(capturedRequest!.method).toBe('GET');
    });
  });

  describe('Route Matching Priority', () => {
    it('should match /api/customers before other routes', () => {
      const originalReq = new HttpRequest('GET', '/api/customers/search');

      serviceUrlInterceptor(originalReq, nextFn);

      expect(capturedRequest!.url).toBe('http://localhost:8081/api/v1/customers/search');
    });

    it('should match /api/accounts before /api/transactions', () => {
      const originalReq = new HttpRequest('GET', '/api/accounts/999');

      serviceUrlInterceptor(originalReq, nextFn);

      expect(capturedRequest!.url).toBe('http://localhost:8082/api/v1/accounts/999');
    });
  });
});
