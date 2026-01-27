import {TestBed} from '@angular/core/testing';
import {NotificationService} from './notification.service';

describe('NotificationService', () => {
  let service: NotificationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NotificationService);
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should start with empty notifications', () => {
    expect(service.notifications$().length).toBe(0);
  });

  it('should add success notification', () => {
    service.success('Success message');

    const notifications = service.notifications$();
    expect(notifications.length).toBe(1);
    expect(notifications[0].type).toBe('success');
    expect(notifications[0].message).toBe('Success message');
  });

  it('should add error notification', () => {
    service.error('Error message');

    const notifications = service.notifications$();
    expect(notifications.length).toBe(1);
    expect(notifications[0].type).toBe('error');
    expect(notifications[0].message).toBe('Error message');
  });

  it('should add warning notification', () => {
    service.warning('Warning message');

    const notifications = service.notifications$();
    expect(notifications.length).toBe(1);
    expect(notifications[0].type).toBe('warning');
    expect(notifications[0].message).toBe('Warning message');
  });

  it('should add info notification', () => {
    service.info('Info message');

    const notifications = service.notifications$();
    expect(notifications.length).toBe(1);
    expect(notifications[0].type).toBe('info');
    expect(notifications[0].message).toBe('Info message');
  });

  it('should add multiple notifications', () => {
    service.success('Message 1');
    service.error('Message 2');
    service.warning('Message 3');

    expect(service.notifications$().length).toBe(3);
  });

  it('should generate unique IDs for each notification', () => {
    service.success('Message 1');
    service.success('Message 2');

    const notifications = service.notifications$();
    expect(notifications[0].id).not.toBe(notifications[1].id);
  });

  it('should remove notification by ID', () => {
    service.success('Message 1');
    service.success('Message 2');

    const notifications = service.notifications$();
    const idToRemove = notifications[0].id;

    service.remove(idToRemove);

    const remaining = service.notifications$();
    expect(remaining.length).toBe(1);
    expect(remaining[0].id).toBe(notifications[1].id);
  });

  it('should auto-remove notification after duration', () => {
    service.success('Auto remove message', 1000);

    expect(service.notifications$().length).toBe(1);

    jest.advanceTimersByTime(1000);

    expect(service.notifications$().length).toBe(0);
  });

  it('should not auto-remove notification with duration 0', () => {
    service.success('Persistent message', 0);

    expect(service.notifications$().length).toBe(1);

    jest.advanceTimersByTime(10000);

    expect(service.notifications$().length).toBe(1);
  });

  it('should clear all notifications', () => {
    service.success('Message 1');
    service.error('Message 2');
    service.warning('Message 3');

    expect(service.notifications$().length).toBe(3);

    service.clear();

    expect(service.notifications$().length).toBe(0);
  });

  it('should handle removing non-existent notification', () => {
    service.success('Message 1');

    expect(service.notifications$().length).toBe(1);

    service.remove('non-existent-id');

    expect(service.notifications$().length).toBe(1);
  });

  it('should use default durations for each type', () => {
    service.success('Success');
    service.error('Error');
    service.warning('Warning');
    service.info('Info');

    const notifications = service.notifications$();
    expect(notifications[0].duration).toBe(3000);
    expect(notifications[1].duration).toBe(5000);
    expect(notifications[2].duration).toBe(4000);
    expect(notifications[3].duration).toBe(3000);
  });
});
