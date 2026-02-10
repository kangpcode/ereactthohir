import { Model } from '../database/Model';

export class Factory<T extends Model> {
    private model: new () => T;
    private attributes: Record<string, any> = {};
    private count: number = 1;

    constructor(model: new () => T) {
        this.model = model;
    }

    /**
     * Set default attributes
     */
    public state(attributes: Record<string, any>): this {
        this.attributes = { ...this.attributes, ...attributes };
        return this;
    }

    /**
     * Set how many instances to create
     */
    public times(count: number): this {
        this.count = count;
        return this;
    }

    /**
     * Create instances
     */
    public create(overrides: Record<string, any> = {}): T | T[] {
        const instances: T[] = [];
        const finalAttributes = { ...this.attributes, ...overrides };

        for (let i = 0; i < this.count; i++) {
            const instance = new this.model();
            if (typeof instance.fill === 'function') {
                instance.fill(finalAttributes);
            }
            instances.push(instance);
        }

        return this.count === 1 ? instances[0] : instances;
    }

    /**
     * Create and save instances
     */
    public async createQuietly(overrides: Record<string, any> = {}): Promise<T | T[]> {
        const instances = this.create(overrides) as T[];
        const savedInstances: T[] = [];

        for (const instance of (Array.isArray(instances) ? instances : [instances])) {
            if (typeof instance.save === 'function') {
                await instance.save();
            }
            savedInstances.push(instance);
        }

        return this.count === 1 ? savedInstances[0] : savedInstances;
    }

    /**
     * Create raw data
     */
    public raw(overrides: Record<string, any> = {}): Record<string, any> {
        return { ...this.attributes, ...overrides };
    }
}

export class FactoryBuilder {
    public static define<T extends Model>(
        model: new () => T,
        attributes: Record<string, any>
    ): Factory<T> {
        const factory = new Factory(model);
        return factory.state(attributes);
    }
}
