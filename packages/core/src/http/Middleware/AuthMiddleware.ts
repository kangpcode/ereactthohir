import { Request, Response, NextFunction } from 'express';
import { Auth } from '../../services/Auth';
import { Application } from '../../foundation/Application';

export class AuthMiddleware {
    constructor(protected app: Application) { }

    public async handle(req: Request, res: Response, next: NextFunction) {
        const auth = this.app.make<Auth>('auth');

        if (!auth.check()) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        next();
    }
}
