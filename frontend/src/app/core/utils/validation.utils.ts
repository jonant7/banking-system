export class ValidationUtils {

  static isValidPhone(phone: string): boolean {
    const cleaned = phone.replace(/\D/g, '');
    return cleaned.length >= 9 && cleaned.length <= 10;
  }

  static isValidAccountNumber(accountNumber: string): boolean {
    const cleaned = accountNumber.replace(/\D/g, '');
    return cleaned.length >= 6 && cleaned.length <= 20;
  }

  static isPositiveNumber(value: number): boolean {
    return !isNaN(value) && value > 0;
  }

  static isNonNegativeNumber(value: number): boolean {
    return !isNaN(value) && value >= 0;
  }

  static isInRange(value: number, min: number, max: number): boolean {
    return !isNaN(value) && value >= min && value <= max;
  }

  static hasMinLength(text: string, minLength: number): boolean {
    return !!text && text.length >= minLength;
  }

  static hasMaxLength(text: string, maxLength: number): boolean {
    return !text || text.length <= maxLength;
  }

  static matchesPattern(text: string, pattern: RegExp): boolean {
    return pattern.test(text);
  }

  static isAlphanumeric(text: string): boolean {
    return /^[a-zA-Z0-9]+$/.test(text);
  }

  static isAlphabetic(text: string): boolean {
    return /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(text);
  }

  static isNumeric(text: string): boolean {
    return /^\d+$/.test(text);
  }

  static isNotEmpty(value: any): boolean {
    if (value === null || value === undefined) {
      return false;
    }

    if (typeof value === 'string') {
      return value.trim().length > 0;
    }

    if (Array.isArray(value)) {
      return value.length > 0;
    }

    if (typeof value === 'object') {
      return Object.keys(value).length > 0;
    }

    return true;
  }

  static isValidPassword(password: string, minLength: number = 4): boolean {
    return !!password && password.length >= minLength;
  }

  static passwordsMatch(password: string, confirmPassword: string): boolean {
    return password === confirmPassword;
  }

  static sanitizeInput(input: string): string {
    return input
      .trim()
      .replace(/[<>]/g, '');
  }

}
