export class InputSanitizer {
    /**
     * Sanitize string input
     */
    public static sanitize(input: string): string {
        return input
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#x27;')
            .replace(/\//g, '&#x2F;');
    }

    /**
     * Sanitize object
     */
    public static sanitizeObject(obj: Record<string, any>): Record<string, any> {
        const result: Record<string, any> = {};

        for (const [key, value] of Object.entries(obj)) {
            if (typeof value === 'string') {
                result[key] = this.sanitize(value);
            } else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
                result[key] = this.sanitizeObject(value);
            } else if (Array.isArray(value)) {
                result[key] = value.map(v =>
                    typeof v === 'string' ? this.sanitize(v) : v
                );
            } else {
                result[key] = value;
            }
        }

        return result;
    }

    /**
     * Remove dangerous characters
     */
    public static removeDangerousChars(input: string): string {
        return input.replace(/[<>\"'%()&+]/g, '');
    }

    /**
     * Validate email
     */
    public static isValidEmail(email: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    /**
     * Validate URL
     */
    public static isValidUrl(url: string): boolean {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    }
}
