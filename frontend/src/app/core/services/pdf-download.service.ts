import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PdfDownloadService {
  downloadFromBase64(base64Data: string, filename: string): void {
    try {
      const binaryString = atob(base64Data);
      const bytes = new Uint8Array(binaryString.length);

      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      const blob = new Blob([bytes], {type: 'application/pdf'});
      this.downloadBlob(blob, filename);
    } catch (error) {
      console.error('Error downloading PDF from base64:', error);
      throw new Error('Failed to download PDF. Invalid base64 data.');
    }
  }

  private downloadBlob(blob: Blob, filename: string): void {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = this.ensurePdfExtension(filename);

    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }

  private ensurePdfExtension(filename: string): string {
    return filename.toLowerCase().endsWith('.pdf') ? filename : `${filename}.pdf`;
  }

  openInNewTab(base64Data: string): void {
    try {
      const binaryString = atob(base64Data);
      const bytes = new Uint8Array(binaryString.length);

      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      const blob = new Blob([bytes], {type: 'application/pdf'});
      const url = window.URL.createObjectURL(blob);

      window.open(url, '_blank');

      setTimeout(() => window.URL.revokeObjectURL(url), 100);
    } catch (error) {
      console.error('Error opening PDF:', error);
      throw new Error('Failed to open PDF. Invalid base64 data.');
    }
  }

}
