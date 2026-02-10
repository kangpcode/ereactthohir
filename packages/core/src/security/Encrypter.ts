import * as crypto from 'crypto';

export class Encrypter {
    private key: string;
    private algorithm: string = 'aes-256-cbc';

    constructor(key: string) {
        if (key.length !== 32) {
            throw new Error('Encryption key must be 32 bytes');
        }
        this.key = key;
    }

    /**
     * Encrypt data
     */
    public encrypt(data: string): string {
        const iv = crypto.randomBytes(16);
        const cipher = crypto.createCipheriv(this.algorithm, Buffer.from(this.key), iv);

        let encrypted = cipher.update(data, 'utf8', 'hex');
        encrypted += cipher.final('hex');

        return iv.toString('hex') + ':' + encrypted;
    }

    /**
     * Decrypt data
     */
    public decrypt(encrypted: string): string {
        const parts = encrypted.split(':');
        const iv = Buffer.from(parts[0], 'hex');
        const decipher = crypto.createDecipheriv(this.algorithm, Buffer.from(this.key), iv);

        let decrypted = decipher.update(parts[1], 'hex', 'utf8');
        decrypted += decipher.final('utf8');

        return decrypted;
    }

    /**
     * Hash data
     */
    public static hash(data: string, algorithm: string = 'sha256'): string {
        return crypto.createHash(algorithm).update(data).digest('hex');
    }
}
