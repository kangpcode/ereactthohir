export interface IMiddleware {
    handle(request: any, response: any, next: (err?: Error) => Promise<void>): Promise<void>;
}

export abstract class Middleware implements IMiddleware {
    abstract handle(request: any, response: any, next: (err?: Error) => Promise<void>): Promise<void>;
}
