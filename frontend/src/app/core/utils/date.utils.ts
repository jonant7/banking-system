export class DateUtils {

  static formatDate(date: Date | string, format: string = 'yyyy-MM-dd'): string {
    const d = typeof date === 'string' ? new Date(date) : date;

    if (isNaN(d.getTime())) {
      return '';
    }

    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    const seconds = String(d.getSeconds()).padStart(2, '0');

    return format
      .replace('yyyy', String(year))
      .replace('MM', month)
      .replace('dd', day)
      .replace('HH', hours)
      .replace('mm', minutes)
      .replace('ss', seconds);
  }

  static formatDateTime(date: Date | string): string {
    return this.formatDate(date, 'yyyy-MM-dd HH:mm:ss');
  }

  static formatDateForDisplay(date: Date | string): string {
    return this.formatDate(date, 'dd/MM/yyyy');
  }

  static formatDateTimeForDisplay(date: Date | string): string {
    return this.formatDate(date, 'dd/MM/yyyy HH:mm');
  }

  static formatDateForInput(date: Date | string): string {
    return this.formatDate(date, 'yyyy-MM-dd');
  }

  static parseDate(dateString: string): Date | null {
    if (!dateString) {
      return null;
    }

    const date = new Date(dateString);
    return isNaN(date.getTime()) ? null : date;
  }

  static isValidDate(date: any): boolean {
    return date instanceof Date && !isNaN(date.getTime());
  }

  static isValidDateString(dateString: string): boolean {
    const date = this.parseDate(dateString);
    return date !== null;
  }

  static addDays(date: Date, days: number): Date {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }

  static subtractDays(date: Date, days: number): Date {
    return this.addDays(date, -days);
  }

  static isSameDay(date1: Date, date2: Date): boolean {
    return date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate();
  }

  static isToday(date: Date): boolean {
    return this.isSameDay(date, new Date());
  }

  static getDaysDifference(date1: Date, date2: Date): number {
    const diffTime = Math.abs(date2.getTime() - date1.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  static getStartOfDay(date: Date): Date {
    const result = new Date(date);
    result.setHours(0, 0, 0, 0);
    return result;
  }

  static getEndOfDay(date: Date): Date {
    const result = new Date(date);
    result.setHours(23, 59, 59, 999);
    return result;
  }

  static getStartOfMonth(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth(), 1);
  }

  static getEndOfMonth(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999);
  }

  static isDateInRange(date: Date, startDate: Date, endDate: Date): boolean {
    return date >= startDate && date <= endDate;
  }

}
