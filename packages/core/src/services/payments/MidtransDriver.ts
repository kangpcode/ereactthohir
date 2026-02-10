import { PaymentGateway, PaymentOptions } from '../Payment';

export class MidtransDriver implements PaymentGateway {
    private isProduction: boolean;
    private serverKey: string;

    constructor(config: { serverKey: string, isProduction: boolean }) {
        this.serverKey = config.serverKey;
        this.isProduction = config.isProduction;
    }

    async createTransaction(options: PaymentOptions): Promise<any> {
        console.log(`[Midtrans] Creating Snap transaction for Order: ${options.orderId}`);
        // Implementation would use midtrans-client or fetch
        return {
            token: 'snap-token-example',
            redirect_url: `https://app.sandbox.midtrans.com/snap/v2/vtweb/${options.orderId}`
        };
    }

    async charge(options: PaymentOptions): Promise<any> {
        console.log(`[Midtrans] Charging Order: ${options.orderId} via API`);
        return { status: 'pending', id: options.orderId };
    }

    async refund(transactionId: string, amount?: number): Promise<any> {
        console.log(`[Midtrans] Refunding Transaction: ${transactionId}`);
        return { status: 'refunded' };
    }

    async verifyNotification(payload: any): Promise<any> {
        console.log(`[Midtrans] Verifying Notification for: ${payload.order_id}`);
        return payload;
    }
}
