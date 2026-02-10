export abstract class ServiceProvider {
    protected app: any;
    protected deferred: boolean = false;
    protected providedServices: string[] = [];

    constructor(app: any) {
        this.app = app;
    }

    /**
     * Register any application services.
     */
    abstract register(): void;

    /**
     * Bootstrap any application services.
     */
    boot(): void { }

    /**
     * Determine if the provider is deferred
     */
    isDeferred(): boolean {
        return this.deferred;
    }

    /**
     * Get the services provided by this provider
     */
    provides(): string[] {
        return this.providedServices;
    }
}
