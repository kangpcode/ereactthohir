export type ScheduledTask = () => Promise<void> | void;

export class Scheduler {
    private tasks: Map<string, { task: ScheduledTask, interval: number, lastRun: number }> = new Map();
    private timer: NodeJS.Timeout | null = null;

    public schedule(name: string, intervalMs: number, task: ScheduledTask) {
        this.tasks.set(name, {
            task,
            interval: intervalMs,
            lastRun: 0
        });
        this.start();
    }

    public start() {
        if (this.timer) return;

        this.timer = setInterval(() => {
            const now = Date.now();
            this.tasks.forEach((config, name) => {
                if (now - config.lastRun >= config.interval) {
                    try {
                        console.log(`[Scheduler] Running task: ${name}`);
                        const result = config.task();
                        if (result instanceof Promise) {
                            result.catch(err => console.error(`[Scheduler] Task ${name} failed:`, err));
                        }
                        config.lastRun = now;
                    } catch (err) {
                        console.error(`[Scheduler] Task ${name} failed:`, err);
                    }
                }
            });
        }, 1000); // Check every second
    }

    public stop() {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
    }
}

export const Schedule = new Scheduler();
