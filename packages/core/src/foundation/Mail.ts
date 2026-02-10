import { Logger } from './Logger';

export interface MailConfig {
    driver: 'smtp' | 'log' | 'ses';
    host?: string;
    port?: number;
    user?: string;
    pass?: string;
    from: string;
}

export class Mail {
    private static config: MailConfig = {
        driver: 'log',
        from: 'noreply@ereactthohir.com'
    };

    static setConfig(config: MailConfig) {
        this.config = config;
    }

    static async send(to: string, subject: string, body: string) {
        if (this.config.driver === 'log') {
            Logger.info(`Mailing to: ${to}`);
            Logger.info(`Subject: ${subject}`);
            Logger.info(`Body: ${body}`);
            return true;
        }

        // TODO: Implement SMTP/SES drivers
        Logger.warn('Mail driver not fully implemented. Falling back to log.');
        return true;
    }
}
