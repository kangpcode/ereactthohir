import * as crypto from 'crypto';

export interface PasswordHashOptions {
    rounds?: number;
    saltLength?: number;
}

export class PasswordHasher {
    private rounds: number;
    private saltLength: number;

    constructor(options: PasswordHashOptions = {}) {
        this.rounds = options.rounds || 10;
        this.saltLength = options.saltLength || 16;
    }

    /**
     * Hash a password
     */
    public hash(password: string): string {
        const salt = crypto.randomBytes(this.saltLength).toString('hex');
        const hash = crypto.pbkdf2Sync(password, salt, this.rounds, 64, 'sha512').toString('hex');
        return `${salt}$${hash}`;
    }

    /**
     * Verify a password
     */
    public verify(password: string, hashed: string): boolean {
        const [salt, hash] = hashed.split('$');
        const hashVerify = crypto.pbkdf2Sync(password, salt, this.rounds, 64, 'sha512').toString('hex');
        return crypto.timingSafeEqual(Buffer.from(hash), Buffer.from(hashVerify));
    }

    /**
     * Check if password needs rehashing
     */
    public needsRehash(hashed: string): boolean {
        const [, hash] = hashed.split('$');
        return hash.length !== 128; // sha512 produces 128 hex characters
    }
}
