import { Request } from '../http/Request';
import { Response } from '../http/Response';

export class TestRequest extends Request {
    constructor(data?: any) {
        const defaultData = {
            method: 'GET',
            path: '/',
            headers: {},
            query: {},
            body: {},
            ...data
        };
        super(defaultData);
    }

    /**
     * Create GET request
     */
    public static get(path: string = '/'): TestRequest {
        return new TestRequest({ method: 'GET', path });
    }

    /**
     * Create POST request
     */
    public static post(path: string = '/', body: Record<string, any> = {}): TestRequest {
        return new TestRequest({ method: 'POST', path, body });
    }

    /**
     * Create PUT request
     */
    public static put(path: string = '/', body: Record<string, any> = {}): TestRequest {
        return new TestRequest({ method: 'PUT', path, body });
    }

    /**
     * Create PATCH request
     */
    public static patch(path: string = '/', body: Record<string, any> = {}): TestRequest {
        return new TestRequest({ method: 'PATCH', path, body });
    }

    /**
     * Create DELETE request
     */
    public static delete(path: string = '/', body: Record<string, any> = {}): TestRequest {
        return new TestRequest({ method: 'DELETE', path, body });
    }

    /**
     * Set request body
     */
    public withBody(body: Record<string, any>): this {
        Object.entries(body).forEach(([key, value]) => {
            this.setBodyAttribute(key, value);
        });
        return this;
    }

    /**
     * Set query parameters
     */
    public withQuery(query: Record<string, any>): this {
        this.setQuery(query);
        return this;
    }

    /**
     * Set request headers
     */
    public withHeaders(headers: Record<string, string>): this {
        Object.entries(headers).forEach(([key, value]) => {
            this.setHeader(key, value);
        });
        return this;
    }

    /**
     * Set authenticated user
     */
    public actingAs(user: any): this {
        this.setUser(user);
        return this;
    }

    /**
     * Set as JSON request
     */
    public asJson(): this {
        this.setHeader('Content-Type', 'application/json');
        return this;
    }

    private setBodyAttribute(key: string, value: any): this {
        const attrs = this.getAttributes();
        attrs[key] = value;
        return this;
    }
}

export class TestResponse extends Response {
    /**
     * Assert response status
     */
    public assertStatus(code: number): this {
        if (this.getStatus() !== code) {
            throw new Error(`Expected status ${code}, got ${this.getStatus()}`);
        }
        return this;
    }

    /**
     * Assert success
     */
    public assertSuccess(): this {
        const body = this.getBody();
        if (body && !body.success) {
            throw new Error('Response is not successful');
        }
        return this;
    }

    /**
     * Assert contains key in JSON
     */
    public assertJsonHas(key: string): this {
        const body = this.getBody();
        if (!body || !(key in body)) {
            throw new Error(`JSON does not contain key: ${key}`);
        }
        return this;
    }

    /**
     * Assert JSON structure
     */
    public assertJsonStructure(keys: string[]): this {
        const body = this.getBody();
        if (!body) {
            throw new Error('No JSON response body');
        }

        for (const key of keys) {
            if (!(key in body)) {
                throw new Error(`Expected key "${key}" in JSON response`);
            }
        }
        return this;
    }
}
