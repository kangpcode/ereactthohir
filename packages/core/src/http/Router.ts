import { Request } from './Request';
import { Response } from './Response';

type Handler = (req: Request, res: Response) => any;
type MiddlewareHandler = (req: Request, res: Response, next: () => Promise<void>) => Promise<void>;

interface RouteDefinition {
    path: string;
    method: string;
    handler: any;
    middleware: MiddlewareHandler[];
    name?: string;
    params?: string[];
}

export class Router {
    private routes: RouteDefinition[] = [];
    private groupStack: { prefix: string; middleware: MiddlewareHandler[] }[] = [];
    private middlewareAliases: Map<string, MiddlewareHandler> = new Map();
    private resourceRoutes: Map<string, RouteDefinition[]> = new Map();

    public group(
        options: { prefix?: string; middleware?: (string | MiddlewareHandler)[] },
        callback: (router: Router) => void
    ): this {
        const middleware = (options.middleware || []).map(m =>
            typeof m === 'string' ? this.middlewareAliases.get(m) || (async () => { }) as MiddlewareHandler : m
        );

        this.groupStack.push({
            prefix: options.prefix || '',
            middleware
        });

        callback(this);
        this.groupStack.pop();
        return this;
    }

    private extractParams(path: string): string[] {
        const paramRegex = /{([^}]+)}/g;
        const params: string[] = [];
        let match;
        while ((match = paramRegex.exec(path)) !== null) {
            params.push(match[1]);
        }
        return params;
    }

    private normalizePath(path: string): string {
        const prefix = this.groupStack.map(g => g.prefix).join('');
        let fullPath = prefix + path;
        if (!fullPath.startsWith('/')) fullPath = '/' + fullPath;
        fullPath = fullPath.replace(/\/+$/, '') || '/';
        return fullPath;
    }

    private getGroupMiddleware(): MiddlewareHandler[] {
        return this.groupStack.flatMap(g => g.middleware);
    }

    private addRoute(method: string, path: string, handler: any): RouteDefinition {
        const normalizedPath = this.normalizePath(path);
        const params = this.extractParams(normalizedPath);
        const middleware = this.getGroupMiddleware();

        const route: RouteDefinition = {
            path: normalizedPath,
            method,
            handler,
            middleware,
            params
        };

        this.routes.push(route);
        return route;
    }

    public get(path: string, handler: any): this {
        this.addRoute('GET', path, handler);
        return this;
    }

    public post(path: string, handler: any): this {
        this.addRoute('POST', path, handler);
        return this;
    }

    public put(path: string, handler: any): this {
        this.addRoute('PUT', path, handler);
        return this;
    }

    public patch(path: string, handler: any): this {
        this.addRoute('PATCH', path, handler);
        return this;
    }

    public delete(path: string, handler: any): this {
        this.addRoute('DELETE', path, handler);
        return this;
    }

    public resource(resource: string, controller: any): this {
        const routes: RouteDefinition[] = [
            this.addRoute('GET', `/${resource}`, (req: Request, res: Response) => controller.index(req, res)),
            this.addRoute('POST', `/${resource}`, (req: Request, res: Response) => controller.store(req, res)),
            this.addRoute('GET', `/${resource}/{id}`, (req: Request, res: Response) => controller.show(req, res)),
            this.addRoute('PUT', `/${resource}/{id}`, (req: Request, res: Response) => controller.update(req, res)),
            this.addRoute('DELETE', `/${resource}/{id}`, (req: Request, res: Response) => controller.destroy(req, res)),
            this.addRoute('GET', `/${resource}/{id}/edit`, (req: Request, res: Response) => controller.edit(req, res)),
            this.addRoute('GET', `/${resource}/create`, (req: Request, res: Response) => controller.create(req, res))
        ];

        this.resourceRoutes.set(resource, routes);
        return this;
    }

    public getRoutes(): RouteDefinition[] {
        return this.routes;
    }

    public getRoute(method: string, path: string): RouteDefinition | undefined {
        return this.routes.find(route => this.matchRoute(route, method, path));
    }

    private matchRoute(route: RouteDefinition, method: string, path: string): boolean {
        if (route.method !== method) return false;

        const routeSegments = route.path.split('/').filter(s => s);
        const pathSegments = path.split('/').filter(s => s);

        if (routeSegments.length !== pathSegments.length) return false;

        return routeSegments.every((segment, index) => {
            if (segment.startsWith('{') && segment.endsWith('}')) {
                return true; // Param matches anything
            }
            return segment === pathSegments[index];
        });
    }

    public matchAndExtractParams(method: string, path: string): { route: RouteDefinition; params: Record<string, any> } | null {
        const route = this.getRoute(method, path);
        if (!route) return null;

        const params: Record<string, any> = {};
        const routeSegments = route.path.split('/').filter(s => s);
        const pathSegments = path.split('/').filter(s => s);

        routeSegments.forEach((segment, index) => {
            if (segment.startsWith('{') && segment.endsWith('}')) {
                const paramName = segment.slice(1, -1);
                params[paramName] = pathSegments[index];
            }
        });

        return { route, params };
    }

    // For mobile navigation
    public screen(name: string, handler: any): this {
        this.addRoute('SCREEN', name, handler);
        return this;
    }

    public middleware(...middleware: (string | MiddlewareHandler)[]): MiddlewareHandler {
        return async (req: Request, res: Response, next: () => Promise<void>) => {
            for (const m of middleware) {
                const handler = typeof m === 'string' ? this.middlewareAliases.get(m) : m;
                if (handler) {
                    await handler(req, res, () => Promise.resolve());
                }
            }
            await next();
        };
    }

    public name(name: string): this {
        const lastRoute = this.routes[this.routes.length - 1];
        if (lastRoute) {
            lastRoute.name = name;
        }
        return this;
    }

    public registerMiddleware(name: string, middleware: MiddlewareHandler): this {
        this.middlewareAliases.set(name, middleware);
        return this;
    }

    public getMiddleware(name: string): MiddlewareHandler | undefined {
        return this.middlewareAliases.get(name);
    }

    /**
     * Generate OpenAPI 3.0 specification
     */
    public toOpenApi(): any {
        const spec: any = {
            openapi: '3.0.0',
            info: {
                title: 'EreactThohir API Documentation',
                version: '1.4.0',
                description: 'Auto-generated documentation from EreactThohir Router'
            },
            paths: {}
        };

        this.routes.forEach(route => {
            if (route.method === 'SCREEN') return;

            const path = route.path.replace(/{([^}]+)}/g, ':$1');
            if (!spec.paths[path]) spec.paths[path] = {};

            const method = route.method.toLowerCase();
            spec.paths[path][method] = {
                summary: route.name || `${route.method} ${path}`,
                parameters: route.params?.map(p => ({
                    name: p,
                    in: 'path',
                    required: true,
                    schema: { type: 'string' }
                })),
                responses: {
                    '200': { description: 'Successful response' }
                }
            };
        });

        return spec;
    }
}

export const Route = new Router();
