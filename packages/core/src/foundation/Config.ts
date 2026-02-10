export class Config {
    private config: Map<string, any> = new Map();

    public set(key: string, value: any): void {
        this.config.set(key, value);
    }

    public get(key: string, defaultValue: any = null): any {
        return this.config.get(key) ?? defaultValue;
    }

    public has(key: string): boolean {
        return this.config.has(key);
    }

    public all(): Record<string, any> {
        const result: Record<string, any> = {};
        this.config.forEach((value, key) => {
            result[key] = value;
        });
        return result;
    }

    public merge(config: Record<string, any>): void {
        Object.entries(config).forEach(([key, value]) => {
            this.set(key, value);
        });
    }
}
