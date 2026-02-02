import { HttpEvent, HttpHandlerFn, HttpHeaders, HttpRequest } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { Observable, of, throwError } from 'rxjs';
import { loadingInterceptor } from './loading.interceptor';
import { LoadingService } from '../services/loading.service';

describe('loadingInterceptor', () => {
  let loadingService: jest.Mocked<LoadingService>;
  let nextFn: HttpHandlerFn;

  beforeEach(() => {
    loadingService = {
      show: jest.fn(),
      hide: jest.fn()
    } as any;

    TestBed.configureTestingModule({
      providers: [
        { provide: LoadingService, useValue: loadingService }
      ]
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should show loading before request and hide after completion', (done) => {
    nextFn = (): Observable<HttpEvent<any>> => {
      return of({} as HttpEvent<any>);
    };

    const req = new HttpRequest('GET', '/api/test');

    TestBed.runInInjectionContext(() => {
      loadingInterceptor(req, nextFn).subscribe({
        complete: () => {
          setTimeout(() => {
            expect(loadingService.show).toHaveBeenCalledTimes(1);
            expect(loadingService.hide).toHaveBeenCalledTimes(1);
            done();
          }, 0);
        }
      });
    });
  });

  it('should hide loading even if request fails', (done) => {
    nextFn = (): Observable<HttpEvent<any>> => {
      return throwError(() => new Error('Request failed'));
    };

    const req = new HttpRequest('GET', '/api/test');

    TestBed.runInInjectionContext(() => {
      loadingInterceptor(req, nextFn).subscribe({
        error: () => {
          setTimeout(() => {
            expect(loadingService.show).toHaveBeenCalledTimes(1);
            expect(loadingService.hide).toHaveBeenCalledTimes(1);
            done();
          }, 0);
        }
      });
    });
  });

  it('should skip loading when X-Skip-Loading header is present', (done) => {
    nextFn = (req: HttpRequest<any>): Observable<HttpEvent<any>> => {
      expect(req.headers.has('X-Skip-Loading')).toBe(false);
      return of({} as HttpEvent<any>);
    };

    const headers = new HttpHeaders().set('X-Skip-Loading', 'true');
    const req = new HttpRequest('GET', '/api/test', { headers });

    TestBed.runInInjectionContext(() => {
      loadingInterceptor(req, nextFn).subscribe({
        complete: () => {
          setTimeout(() => {
            expect(loadingService.show).not.toHaveBeenCalled();
            expect(loadingService.hide).not.toHaveBeenCalled();
            done();
          }, 0);
        }
      });
    });
  });

  it('should remove X-Skip-Loading header from request', (done) => {
    let capturedRequest: HttpRequest<any> | null = null;

    nextFn = (req: HttpRequest<any>): Observable<HttpEvent<any>> => {
      capturedRequest = req;
      return of({} as HttpEvent<any>);
    };

    const headers = new HttpHeaders().set('X-Skip-Loading', 'true');
    const req = new HttpRequest('GET', '/api/test', { headers });

    TestBed.runInInjectionContext(() => {
      loadingInterceptor(req, nextFn).subscribe({
        complete: () => {
          setTimeout(() => {
            expect(capturedRequest).not.toBeNull();
            expect(capturedRequest!.headers.has('X-Skip-Loading')).toBe(false);
            done();
          }, 0);
        }
      });
    });
  });

  it('should show loading for POST requests', (done) => {
    nextFn = (): Observable<HttpEvent<any>> => {
      return of({} as HttpEvent<any>);
    };

    const req = new HttpRequest('POST', '/api/customers', { name: 'Test' });

    TestBed.runInInjectionContext(() => {
      loadingInterceptor(req, nextFn).subscribe({
        complete: () => {
          setTimeout(() => {
            expect(loadingService.show).toHaveBeenCalledTimes(1);
            expect(loadingService.hide).toHaveBeenCalledTimes(1);
            done();
          }, 0);
        }
      });
    });
  });

  it('should show loading for PUT requests', (done) => {
    nextFn = (): Observable<HttpEvent<any>> => {
      return of({} as HttpEvent<any>);
    };

    const req = new HttpRequest('PUT', '/api/customers/123', { name: 'Updated' });

    TestBed.runInInjectionContext(() => {
      loadingInterceptor(req, nextFn).subscribe({
        complete: () => {
          setTimeout(() => {
            expect(loadingService.show).toHaveBeenCalledTimes(1);
            expect(loadingService.hide).toHaveBeenCalledTimes(1);
            done();
          }, 0);
        }
      });
    });
  });

  it('should show loading for DELETE requests', (done) => {
    nextFn = (): Observable<HttpEvent<any>> => {
      return of({} as HttpEvent<any>);
    };

    const req = new HttpRequest('DELETE', '/api/customers/123');

    TestBed.runInInjectionContext(() => {
      loadingInterceptor(req, nextFn).subscribe({
        complete: () => {
          setTimeout(() => {
            expect(loadingService.show).toHaveBeenCalledTimes(1);
            expect(loadingService.hide).toHaveBeenCalledTimes(1);
            done();
          }, 0);
        }
      });
    });
  });

  it('should handle multiple concurrent requests', (done) => {
    nextFn = (): Observable<HttpEvent<any>> => {
      return of({} as HttpEvent<any>);
    };

    const req1 = new HttpRequest('GET', '/api/customers');
    const req2 = new HttpRequest('GET', '/api/accounts');

    TestBed.runInInjectionContext(() => {
      let completedCount = 0;

      loadingInterceptor(req1, nextFn).subscribe({
        complete: () => {
          completedCount++;
          if (completedCount === 2) {
            setTimeout(() => {
              expect(loadingService.show).toHaveBeenCalledTimes(2);
              expect(loadingService.hide).toHaveBeenCalledTimes(2);
              done();
            }, 0);
          }
        }
      });

      loadingInterceptor(req2, nextFn).subscribe({
        complete: () => {
          completedCount++;
          if (completedCount === 2) {
            setTimeout(() => {
              expect(loadingService.show).toHaveBeenCalledTimes(2);
              expect(loadingService.hide).toHaveBeenCalledTimes(2);
              done();
            }, 0);
          }
        }
      });
    });
  });
});
