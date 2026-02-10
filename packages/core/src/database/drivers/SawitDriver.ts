import fs from 'fs-extra';
import path from 'path';

export class SawitDriver {
    private dbPath: string;

    constructor(basePath: string) {
        this.dbPath = path.join(basePath, 'database', 'sawit.db');
        fs.ensureFileSync(this.dbPath);
        if (!fs.readFileSync(this.dbPath, 'utf8')) {
            fs.writeJSONSync(this.dbPath, {});
        }
    }

    public async read(table: string): Promise<any[]> {
        const data = await fs.readJSON(this.dbPath);
        return data[table] || [];
    }

    public async write(table: string, records: any[]): Promise<void> {
        const data = await fs.readJSON(this.dbPath);
        data[table] = records;
        await fs.writeJSON(this.dbPath, data, { spaces: 2 });
    }
}
