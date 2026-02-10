import 'dotenv/config';
import express, { Request as ExpressRequest, Response as ExpressResponse, NextFunction } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { Route } from '../http/Router';
import { Logger } from '../foundation/Logger';
import { ExceptionHandler } from './ExceptionHandler';
import { View } from '../foundation/View';
import { Request as EreactRequest } from './Request';
import { Response as EreactResponse } from './Response';
import React from 'react';
import path from 'path';
import fs from 'fs';

export class Kernel {
    protected app: express.Application;

    constructor() {
        this.app = express();
        this.app.use(helmet({
            contentSecurityPolicy: false,
        }));
        this.app.use(cors());
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
    }

    public async handle() {
        const routes = Route.getRoutes();
        console.log(`[Kernel] Registering ${routes.length} route(s) to Express...`);

        routes.forEach(route => {
            const method = route.method.toLowerCase() as 'get' | 'post' | 'put' | 'delete';

            if (this.app[method]) {
                console.log(`   [Route] ${route.method} ${route.path}`);

                this.app[method](route.path, async (req: ExpressRequest, res: ExpressResponse, next: NextFunction) => {
                    try {
                        Logger.info(`Incoming ${route.method} request to ${route.path}`);

                        // Wrap Express Request and Response
                        const erreq = new EreactRequest({
                            method: req.method,
                            path: req.path,
                            headers: req.headers,
                            query: req.query,
                            body: req.body,
                            params: req.params
                        });

                        // Basic app mock for dependencies
                        (erreq as any).app = {
                            make: (name: string) => {
                                if (name === 'auth') {
                                    return {
                                        attempt: async () => ({ id: 1, name: 'User' }),
                                        create: async (data: any) => ({ id: 1, ...data })
                                    };
                                }
                                return null;
                            }
                        };
                        (erreq as any).session = {
                            set: () => { },
                            get: () => { },
                            destroy: () => { }
                        };
                        (erreq as any).validate = async () => true;

                        const erres = new EreactResponse();

                        let result: any;

                        // Handle Controller array [ControllerClass, 'methodName']
                        if (Array.isArray(route.handler) && route.handler.length === 2) {
                            const [ControllerClass, methodName] = route.handler;
                            const controllerInstance = new ControllerClass();
                            result = await controllerInstance[methodName](erreq, erres);
                        } else if (typeof route.handler === 'function') {
                            result = await route.handler(erreq, erres);
                        } else {
                            result = await route.handler;
                        }

                        // If the handler didn't return anything but modified erres, use erres
                        if (result === undefined || result === erres) {
                            result = erres;
                        }

                        // Handle EreactResponse object
                        if (result instanceof EreactResponse || (result && result.getBody && result.getStatus)) {
                            const body = result.getBody();
                            const status = result.getStatus();
                            const headers = result.getHeaders();

                            // Set headers
                            Object.entries(headers).forEach(([key, value]) => {
                                res.setHeader(key, value as any);
                            });

                            res.status(status);

                            if (body && typeof body === 'object' && body.view) {
                                // Render React View
                                try {
                                    const projectRoot = process.cwd();
                                    let viewPath = path.join(projectRoot, 'resources/views', `${body.view}.tsx`);
                                    if (!fs.existsSync(viewPath)) {
                                        viewPath = path.join(projectRoot, 'resources/pages', `${body.view}.tsx`);
                                    }

                                    if (fs.existsSync(viewPath)) {
                                        const viewModule = require(viewPath);
                                        const Component = viewModule.default || viewModule;

                                        const html = View.render(React.createElement(Component, body.data || {}));
                                        res.setHeader('Content-Type', 'text/html');
                                        return res.send(html);
                                    } else {
                                        // Try converting dot notation to path path/to/view
                                        if (body.view.includes('.')) {
                                            const pathView = body.view.replace(/\./g, '/');
                                            let viewPathDots = path.join(projectRoot, 'resources/views', `${pathView}.tsx`);
                                            if (!fs.existsSync(viewPathDots)) {
                                                viewPathDots = path.join(projectRoot, 'resources/pages', `${pathView}.tsx`);
                                            }

                                            if (fs.existsSync(viewPathDots)) {
                                                const viewModule = require(viewPathDots);
                                                const Component = viewModule.default || viewModule;

                                                const html = View.render(React.createElement(Component, body.data || {}));
                                                res.setHeader('Content-Type', 'text/html');
                                                return res.send(html);
                                            }
                                        }
                                        console.warn(`View not found: ${body.view} at ${viewPath}`);
                                    }
                                } catch (e) {
                                    console.error(`View rendering failed for ${body.view}:`, e);
                                    throw e;
                                }
                            }

                            return res.send(body);
                        }

                        // Handle direct string/object results
                        if (!res.headersSent) {
                            if (typeof result === 'string') {
                                res.setHeader('Content-Type', 'text/html');
                                res.send(result);
                            } else {
                                res.json(result);
                            }
                        }
                    } catch (error: any) {
                        console.error('Kernel execution error:', error);
                        next(error);
                    }
                });
            }
        });

        // Global Error Handler
        this.app.use(ExceptionHandler.handle);

        // 404 Handler
        this.app.use(ExceptionHandler.setupNotFound);

        return this.app;
    }

    public listen(port: number, callback?: () => void) {
        return this.app.listen(port, callback);
    }
}
