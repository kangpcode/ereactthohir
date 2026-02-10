import crypto from 'crypto';

export class Crypt {
    private static algorithm = 'aes-256-cbc';
    private static key = Buffer.from(process.env.APP_KEY || '6f633362393262613134373434383161', 'hex');
    private static ivSize = 16;

    /**
     * Encrypt the given value.
     */
    static encrypt(value: string): string {
        const iv = crypto.randomBytes(this.ivSize);
        const cipher = crypto.createCipheriv(this.algorithm, this.key, iv);
        let encrypted = cipher.update(value, 'utf8', 'hex');
        encrypted += cipher.final('hex');
        return iv.toString('hex') + ':' + encrypted;
    }

    /**
     * Decrypt the given value.
     */
    static decrypt(value: string): string {
        const parts = value.split(':');
        const iv = Buffer.from(parts.shift() || '', 'hex');
        const encryptedText = parts.join(':');
        const decipher = crypto.createDecipheriv(this.algorithm, this.key, iv);
        let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        return decrypted;
    }
}
