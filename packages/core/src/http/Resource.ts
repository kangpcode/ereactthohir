export abstract class Resource {
    /**
     * The resource instance.
     */
    protected resource: any;

    /**
     * Create a new resource instance.
     */
    constructor(resource: any) {
        this.resource = resource;
    }

    /**
     * Transform the resource into an array.
     */
    public abstract toArray(request: any): Record<string, any>;

    /**
     * Create a new anonymous resource collection.
     */
    public static collection(data: any[]): any[] {
        return data.map(item => {
            // @ts-ignore
            const instance = new this(item);
            return instance.toArray({});
        });
    }

    /**
     * Resolve the resource to a JSON object.
     */
    public resolve(request: any = {}): Record<string, any> {
        return this.toArray(request);
    }
}
