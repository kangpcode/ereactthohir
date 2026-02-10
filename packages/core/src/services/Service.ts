export abstract class Service {
    abstract execute(...args: any[]): Promise<any> | any;
}
