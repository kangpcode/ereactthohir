/**
 * Rate Limiter - Prevent abuse with configurable rate limiting
 */

export interface RateLimitConfig {
  maxAttempts: number;
  decayMinutes: number;
}

export class RateLimiter {
  private attempts = new Map<string, { count: number; resetAt: number }>();

  async hit(key: string, config: RateLimitConfig = { maxAttempts: 60, decayMinutes: 1 }): Promise<boolean> {
    const now = Date.now();
    const entry = this.attempts.get(key);

    if (!entry || entry.resetAt < now) {
      this.attempts.set(key, { count: 1, resetAt: now + config.decayMinutes * 60 * 1000 });
      return true;
    }

    if (entry.count < config.maxAttempts) {
      entry.count++;
      return true;
    }

    return false;
  }

  async attempt(
    key: string,
    config: RateLimitConfig,
    callback: () => Promise<any>,
    onLimitExceeded?: () => Promise<any>
  ): Promise<any> {
    const allowed = await this.hit(key, config);
    
    if (!allowed) {
      if (onLimitExceeded) return onLimitExceeded();
      throw new Error('Rate limit exceeded');
    }

    return callback();
  }

  clear(key: string): void {
    this.attempts.delete(key);
  }

  remaining(key: string, config: RateLimitConfig): number {
    const entry = this.attempts.get(key);
    if (!entry || entry.resetAt < Date.now()) return config.maxAttempts;
    return Math.max(0, config.maxAttempts - entry.count);
  }

  resetAfter(key: string): number {
    const entry = this.attempts.get(key);
    if (!entry) return 0;
    
    const remaining = entry.resetAt - Date.now();
    return remaining > 0 ? Math.ceil(remaining / 1000) : 0;
  }
}
