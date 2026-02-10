export class QueryBuilder {
    private table: string;
    private wheres: { column: string, operator: string, value: any, boolean: 'and' | 'or' }[] = [];
    private orWheres: { column: string, operator: string, value: any }[] = [];
    private limitValue: number | null = null;
    private offsetValue: number = 0;
    private order: { column: string, direction: 'ASC' | 'DESC' }[] = [];
    private selectColumns: string[] = ['*'];
    private joins: { table: string, on: string }[] = [];
    private groupByColumns: string[] = [];
    private havings: { column: string, operator: string, value: any }[] = [];
    private isDistinct: boolean = false;

    constructor(table: string) {
        this.table = table;
    }

    /**
     * Specify columns to select
     */
    public select(...columns: string[]): this {
        this.selectColumns = columns.length > 0 ? columns : ['*'];
        return this;
    }

    /**
     * Add a where clause
     */
    public where(column: string, value: any): this;
    public where(column: string, operator: string, value: any): this;
    public where(column: string, operatorOrValue: any, value?: any): this {
        if (value === undefined) {
            this.wheres.push({ column, operator: '=', value: operatorOrValue, boolean: 'and' });
        } else {
            this.wheres.push({ column, operator: operatorOrValue, value, boolean: 'and' });
        }
        return this;
    }

    /**
     * Add an or where clause
     */
    public orWhere(column: string, value: any): this;
    public orWhere(column: string, operator: string, value: any): this;
    public orWhere(column: string, operatorOrValue: any, value?: any): this {
        if (value === undefined) {
            this.orWheres.push({ column, operator: '=', value: operatorOrValue });
        } else {
            this.orWheres.push({ column, operator: operatorOrValue, value });
        }
        return this;
    }

    /**
     * Add where in clause
     */
    public whereIn(column: string, values: any[]): this {
        this.wheres.push({ column, operator: 'IN', value: values, boolean: 'and' });
        return this;
    }

    /**
     * Add where not in clause
     */
    public whereNotIn(column: string, values: any[]): this {
        this.wheres.push({ column, operator: 'NOT IN', value: values, boolean: 'and' });
        return this;
    }

    /**
     * Add where null clause
     */
    public whereNull(column: string): this {
        this.wheres.push({ column, operator: 'IS NULL', value: null, boolean: 'and' });
        return this;
    }

    /**
     * Add where not null clause
     */
    public whereNotNull(column: string): this {
        this.wheres.push({ column, operator: 'IS NOT NULL', value: null, boolean: 'and' });
        return this;
    }

    /**
     * Add where between clause
     */
    public whereBetween(column: string, values: [any, any]): this {
        this.wheres.push({ column, operator: 'BETWEEN', value: values, boolean: 'and' });
        return this;
    }

    /**
     * Set limit
     */
    public limit(n: number): this {
        this.limitValue = n;
        return this;
    }

    /**
     * Set offset
     */
    public offset(n: number): this {
        this.offsetValue = n;
        return this;
    }

    /**
     * Add order by
     */
    public orderBy(column: string, direction: 'ASC' | 'DESC' = 'ASC'): this {
        this.order.push({ column, direction });
        return this;
    }

    /**
     * Add latest order
     */
    public latest(column: string = 'created_at'): this {
        return this.orderBy(column, 'DESC');
    }

    /**
     * Add oldest order
     */
    public oldest(column: string = 'created_at'): this {
        return this.orderBy(column, 'ASC');
    }

    /**
     * Group by clause
     */
    public groupBy(...columns: string[]): this {
        this.groupByColumns.push(...columns);
        return this;
    }

    /**
     * Set distinct
     */
    public distinct(): this {
        this.isDistinct = true;
        return this;
    }

    /**
     * Join table
     */
    public join(table: string, on: string): this {
        this.joins.push({ table, on });
        return this;
    }

    /**
     * Execute query and get all results
     */
    public async get(): Promise<any[]> {
        const query = this.buildSelect();
        console.log(`Executing: ${query}`);
        return [];
    }

    /**
     * Get first result
     */
    public async first(): Promise<any | null> {
        const results = await this.limit(1).get();
        return results[0] || null;
    }

    /**
     * Get count
     */
    public async count(column: string = '*'): Promise<number> {
        const query = `SELECT COUNT(${column}) as count FROM ${this.table}`;
        console.log(`Executing: ${query}`);
        return 0;
    }

    /**
     * Get sum
     */
    public async sum(column: string): Promise<number> {
        const query = `SELECT SUM(${column}) as total FROM ${this.table}`;
        console.log(`Executing: ${query}`);
        return 0;
    }

    /**
     * Get average
     */
    public async avg(column: string): Promise<number> {
        const query = `SELECT AVG(${column}) as average FROM ${this.table}`;
        console.log(`Executing: ${query}`);
        return 0;
    }

    /**
     * Get maximum value
     */
    public async max(column: string): Promise<any> {
        const query = `SELECT MAX(${column}) as max FROM ${this.table}`;
        console.log(`Executing: ${query}`);
        return null;
    }

    /**
     * Get minimum value
     */
    public async min(column: string): Promise<any> {
        const query = `SELECT MIN(${column}) as min FROM ${this.table}`;
        console.log(`Executing: ${query}`);
        return null;
    }

    /**
     * Insert records
     */
    public async insert(records: Record<string, any>[]): Promise<boolean> {
        console.log(`Inserting into ${this.table}:`, records);
        return true;
    }

    /**
     * Update records
     */
    public async update(values: Record<string, any>): Promise<number> {
        const query = `UPDATE ${this.table} SET ${Object.keys(values).join(', ')} ${this.buildWheres()}`;
        console.log(`Executing: ${query}`);
        return 0;
    }

    /**
     * Delete records
     */
    public async delete(): Promise<number> {
        const query = `DELETE FROM ${this.table} ${this.buildWheres()}`;
        console.log(`Executing: ${query}`);
        return 0;
    }

    /**
     * Paginate results
     */
    public async paginate(perPage: number = 15, page: number = 1): Promise<{ data: any[], total: number, perPage: number, currentPage: number }> {
        const total = await this.count();
        const data = await this.offset((page - 1) * perPage).limit(perPage).get();
        return { data, total, perPage, currentPage: page };
    }

    private buildSelect(): string {
        let query = `SELECT ${this.isDistinct ? 'DISTINCT ' : ''}${this.selectColumns.join(', ')} FROM ${this.table}`;

        if (this.joins.length > 0) {
            query += ' ' + this.joins.map(j => `JOIN ${j.table} ON ${j.on}`).join(' ');
        }

        const wheres = this.buildWheres();
        if (wheres) {
            query += ' ' + wheres;
        }

        if (this.groupByColumns.length > 0) {
            query += ` GROUP BY ${this.groupByColumns.join(', ')}`;
        }

        if (this.order.length > 0) {
            query += ` ORDER BY ${this.order.map(o => `${o.column} ${o.direction}`).join(', ')}`;
        }

        if (this.limitValue !== null) {
            query += ` LIMIT ${this.limitValue}`;
        }

        if (this.offsetValue > 0) {
            query += ` OFFSET ${this.offsetValue}`;
        }

        return query;
    }

    private buildWheres(): string {
        if (this.wheres.length === 0 && this.orWheres.length === 0) return '';

        let conditions: string[] = [];

        this.wheres.forEach(w => {
            if (w.operator === 'IN' || w.operator === 'NOT IN') {
                conditions.push(`${w.column} ${w.operator} (${Array.isArray(w.value) ? w.value.join(',') : w.value})`);
            } else if (w.operator === 'BETWEEN') {
                conditions.push(`${w.column} BETWEEN ${w.value[0]} AND ${w.value[1]}`);
            } else if (w.operator === 'IS NULL' || w.operator === 'IS NOT NULL') {
                conditions.push(`${w.column} ${w.operator}`);
            } else {
                conditions.push(`${w.column} ${w.operator} ?`);
            }
        });

        if (this.orWheres.length > 0) {
            const orConditions = this.orWheres.map(w => `${w.column} ${w.operator} ?`).join(' OR ');
            conditions.push(`(${orConditions})`);
        }

        return 'WHERE ' + conditions.join(' AND ');
    }
}
