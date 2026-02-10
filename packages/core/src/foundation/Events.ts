type Listener = (data: any) => void | Promise<void>;

export class EventDispatcher {
    private listeners: Map<string, Listener[]> = new Map();

    /**
     * Register an event listener.
     */
    public listen(event: string | any, listener: Listener) {
        const eventName = typeof event === 'string' ? event : event.name;
        if (!this.listeners.has(eventName)) {
            this.listeners.set(eventName, []);
        }
        this.listeners.get(eventName)!.push(listener);
    }

    /**
     * Dispatch an event.
     */
    public async dispatch(event: string | any, data?: any) {
        let eventName: string;
        let eventData: any;

        if (typeof event === 'string') {
            eventName = event;
            eventData = data;
        } else {
            eventName = event.constructor.name;
            eventData = event;
        }

        const eventListeners = this.listeners.get(eventName);
        if (eventListeners) {
            await Promise.all(eventListeners.map(listener => {
                try {
                    return Promise.resolve(listener(eventData));
                } catch (error) {
                    console.error(`Error in event listener for ${eventName}:`, error);
                }
            }));
        }
    }
}

export const Events = new EventDispatcher();
