export interface ResponseHeaders {
    [key: string]: string | string[];
}

export class Response {
    private statusCode: number = 200;
    private headers: ResponseHeaders = {
        'Content-Type': 'application/json'
    };
    private body: any = null;
    private sent: boolean = false;

    constructor(body?: any, statusCode?: number) {
        if (body !== undefined) {
            this.body = body;
        }
        if (statusCode !== undefined) {
            this.statusCode = statusCode;
        }
    }

    public status(code: number): this {
        this.statusCode = code;
        return this;
    }

    public getStatus(): number {
        return this.statusCode;
    }

    public header(key: string, value: string | string[]): this {
        this.headers[key] = value;
        return this;
    }

    public getHeader(key: string): string | string[] | undefined {
        return this.headers[key];
    }

    public getHeaders(): ResponseHeaders {
        return this.headers;
    }

    public json(data: any): this {
        this.header('Content-Type', 'application/json');
        this.body = data;
        return this;
    }

    public view(view: string, data?: any): this {
        this.header('Content-Type', 'text/html');
        this.body = { view, data };
        return this;
    }

    public html(html: string): this {
        this.header('Content-Type', 'text/html');
        this.body = html;
        return this;
    }

    public redirect(url: string, statusCode: number = 302): this {
        this.status(statusCode);
        this.header('Location', url);
        return this;
    }

    public download(path: string, filename?: string): this {
        this.header('Content-Disposition', `attachment; filename="${filename || path}"`);
        this.body = { file: path };
        return this;
    }

    public send(data?: any): this {
        if (data !== undefined) {
            this.body = data;
        }
        this.sent = true;
        return this;
    }

    public isSent(): boolean {
        return this.sent;
    }

    public getBody(): any {
        return this.body;
    }

    public success(message: string, data?: any): this {
        return this.json({
            success: true,
            message,
            data: data || null
        });
    }

    public error(message: string, statusCode: number = 400, data?: any): this {
        return this.status(statusCode).json({
            success: false,
            message,
            data: data || null
        });
    }
}
