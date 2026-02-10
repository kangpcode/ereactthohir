export type HookCallback = (...args: any[]) => Promise<void> | void;

export class Hooks {
    private hooks: Map<string, HookCallback[]> = new Map();

    public on(event: string, callback: HookCallback): void {
        if (!this.hooks.has(event)) {
            this.hooks.set(event, []);
        }
        this.hooks.get(event)!.push(callback);
    }

    public async fire(event: string, ...args: any[]): Promise<void> {
        const callbacks = this.hooks.get(event) || [];
        for (const callback of callbacks) {
            await Promise.resolve(callback(...args));
        }
    }

    public forget(event: string): void {
        this.hooks.delete(event);
    }

    public forgetAll(): void {
        this.hooks.clear();
    }
}
