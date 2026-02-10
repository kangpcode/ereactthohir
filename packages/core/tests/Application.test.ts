import { Application } from '../src/foundation/Application';

describe('Application', () => {
    it('can register and make bindings', () => {
        const app = new Application(__dirname);
        app.singleton('test', () => 'hello');

        expect(app.make('test')).toBe('hello');
    });

    it('can boot service providers', () => {
        const app = new Application(__dirname);
        let booted = false;

        class TestProvider {
            register() { }
            boot() { booted = true; }
        }

        app.register(TestProvider as any);
        app.boot();

        expect(booted).toBe(true);
    });
});
