import {TestBed} from '@angular/core/testing';
import {PdfDownloadService} from './pdf-download.service';

describe('PdfDownloadService', () => {
  let service: PdfDownloadService;
  let createElementSpy: jest.SpyInstance;
  let appendChildSpy: jest.SpyInstance;
  let removeChildSpy: jest.SpyInstance;
  let consoleErrorSpy: jest.SpyInstance;
  let mockLink: HTMLAnchorElement;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PdfDownloadService);

    mockLink = {
      href: '',
      download: '',
      click: jest.fn(),
      style: {},
    } as any;

    createElementSpy = jest.spyOn(document, 'createElement').mockReturnValue(mockLink);
    appendChildSpy = jest.spyOn(document.body, 'appendChild').mockImplementation(() => mockLink);
    removeChildSpy = jest.spyOn(document.body, 'removeChild').mockImplementation(() => mockLink);
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

    (global as any).URL.createObjectURL = jest.fn(() => 'blob:mock-url');
    (global as any).URL.revokeObjectURL = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('downloadFromBase64', () => {
    it('should download PDF from valid base64 data', () => {
      const base64Data = btoa('PDF content');
      const filename = 'test.pdf';

      service.downloadFromBase64(base64Data, filename);

      expect((global as any).URL.createObjectURL).toHaveBeenCalled();
      expect(createElementSpy).toHaveBeenCalledWith('a');
      expect(mockLink.download).toBe(filename);
      expect(mockLink.click).toHaveBeenCalled();
      expect(appendChildSpy).toHaveBeenCalledWith(mockLink);
      expect(removeChildSpy).toHaveBeenCalledWith(mockLink);
      expect((global as any).URL.revokeObjectURL).toHaveBeenCalledWith('blob:mock-url');
    });

    it('should add .pdf extension if not present', () => {
      const base64Data = btoa('PDF content');
      const filename = 'test';

      service.downloadFromBase64(base64Data, filename);

      expect(mockLink.download).toBe('test.pdf');
    });

    it('should not add .pdf extension if already present', () => {
      const base64Data = btoa('PDF content');
      const filename = 'test.pdf';

      service.downloadFromBase64(base64Data, filename);

      expect(mockLink.download).toBe('test.pdf');
    });

    it('should handle .PDF extension (uppercase)', () => {
      const base64Data = btoa('PDF content');
      const filename = 'test.PDF';

      service.downloadFromBase64(base64Data, filename);

      expect(mockLink.download).toBe('test.PDF');
    });

    it('should throw error for invalid base64 data', () => {
      const invalidBase64 = 'invalid-base64!!!';
      const filename = 'test.pdf';

      expect(() => {
        service.downloadFromBase64(invalidBase64, filename);
      }).toThrow('Failed to download PDF. Invalid base64 data.');

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Error downloading PDF from base64:',
        expect.any(Error)
      );
    });

    it('should create correct blob with PDF mime type', () => {
      const base64Data = btoa('PDF content');
      const filename = 'test.pdf';

      service.downloadFromBase64(base64Data, filename);

      const createObjectURLMock = (global as any).URL.createObjectURL as jest.Mock;
      const blobCall = createObjectURLMock.mock.calls[0][0];
      expect(blobCall).toBeInstanceOf(Blob);
      expect(blobCall.type).toBe('application/pdf');
    });
  });

  describe('openInNewTab', () => {
    let windowOpenSpy: jest.SpyInstance;

    beforeEach(() => {
      windowOpenSpy = jest.spyOn(window, 'open').mockImplementation(() => null);
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
      windowOpenSpy.mockRestore();
    });

    it('should open PDF in new tab', () => {
      const base64Data = btoa('PDF content');

      service.openInNewTab(base64Data);

      expect((global as any).URL.createObjectURL).toHaveBeenCalled();
      expect(windowOpenSpy).toHaveBeenCalledWith('blob:mock-url', '_blank');
    });

    it('should revoke object URL after opening', () => {
      const base64Data = btoa('PDF content');

      service.openInNewTab(base64Data);

      expect((global as any).URL.revokeObjectURL).not.toHaveBeenCalled();

      jest.advanceTimersByTime(100);

      expect((global as any).URL.revokeObjectURL).toHaveBeenCalledWith('blob:mock-url');
    });

    it('should throw error for invalid base64 data', () => {
      const invalidBase64 = 'invalid-base64!!!';

      expect(() => {
        service.openInNewTab(invalidBase64);
      }).toThrow('Failed to open PDF. Invalid base64 data.');

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Error opening PDF:',
        expect.any(Error)
      );
    });

    it('should create correct blob with PDF mime type', () => {
      const base64Data = btoa('PDF content');

      service.openInNewTab(base64Data);

      const createObjectURLMock = (global as any).URL.createObjectURL as jest.Mock;
      const blobCall = createObjectURLMock.mock.calls[0][0];
      expect(blobCall).toBeInstanceOf(Blob);
      expect(blobCall.type).toBe('application/pdf');
    });
  });
});
