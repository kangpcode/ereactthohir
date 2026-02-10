import { QueryBuilder } from './QueryBuilder';

export abstract class Model {
    static table: string = '';
    protected attributes: Record<string, any> = {};
    protected relations: Record<string, any> = {};
    protected hidden: string[] = [];
    protected visible: string[] = [];
    protected fillable: string[] = [];
    protected guarded: string[] = [];

    constructor(attributes: any = {}) {
        this.fill(attributes);
    }

    /**
     * Fill the model with attributes
     */
    public fill(attributes: Record<string, any>): this {
        Object.entries(attributes).forEach(([key, value]) => {
            if (this.isFillable(key)) {
                this.attributes[key] = value;
            }
        });
        return this;
    }

    /**
     * Check if attribute is fillable
     */
    protected isFillable(key: string): boolean {
        if (this.fillable.length > 0) {
            return this.fillable.includes(key);
        }
        return !this.guarded.includes(key);
    }

    /**
     * Get attribute value
     */
    public getAttribute(key: string): any {
        if (this.relations.hasOwnProperty(key)) {
            return this.relations[key];
        }
        return this.attributes[key];
    }

    /**
     * Set attribute value
     */
    public setAttribute(key: string, value: any): this {
        this.attributes[key] = value;
        return this;
    }

    /**
     * Get all attributes
     */
    public getAttributes(): Record<string, any> {
        return { ...this.attributes };
    }

    static query(): QueryBuilder {
        return new QueryBuilder((this as any).table);
    }

    static async find(id: any): Promise<any> {
        return this.query().where('id', id).first();
    }

    static async findOrFail(id: any): Promise<any> {
        const result = await this.find(id);
        if (!result) {
            throw new Error(`No record found with id: ${id}`);
        }
        return result;
    }

    static async all(): Promise<any[]> {
        return this.query().get();
    }

    static async count(): Promise<number> {
        const result = await this.query().count();
        return result;
    }

    /**
     * Save the model
     */
    async save(): Promise<this> {
        const table = (this.constructor as any).table;
        if (!table) {
            throw new Error('Table not defined for model');
        }

        if (!this.attributes.id) {
            this.attributes.id = Math.floor(Math.random() * 100000);
        }

        console.log(`Saving record to ${table}...`);
        return this;
    }

    /**
     * Delete the model
     */
    async delete(): Promise<boolean> {
        const table = (this.constructor as any).table;
        if (!this.attributes.id) {
            throw new Error('Cannot delete model without id');
        }
        console.log(`Deleting record from ${table} with id: ${this.attributes.id}`);
        return true;
    }

    /**
     * Update the model
     */
    async update(attributes: Record<string, any>): Promise<this> {
        this.fill(attributes);
        await this.save();
        return this;
    }

    /**
     * Has One Relationship
     */
    public hasOne(related: any, localKey: string = 'id', foreignKey: string): Promise<any> {
        return related.query()
            .where(foreignKey, this.getAttribute(localKey))
            .first();
    }

    /**
     * Has Many Relationship
     */
    public hasMany(related: any, localKey: string = 'id', foreignKey: string): Promise<any[]> {
        return related.query()
            .where(foreignKey, this.getAttribute(localKey))
            .get();
    }

    /**
     * Belongs To Relationship
     */
    public belongsTo(related: any, foreignKey: string, ownerKey: string = 'id'): Promise<any> {
        return related.query()
            .where(ownerKey, this.getAttribute(foreignKey))
            .first();
    }

    /**
     * Belongs To Many Relationship
     */
    public belongsToMany(
        related: any,
        pivotTable: string,
        localForeignKey: string,
        relatedForeignKey: string
    ): Promise<any[]> {
        // Simplified implementation
        return related.query().get();
    }

    /**
     * Eager load relations
     */
    public async load(...relations: string[]): Promise<this> {
        for (const relation of relations) {
            if (typeof (this as any)[relation] === 'function') {
                this.relations[relation] = await (this as any)[relation]();
            }
        }
        return this;
    }

    /**
     * Convert to JSON
     */
    public toJSON(): Record<string, any> {
        const data = { ...this.attributes };
        
        // Hide specified fields
        this.hidden.forEach(field => {
            delete data[field];
        });

        // Only include visible fields if specified
        if (this.visible.length > 0) {
            const visible: Record<string, any> = {};
            this.visible.forEach(field => {
                visible[field] = data[field];
            });
            return visible;
        }

        return data;
    }

    /**
     * Serialize to JSON string
     */
    public toJSONString(): string {
        return JSON.stringify(this.toJSON());
    }

    /**
     * Get array representation
     */
    public toArray(): Record<string, any> {
        return this.toJSON();
    }
}

