import {HttpErrorResponse, HttpHandlerFn, HttpRequest} from '@angular/common/http';
import {TestBed} from '@angular/core/testing';
import {throwError} from 'rxjs';
import {errorInterceptor} from './error.interceptor';
import {NotificationService} from '../services/notification.service';
import {extractErrorMessage} from '@core/models';

jest.mock('@core/models', () => ({
  extractErrorMessage: jest.fn()
}));

describe('errorInterceptor', () => {
  let notificationService: jest.Mocked<NotificationService>;
  let next: HttpHandlerFn;

  beforeEach(() => {
    notificationService = {
      error: jest.fn(),
      success: jest.fn(),
      warning: jest.fn(),
      info: jest.fn()
    } as any;

    TestBed.configureTestingModule({
      providers: [
        {provide: NotificationService, useValue: notificationService}
      ]
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  function executeInterceptor(error: HttpErrorResponse, done: () => void) {
    next = () => throwError(() => error);
    const req = new HttpRequest('GET', '/test');

    TestBed.runInInjectionContext(() => {
      errorInterceptor(req, next).subscribe({
        error: err => {
          done();
        }
      });
    });
  }

  it('should handle client-side ErrorEvent', done => {
    const error = new HttpErrorResponse({
      error: new ErrorEvent('error', {message: 'Client error'}),
      status: 0
    });

    executeInterceptor(error, done);

    expect(notificationService.error)
      .toHaveBeenCalledWith('Client Error: Client error');
  });

  it('should handle status 0 (network error)', done => {
    const error = new HttpErrorResponse({status: 0});

    executeInterceptor(error, done);

    expect(notificationService.error)
      .toHaveBeenCalledWith(
        'Unable to connect to the server. Please check your internet connection.'
      );
  });

  it('should handle 400 with extracted message', done => {
    (extractErrorMessage as jest.Mock).mockReturnValue('Bad request message');

    const error = new HttpErrorResponse({status: 400});

    executeInterceptor(error, done);

    expect(notificationService.error)
      .toHaveBeenCalledWith('Bad request message');
  });

  it('should handle 400 without extracted message', done => {
    (extractErrorMessage as jest.Mock).mockReturnValue(null);

    const error = new HttpErrorResponse({status: 400});

    executeInterceptor(error, done);

    expect(notificationService.error)
      .toHaveBeenCalledWith('Bad Request. Please check your input.');
  });

  it('should handle 401 error', done => {
    const error = new HttpErrorResponse({status: 401});

    executeInterceptor(error, done);

    expect(notificationService.error)
      .toHaveBeenCalledWith('Unauthorized. Please login again.');
  });

  it('should handle 403 error', done => {
    const error = new HttpErrorResponse({status: 403});

    executeInterceptor(error, done);

    expect(notificationService.error)
      .toHaveBeenCalledWith(
        'Access denied. You do not have permission to perform this action.'
      );
  });

  it('should handle 404 with extracted message', done => {
    (extractErrorMessage as jest.Mock).mockReturnValue('Not found message');

    const error = new HttpErrorResponse({status: 404});

    executeInterceptor(error, done);

    expect(notificationService.error)
      .toHaveBeenCalledWith('Not found message');
  });

  it('should handle 409 without extracted message', done => {
    (extractErrorMessage as jest.Mock).mockReturnValue(undefined);

    const error = new HttpErrorResponse({status: 409});

    executeInterceptor(error, done);

    expect(notificationService.error)
      .toHaveBeenCalledWith('Conflict. The resource already exists.');
  });

  it('should handle 422 without extracted message', done => {
    (extractErrorMessage as jest.Mock).mockReturnValue(undefined);

    const error = new HttpErrorResponse({status: 422});

    executeInterceptor(error, done);

    expect(notificationService.error)
      .toHaveBeenCalledWith('Validation error. Please check your input.');
  });

  it('should handle 500 server error', done => {
    const error = new HttpErrorResponse({status: 500});

    executeInterceptor(error, done);

    expect(notificationService.error)
      .toHaveBeenCalledWith('Server error. Please try again later.');
  });

  it('should handle unknown status with fallback message', done => {
    (extractErrorMessage as jest.Mock).mockReturnValue(null);

    const error = new HttpErrorResponse({
      status: 418,
      statusText: 'I am a teapot'
    });

    executeInterceptor(error, done);

    expect(notificationService.error)
      .toHaveBeenCalledWith('Error: I am a teapot');
  });

  it('should rethrow transformed error object', done => {
    const error = new HttpErrorResponse({status: 401});

    next = () => throwError(() => error);
    const req = new HttpRequest('GET', '/test');

    TestBed.runInInjectionContext(() => {
      errorInterceptor(req, next).subscribe({
        error: err => {
          expect(err.status).toBe(401);
          expect(err.message).toBe('Unauthorized. Please login again.');
          expect(err.originalError).toBe(error);
          done();
        }
      });
    });
  });
});
