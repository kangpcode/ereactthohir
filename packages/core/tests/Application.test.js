"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Application_1 = require("../src/foundation/Application");
describe('Application', () => {
    it('can register and make bindings', () => {
        const app = new Application_1.Application(__dirname);
        app.singleton('test', () => 'hello');
        expect(app.make('test')).toBe('hello');
    });
    it('can boot service providers', () => {
        const app = new Application_1.Application(__dirname);
        let booted = false;
        class TestProvider {
            register() { }
            boot() { booted = true; }
        }
        app.register(TestProvider);
        app.boot();
        expect(booted).toBe(true);
    });
});
//# sourceMappingURL=Application.test.js.map