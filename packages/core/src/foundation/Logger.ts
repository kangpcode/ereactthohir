import chalk from 'chalk';

export class Logger {
    private static getTime() {
        return new Date().toISOString();
    }

    static info(message: string) {
        console.log(`${chalk.blue('[INFO]')} [${this.getTime()}] ${message}`);
    }

    static success(message: string) {
        console.log(`${chalk.green('[SUCCESS]')} [${this.getTime()}] ${message}`);
    }

    static error(message: string, error?: any) {
        console.error(`${chalk.red('[ERROR]')} [${this.getTime()}] ${message}`);
        if (error) {
            console.error(error);
        }
    }

    static warn(message: string) {
        console.warn(`${chalk.yellow('[WARN]')} [${this.getTime()}] ${message}`);
    }

    static debug(message: string) {
        if (process.env.APP_DEBUG === 'true') {
            console.log(`${chalk.magenta('[DEBUG]')} [${this.getTime()}] ${message}`);
        }
    }
}
