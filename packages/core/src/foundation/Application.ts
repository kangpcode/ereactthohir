import { Container } from './Container';
import { ServiceProvider } from './ServiceProvider';
import { Config } from './Config';
import { Hooks } from './Hooks';
import dotenv from 'dotenv';
import path from 'path';

export class Application extends Container {
    protected providers: ServiceProvider[] = [];
    protected isBooted: boolean = false;
    protected config: Config;
    protected hooks: Hooks;
    public basePath: string;
    public version: string = '1.4.0';

    constructor(basePath: string) {
        super();
        this.basePath = basePath;
        this.config = new Config();
        this.hooks = new Hooks();
        this.loadEnvironment();
        this.registerBaseBindings();
    }

    protected loadEnvironment() {
        dotenv.config({
            path: path.join(this.basePath, '.env')
        });
    }

    protected registerBaseBindings() {
        this.singleton('app', this);
        this.singleton(Application.name, this);
        this.singleton('config', this.config);
        this.singleton('hooks', this.hooks);
    }

    public register(provider: new (app: Application) => ServiceProvider) {
        const instance = new provider(this);
        instance.register();
        this.providers.push(instance);
        return this;
    }

    public boot() {
        if (this.isBooted) return;

        this.hooks.fire('booting').catch(err => {
            console.error('Error during booting hook:', err);
        });

        this.providers.forEach(provider => provider.boot());

        this.hooks.fire('booted').catch(err => {
            console.error('Error during booted hook:', err);
        });

        this.isBooted = true;
        return this;
    }

    public isRunning(): boolean {
        return this.isBooted;
    }

    public getBasePath(path?: string): string {
        return path ? `${this.basePath}/${path}` : this.basePath;
    }

    public getConfig(): Config {
        return this.config;
    }

    public getHooks(): Hooks {
        return this.hooks;
    }

    public getVersion(): string {
        return this.version;
    }
}
