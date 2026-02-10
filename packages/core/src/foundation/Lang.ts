export class Lang {
    private static locales: Record<string, Record<string, string>> = {};
    private static currentLocale: string = 'en';

    /**
     * Set the current locale.
     */
    static setLocale(locale: string) {
        this.currentLocale = locale;
    }

    /**
     * Add translations for a locale.
     */
    static add(locale: string, translations: Record<string, string>) {
        this.locales[locale] = { ...this.locales[locale], ...translations };
    }

    /**
     * Get the translation for a key.
     */
    static get(key: string, replacements: Record<string, string> = {}): string {
        let line = this.locales[this.currentLocale]?.[key] || key;

        Object.entries(replacements).forEach(([k, v]) => {
            line = line.replace(`:${k}`, v);
        });

        return line;
    }

    /**
     * Shortcut for get.
     */
    static __(key: string, replacements: Record<string, string> = {}): string {
        return this.get(key, replacements);
    }
}
