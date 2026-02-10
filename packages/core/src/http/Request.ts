export interface Headers {
    [key: string]: string | string[];
}

export class Request {
    private method: string = 'GET';
    private path: string = '/';
    private headers: Headers = {};
    private query: Record<string, any> = {};
    private body: any = {};
    private params: Record<string, any> = {};
    private user: any = null;

    constructor(data?: any) {
        if (data) {
            this.method = data.method || 'GET';
            this.path = data.path || '/';
            this.headers = data.headers || {};
            this.query = data.query || {};
            this.body = data.body || {};
            this.params = data.params || {};
        }
    }

    public getMethod(): string {
        return this.method;
    }

    public setMethod(method: string): this {
        this.method = method.toUpperCase();
        return this;
    }

    public getPath(): string {
        return this.path;
    }

    public setPath(path: string): this {
        this.path = path;
        return this;
    }

    public header(key: string, defaultValue?: string): string | string[] | undefined {
        return this.headers[key.toLowerCase()] ?? defaultValue;
    }

    public setHeader(key: string, value: string | string[]): this {
        this.headers[key.toLowerCase()] = value;
        return this;
    }

    public getHeaders(): Headers {
        return this.headers;
    }

    public input(key: string, defaultValue?: any): any {
        return this.body[key] ?? this.query[key] ?? defaultValue;
    }

    public getQuery(key?: string, defaultValue?: any): any {
        if (!key) return this.query;
        return this.query[key] ?? defaultValue;
    }

    public setQuery(query: Record<string, any>): this {
        this.query = query;
        return this;
    }

    public only(...keys: string[]): Record<string, any> {
        const result: Record<string, any> = {};
        keys.forEach(key => {
            if (key in this.body) {
                result[key] = this.body[key];
            }
        });
        return result;
    }

    public except(...keys: string[]): Record<string, any> {
        const result = { ...this.body };
        keys.forEach(key => {
            delete result[key];
        });
        return result;
    }

    public param(key: string, defaultValue?: any): any {
        return this.params[key] ?? defaultValue;
    }

    public setParam(key: string, value: any): this {
        this.params[key] = value;
        return this;
    }

    public getParams(): Record<string, any> {
        return this.params;
    }

    public is(...methods: string[]): boolean {
        return methods.map(m => m.toUpperCase()).includes(this.method);
    }

    public isJson(): boolean {
        const contentType = this.header('content-type') as string;
        return contentType?.includes('application/json') ?? false;
    }

    public getAuthenticatedUser(): any {
        return this.user;
    }

    public setUser(user: any): this {
        this.user = user;
        return this;
    }

    public hasUser(): boolean {
        return this.user !== null;
    }

    public getAttributes(): Record<string, any> {
        return this.body;
    }

    /**
     * Get all input data (body + query)
     */
    public all(): Record<string, any> {
        return { ...this.query, ...this.body };
    }

    /**
     * Validate the request data against rules
     */
    public async validate(rules: Record<string, string>): Promise<any> {
        const data = this.all();
        const { Validator } = require('../services/Validator');
        const result = Validator.validate(data, rules);

        if (!result.isValid) {
            throw new Error(JSON.stringify({
                message: 'Validation failed',
                errors: result.errors,
                is_validation_error: true
            }));
        }

        return data;
    }
}
