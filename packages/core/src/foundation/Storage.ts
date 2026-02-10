import fs from 'fs-extra';
import path from 'path';
import { Logger } from './Logger';

export class Storage {
    private static root = path.join(process.cwd(), 'storage/app');

    static async put(filePath: string, content: string | Buffer) {
        const fullPath = path.join(this.root, filePath);
        await fs.ensureDir(path.dirname(fullPath));
        await fs.writeFile(fullPath, content);
        Logger.success(`File stored: ${filePath}`);
    }

    static async get(filePath: string) {
        const fullPath = path.join(this.root, filePath);
        if (await fs.pathExists(fullPath)) {
            return await fs.readFile(fullPath);
        }
        return null;
    }

    static async delete(filePath: string) {
        const fullPath = path.join(this.root, filePath);
        await fs.remove(fullPath);
        Logger.info(`File deleted: ${filePath}`);
    }

    static async exists(filePath: string) {
        return await fs.pathExists(path.join(this.root, filePath));
    }
}
