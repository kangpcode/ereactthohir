export interface HealthResult {
    status: 'ok' | 'warning' | 'error';
    details: Record<string, { status: 'ok' | 'error', message?: string, meta?: any }>;
}

export type HealthChecker = () => Promise<{ status: 'ok' | 'error', message?: string, meta?: any }>;

export class Health {
    private checkers: Map<string, HealthChecker> = new Map();

    public check(name: string, checker: HealthChecker) {
        this.checkers.set(name, checker);
    }

    public async run(): Promise<HealthResult> {
        const details: HealthResult['details'] = {};
        let overallStatus: HealthResult['status'] = 'ok';

        for (const [name, checker] of this.checkers) {
            try {
                const result = await checker();
                details[name] = result;
                if (result.status === 'error') overallStatus = 'error';
            } catch (err: any) {
                details[name] = { status: 'error', message: err.message };
                overallStatus = 'error';
            }
        }

        return { status: overallStatus, details };
    }
}

export const HealthCheck = new Health();
