import { Request, Response, NextFunction } from 'express';
import { Logger } from '../foundation/Logger';

export class ExceptionHandler {
    public static handle(error: any, req: Request, res: Response, next: NextFunction) {
        let statusCode = error.status || 500;
        let message = error.message || 'Internal Server Error';
        let errors: any = undefined;

        // Detect validation errors
        try {
            const parsed = JSON.parse(message);
            if (parsed.is_validation_error) {
                statusCode = 422;
                message = parsed.message;
                errors = parsed.errors;
            }
        } catch (e) {
            // Not a JSON error, proceed normally
        }

        const isDebug = process.env.APP_DEBUG === 'true' || process.env.NODE_ENV === 'development';

        Logger.error(`[ExceptionHandler] ${req.method} ${req.url} - ${statusCode} - ${message}`, error);

        if (isDebug && !req.xhr && req.headers.accept?.includes('text/html')) {
            return res.status(statusCode).send(this.renderDebugPage(error, req));
        }

        res.status(statusCode).json({
            success: false,
            code: statusCode,
            message,
            ...(errors ? { errors } : {}),
            ...(isDebug && !errors ? { stack: error.stack } : {}),
            meta: {
                timestamp: Date.now(),
                path: req.url,
                version: '1.4.0'
            }
        });
    }

    private static renderDebugPage(error: any, req: Request): string {
        const stack = error.stack || 'No stack trace available';
        const message = error.message || 'Unknown Error';
        const fileName = stack.split('\n')[1]?.trim() || 'Unknown File';

        return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Error: ${message} - EreactThohir Debug</title>
            <style>
                :root {
                    --bg: #f8fafc;
                    --card: #ffffff;
                    --text-main: #0f172a;
                    --text-muted: #64748b;
                    --primary: #6366f1;
                    --danger: #ef4444;
                    --code-bg: #1e293b;
                }
                * { box-sizing: border-box; }
                body { 
                    margin: 0; 
                    font-family: 'Inter', -apple-system, sans-serif; 
                    background: var(--bg); 
                    color: var(--text-main);
                    line-height: 1.5;
                }
                .container { max-width: 1200px; margin: 0 auto; padding: 40px 20px; }
                .header { margin-bottom: 32px; }
                .badge { 
                    display: inline-block; 
                    padding: 4px 12px; 
                    background: var(--danger); 
                    color: white; 
                    border-radius: 99px; 
                    font-size: 12px; 
                    font-weight: 800; 
                    margin-bottom: 16px;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                }
                h1 { font-size: 32px; font-weight: 900; margin: 0; color: var(--text-main); letter-spacing: -0.02em; }
                .file-info { color: var(--text-muted); font-size: 14px; margin-top: 8px; font-family: monospace; }
                
                .card { 
                    background: var(--card); 
                    border: 1px solid #e2e8f0; 
                    border-radius: 24px; 
                    overflow: hidden; 
                    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05);
                    margin-bottom: 24px;
                }
                .card-header { padding: 20px 24px; border-bottom: 1px solid #f1f5f9; background: #fafafa; }
                .card-title { font-weight: 800; font-size: 14px; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.1em; }
                
                .stack-trace { 
                    padding: 24px; 
                    font-family: 'Fira Code', 'Cascadia Code', monospace; 
                    font-size: 13px; 
                    background: var(--code-bg); 
                    color: #94a3b8;
                    overflow-x: auto;
                    white-space: pre;
                    line-height: 2;
                }
                .stack-line.active { color: #f8fafc; background: rgba(255,255,255,0.05); display: block; padding: 0 10px; margin: 0 -10px; border-radius: 4px; }
                
                .tab-group { display: flex; gap: 4px; padding: 0 24px; margin-top: -1px; }
                .tab { font-size: 13px; font-weight: 700; padding: 12px 16px; border-bottom: 2px solid transparent; cursor: pointer; color: var(--text-muted); }
                .tab.active { color: var(--primary); border-bottom-color: var(--primary); }

                .meta-table { width: 100%; border-collapse: collapse; font-size: 14px; }
                .meta-table td { padding: 12px 24px; border-bottom: 1px solid #f1f5f9; }
                .meta-table td:first-child { width: 200px; font-weight: 700; color: var(--text-muted); background: #fafafa; }
                .meta-table tr:last-child td { border-bottom: none; }

                .system-brand { margin-top: 40px; text-align: center; color: var(--text-muted); font-size: 12px; font-weight: 600; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <span class="badge">Unhandled Exception</span>
                    <h1>${message}</h1>
                    <div class="file-info">${fileName}</div>
                </div>

                <div class="card">
                    <div class="card-header">
                        <div class="card-title">Stack Trace</div>
                    </div>
                    <div class="stack-trace">${this.formatStack(stack)}</div>
                </div>

                <div class="card">
                    <div class="card-header">
                        <div class="card-title">Request Info</div>
                    </div>
                    <table class="meta-table">
                        <tr><td>URL</td><td>${req.url}</td></tr>
                        <tr><td>Method</td><td>${req.method}</td></tr>
                        <tr><td>Headers</td><td><pre style="margin:0">${JSON.stringify(req.headers, null, 2)}</pre></td></tr>
                        <tr><td>Environment</td><td>${process.env.NODE_ENV || 'development'}</td></tr>
                        <tr><td>PHP/JS Engine</td><td>V8 (Node.js ${process.version})</td></tr>
                    </table>
                </div>

                <div class="system-brand">
                    EreactThohir Framework v1.3.1 • KangPCode Debugger
                </div>
            </div>
        </body>
        </html>
        `;
    }

    private static formatStack(stack: string): string {
        return stack.split('\n').map((line, i) => {
            const isActive = i === 1;
            return `<div class="stack-line ${isActive ? 'active' : ''}">${line}</div>`;
        }).join('');
    }

    public static setupNotFound(req: Request, res: Response) {
        res.status(404).json({
            success: false,
            error: {
                message: 'Resource not found',
                code: 'NOT_FOUND'
            },
            poweredBy: 'KangPCode'
        });
    }
}
