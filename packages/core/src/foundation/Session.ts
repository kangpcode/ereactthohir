/**
 * Session Service - Secure session management
 */

export interface SessionConfig {
  driver: 'memory' | 'file' | 'custom';
  lifetime: number;
  path?: string;
}

export class Session {
  private data = new Map<string, any>();
  private config: SessionConfig;
  private sessionId: string;

  constructor(config: SessionConfig = { driver: 'memory', lifetime: 120 }) {
    this.config = config;
    this.sessionId = this.generateSessionId();
  }

  private generateSessionId(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  }

  put(key: string, value: any): void {
    this.data.set(key, value);
  }

  get(key: string, defaultValue?: any): any {
    return this.data.get(key) ?? defaultValue;
  }

  has(key: string): boolean {
    return this.data.has(key);
  }

  forget(key: string): void {
    this.data.delete(key);
  }

  flush(): void {
    this.data.clear();
  }

  all(): Record<string, any> {
    const result: Record<string, any> = {};
    this.data.forEach((value, key) => {
      result[key] = value;
    });
    return result;
  }

  id(): string {
    return this.sessionId;
  }

  regenerate(): void {
    this.sessionId = this.generateSessionId();
    this.flush();
  }

  push(key: string, value: any): void {
    const existing = this.get(key, []);
    if (!Array.isArray(existing)) {
      throw new Error(`Session value for "${key}" is not an array`);
    }
    this.put(key, [...existing, value]);
  }

  pull(key: string, defaultValue?: any): any {
    const value = this.get(key, defaultValue);
    this.forget(key);
    return value;
  }
}
