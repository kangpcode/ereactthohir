/**
 * Cache Service - Advanced caching system with multiple drivers
 * Supports memory, file-based, and custom implementations
 */

export interface CacheDriver {
  get(key: string): Promise<any>;
  put(key: string, value: any, minutes?: number): Promise<void>;
  forget(key: string): Promise<void>;
  flush(): Promise<void>;
  has(key: string): Promise<boolean>;
  remember(key: string, minutes: number, callback: () => Promise<any>): Promise<any>;
}

export class MemoryCacheDriver implements CacheDriver {
  private store = new Map<string, { value: any; expiration?: number }>();

  async get(key: string): Promise<any> {
    const item = this.store.get(key);
    if (!item) return null;
    
    if (item.expiration && item.expiration < Date.now()) {
      this.store.delete(key);
      return null;
    }
    
    return item.value;
  }

  async put(key: string, value: any, minutes = 60): Promise<void> {
    const expiration = minutes ? Date.now() + minutes * 60 * 1000 : undefined;
    this.store.set(key, { value, expiration });
  }

  async forget(key: string): Promise<void> {
    this.store.delete(key);
  }

  async flush(): Promise<void> {
    this.store.clear();
  }

  async has(key: string): Promise<boolean> {
    const item = this.store.get(key);
    if (!item) return false;
    
    if (item.expiration && item.expiration < Date.now()) {
      this.store.delete(key);
      return false;
    }
    
    return true;
  }

  async remember(key: string, minutes: number, callback: () => Promise<any>): Promise<any> {
    const cached = await this.get(key);
    if (cached !== null) return cached;
    
    const value = await callback();
    await this.put(key, value, minutes);
    return value;
  }
}

export class Cache {
  private driver: CacheDriver;

  constructor(driver: CacheDriver = new MemoryCacheDriver()) {
    this.driver = driver;
  }

  setDriver(driver: CacheDriver): void {
    this.driver = driver;
  }

  async get(key: string, defaultValue?: any): Promise<any> {
    const value = await this.driver.get(key);
    return value !== null ? value : defaultValue;
  }

  async put(key: string, value: any, minutes?: number): Promise<void> {
    return this.driver.put(key, value, minutes);
  }

  async forget(key: string): Promise<void> {
    return this.driver.forget(key);
  }

  async flush(): Promise<void> {
    return this.driver.flush();
  }

  async has(key: string): Promise<boolean> {
    return this.driver.has(key);
  }

  async remember(key: string, minutes: number, callback: () => Promise<any>): Promise<any> {
    return this.driver.remember(key, minutes, callback);
  }

  async increment(key: string, value = 1): Promise<number> {
    const current = (await this.get(key, 0)) || 0;
    const newValue = current + value;
    await this.put(key, newValue);
    return newValue;
  }

  async decrement(key: string, value = 1): Promise<number> {
    const current = (await this.get(key, 0)) || 0;
    const newValue = current - value;
    await this.put(key, newValue);
    return newValue;
  }
}
