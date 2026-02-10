export interface PaymentOptions {
    amount: number;
    currency?: string;
    orderId: string;
    customer?: {
        name: string;
        email: string;
        phone?: string;
    };
    items?: any[];
    [key: string]: any;
}

export interface PaymentGateway {
    charge(options: PaymentOptions): Promise<any>;
    createTransaction(options: PaymentOptions): Promise<any>;
    refund(transactionId: string, amount?: number): Promise<any>;
    verifyNotification(payload: any): Promise<any>;
}

export class PaymentManager {
    private gateways: Map<string, PaymentGateway> = new Map();
    private defaultGateway: string = 'midtrans';
    private defaultCurrency: string = 'IDR';

    public extend(name: string, gateway: PaymentGateway) {
        this.gateways.set(name, gateway);
    }

    public gateway(name?: string): PaymentGateway {
        const gatewayName = name || this.defaultGateway;
        const gateway = this.gateways.get(gatewayName);
        if (!gateway) throw new Error(`Payment gateway [${gatewayName}] not found.`);
        return gateway;
    }

    public setDefaultDriver(name: string) {
        this.defaultGateway = name;
    }

    public setCurrency(currency: string) {
        this.defaultCurrency = currency;
    }

    /**
     * Create a payment transaction (Redirect/Snap flow)
     */
    public async createTransaction(options: PaymentOptions) {
        options.currency = options.currency || this.defaultCurrency;
        return await this.gateway().createTransaction(options);
    }

    /**
     * Process a direct charge
     */
    public async charge(options: PaymentOptions) {
        options.currency = options.currency || this.defaultCurrency;
        return await this.gateway().charge(options);
    }

    /**
     * Verify payment notification (Webhook)
     */
    public async verifyNotification(payload: any) {
        return await this.gateway().verifyNotification(payload);
    }
}

export const Payment = new PaymentManager();
