export interface Broadcaster {
    broadcast(channels: string[], event: string, payload: any): Promise<void>;
}

export class BroadcastManager {
    private drivers: Map<string, Broadcaster> = new Map();
    private defaultDriver: string = 'pusher';

    public extend(name: string, driver: Broadcaster) {
        this.drivers.set(name, driver);
    }

    public driver(name?: string): Broadcaster {
        const driverName = name || this.defaultDriver;
        const driver = this.drivers.get(driverName);
        if (!driver) throw new Error(`Broadcast driver [${driverName}] not found.`);
        return driver;
    }

    public async event(channels: string | string[], event: string, payload: any) {
        const channelList = Array.isArray(channels) ? channels : [channels];
        return await this.driver().broadcast(channelList, event, payload);
    }
}

export const Broadcast = new BroadcastManager();
