export class FormatUtils {

  static formatCurrency(value: number, currency: string = 'USD', locale: string = 'en-US'): string {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  }

  static formatNumber(value: number, decimals: number = 2, locale: string = 'en-US'): string {
    return new Intl.NumberFormat(locale, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    }).format(value);
  }

  static formatPercentage(value: number, decimals: number = 2): string {
    return `${this.formatNumber(value, decimals)}%`;
  }

  static parseNumber(value: string): number | null {
    const cleaned = value.replace(/[^\d.-]/g, '');
    const parsed = parseFloat(cleaned);
    return isNaN(parsed) ? null : parsed;
  }

  static formatPhoneNumber(phone: string): string {
    const cleaned = phone.replace(/\D/g, '');

    if (cleaned.length === 10) {
      return cleaned.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
    }

    if (cleaned.length === 9) {
      return cleaned.replace(/(\d{2})(\d{3})(\d{4})/, '$1 $2-$3');
    }

    return phone;
  }

  static capitalize(text: string): string {
    if (!text) return '';
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  }

  static capitalizeWords(text: string): string {
    if (!text) return '';
    return text.split(' ')
      .map(word => this.capitalize(word))
      .join(' ');
  }

  static truncate(text: string, maxLength: number, suffix: string = '...'): string {
    if (!text || text.length <= maxLength) {
      return text;
    }
    return text.substring(0, maxLength - suffix.length) + suffix;
  }

  static formatAccountNumber(accountNumber: string): string {
    const cleaned = accountNumber.replace(/\D/g, '');

    if (cleaned.length >= 6) {
      return cleaned.replace(/(\d{2})(\d{4})/, '$1-$2-');
    }

    return accountNumber;
  }

  static maskAccountNumber(accountNumber: string, visibleDigits: number = 4): string {
    if (accountNumber.length <= visibleDigits) {
      return accountNumber;
    }

    const masked = '*'.repeat(accountNumber.length - visibleDigits);
    const visible = accountNumber.slice(-visibleDigits);
    return masked + visible;
  }

  static formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  }

  static sanitizeFilename(filename: string): string {
    return filename
      .replace(/[^a-z0-9._-]/gi, '_')
      .replace(/_{2,}/g, '_')
      .toLowerCase();
  }

  static removeAccents(text: string): string {
    return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }

  static slugify(text: string): string {
    return this.removeAccents(text)
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
}
