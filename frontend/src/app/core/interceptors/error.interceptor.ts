import {HttpErrorResponse, HttpInterceptorFn} from '@angular/common/http';
import {inject} from '@angular/core';
import {catchError, throwError} from 'rxjs';
import {NotificationService} from '../services/notification.service';
import {extractErrorMessage} from '@core/models';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const notificationService = inject(NotificationService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'An unexpected error occurred';

      if (error.error instanceof ErrorEvent) {
        errorMessage = `Client Error: ${error.error.message}`;
      } else {
        if (error.status === 0) {
          errorMessage = 'Unable to connect to the server. Please check your internet connection.';
        } else if (error.status === 400) {
          errorMessage = extractErrorMessage(error) || 'Bad Request. Please check your input.';
        } else if (error.status === 401) {
          errorMessage = 'Unauthorized. Please login again.';
        } else if (error.status === 403) {
          errorMessage = 'Access denied. You do not have permission to perform this action.';
        } else if (error.status === 404) {
          errorMessage = extractErrorMessage(error) || 'Resource not found.';
        } else if (error.status === 409) {
          errorMessage = extractErrorMessage(error) || 'Conflict. The resource already exists.';
        } else if (error.status === 422) {
          errorMessage = extractErrorMessage(error) || 'Validation error. Please check your input.';
        } else if (error.status >= 500) {
          errorMessage = 'Server error. Please try again later.';
        } else {
          errorMessage = extractErrorMessage(error) || `Error: ${error.statusText}`;
        }
      }

      notificationService.error(errorMessage);

      return throwError(() => ({
        status: error.status,
        message: errorMessage,
        originalError: error
      }));
    })
  );
};
