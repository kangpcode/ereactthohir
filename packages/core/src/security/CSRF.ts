import * as crypto from 'crypto';

export class CSRF {
    private tokens: Map<string, { token: string, expires: number }> = new Map();
    private secret: string;

    constructor(secret?: string) {
        this.secret = secret || crypto.randomBytes(32).toString('hex');
    }

    /**
     * Generate a CSRF token
     */
    public generate(sessionId: string): string {
        const token = crypto.randomBytes(32).toString('hex');
        const expires = Date.now() + 3600000; // 1 hour

        this.tokens.set(sessionId, { token, expires });
        return token;
    }

    /**
     * Verify a CSRF token
     */
    public verify(sessionId: string, token: string): boolean {
        const stored = this.tokens.get(sessionId);

        if (!stored) {
            return false;
        }

        if (stored.expires < Date.now()) {
            this.tokens.delete(sessionId);
            return false;
        }

        return crypto.timingSafeEqual(Buffer.from(stored.token), Buffer.from(token));
    }

    /**
     * Clean expired tokens
     */
    public cleanup(): void {
        const now = Date.now();
        for (const [key, value] of this.tokens.entries()) {
            if (value.expires < now) {
                this.tokens.delete(key);
            }
        }
    }
}
