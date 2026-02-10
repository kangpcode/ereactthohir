/**
 * Environment Configuration - Secure env variable management
 */

export class Env {
  private values: Map<string, any> = new Map();

  constructor(envObject?: Record<string, any>) {
    if (envObject) {
      Object.entries(envObject).forEach(([key, value]) => {
        this.values.set(key, value);
      });
    }
  }

  get(key: string, defaultValue?: any): any {
    return this.values.get(key) ?? defaultValue;
  }

  set(key: string, value: any): void {
    this.values.set(key, value);
  }

  has(key: string): boolean {
    return this.values.has(key);
  }

  string(key: string, defaultValue = ''): string {
    return String(this.get(key, defaultValue));
  }

  integer(key: string, defaultValue = 0): number {
    const value = this.get(key, defaultValue);
    return typeof value === 'number' ? value : parseInt(String(value), 10);
  }

  boolean(key: string, defaultValue = false): boolean {
    const value = this.get(key, defaultValue);
    if (typeof value === 'boolean') return value;
    const str = String(value).toLowerCase();
    return str === 'true' || str === '1' || str === 'yes';
  }

  array(key: string, defaultValue: any[] = []): any[] {
    const value = this.get(key, defaultValue);
    return Array.isArray(value) ? value : defaultValue;
  }

  all(): Record<string, any> {
    const result: Record<string, any> = {};
    this.values.forEach((value, key) => {
      result[key] = value;
    });
    return result;
  }

  fromObject(obj: Record<string, any>): void {
    Object.entries(obj).forEach(([key, value]) => {
      this.set(key, value);
    });
  }
}
