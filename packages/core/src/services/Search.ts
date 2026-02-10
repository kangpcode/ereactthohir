export interface SearchDriver {
    search(query: string, options?: any): Promise<any[]>;
    index(data: any): Promise<void>;
    remove(id: any): Promise<void>;
}

export class SearchManager {
    private drivers: Map<string, SearchDriver> = new Map();
    private defaultDriver: string = 'local';

    public extend(name: string, driver: SearchDriver) {
        this.drivers.set(name, driver);
    }

    public driver(name?: string): SearchDriver {
        const driverName = name || this.defaultDriver;
        const driver = this.drivers.get(driverName);
        if (!driver) throw new Error(`Search driver [${driverName}] not found.`);
        return driver;
    }

    public async search(query: string, options?: any) {
        return await this.driver().search(query, options);
    }
}

export const Search = new SearchManager();
