import {TestBed} from '@angular/core/testing';
import {LoadingService} from './loading.service';

describe('LoadingService', () => {
  let service: LoadingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoadingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should start with loading false', () => {
    expect(service.isLoading()).toBe(false);
  });

  it('should set loading to true when show is called', () => {
    service.show();
    expect(service.isLoading()).toBe(true);
  });

  it('should set loading to false when hide is called after one show', () => {
    service.show();
    service.hide();
    expect(service.isLoading()).toBe(false);
  });

  it('should handle multiple show calls correctly', () => {
    service.show();
    service.show();
    service.show();
    expect(service.isLoading()).toBe(true);
  });

  it('should only set loading to false after all shows are hidden', () => {
    service.show();
    service.show();
    service.show();

    service.hide();
    expect(service.isLoading()).toBe(true);

    service.hide();
    expect(service.isLoading()).toBe(true);

    service.hide();
    expect(service.isLoading()).toBe(false);
  });

  it('should not go below zero when hide is called more than show', () => {
    service.show();
    service.hide();
    service.hide();
    service.hide();
    expect(service.isLoading()).toBe(false);
  });

  it('should reset loading state', () => {
    service.show();
    service.show();
    service.show();

    service.reset();

    expect(service.isLoading()).toBe(false);
  });

  it('should handle reset when not loading', () => {
    service.reset();
    expect(service.isLoading()).toBe(false);
  });
});
