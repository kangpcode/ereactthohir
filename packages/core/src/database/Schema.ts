export class Blueprint {
    private commands: string[] = [];
    private table: string;

    constructor(table: string) {
        this.table = table;
    }

    public increments(column: string) {
        this.commands.push(`\`${column}\` INT AUTO_INCREMENT PRIMARY KEY`);
        return this;
    }

    public string(column: string, length: number = 255) {
        this.commands.push(`\`${column}\` VARCHAR(${length})`);
        return this;
    }

    public text(column: string) {
        this.commands.push(`\`${column}\` TEXT`);
        return this;
    }

    public integer(column: string) {
        this.commands.push(`\`${column}\` INT`);
        return this;
    }

    public boolean(column: string) {
        this.commands.push(`\`${column}\` TINYINT(1)`);
        return this;
    }

    public timestamps() {
        this.commands.push(`\`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP`);
        this.commands.push(`\`updated_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`);
        return this;
    }

    public nullable() {
        if (this.commands.length > 0) {
            this.commands[this.commands.length - 1] += ' NULL';
        }
        return this;
    }

    public unique() {
        if (this.commands.length > 0) {
            this.commands[this.commands.length - 1] += ' UNIQUE';
        }
        return this;
    }

    public default(value: any) {
        if (this.commands.length > 0) {
            const formattedValue = typeof value === 'string' ? `'${value}'` : value;
            this.commands[this.commands.length - 1] += ` DEFAULT ${formattedValue}`;
        }
        return this;
    }

    public toString(): string {
        return `CREATE TABLE IF NOT EXISTS \`${this.table}\` (\n  ${this.commands.join(',\n  ')}\n);`;
    }
}

export class Schema {
    static async create(table: string, callback: (table: Blueprint) => void) {
        const blueprint = new Blueprint(table);
        callback(blueprint);
        const sql = blueprint.toString();
        console.log(`[Schema] Creating table: ${table}`);
        console.log(sql);
        // Link to database driver here
    }

    static async dropIfExists(table: string) {
        console.log(`[Schema] Dropping table: ${table}`);
        console.log(`DROP TABLE IF EXISTS \`${table}\``);
    }
}
