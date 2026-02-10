import { Lang } from '../../foundation/Lang';

/**
 * SetLocale Middleware
 * 
 * Automatically sets the application locale based on:
 * 1. Query parameter (?lang=id)
 * 2. Accept-Language header
 * 3. Default config
 */
export default class SetLocale {
    public async handle(req: any, res: any, next: () => Promise<any>): Promise<any> {
        const lang = req.query?.lang || req.headers?.['accept-language']?.split(',')[0]?.split('-')[0] || 'en';

        Lang.setLocale(lang);

        return await next();
    }
}
