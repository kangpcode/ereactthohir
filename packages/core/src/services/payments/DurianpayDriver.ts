import { PaymentGateway, PaymentOptions } from '../Payment';

export class DurianpayDriver implements PaymentGateway {
    private secretKey: string;

    constructor(config: { secretKey: string }) {
        this.secretKey = config.secretKey;
    }

    async createTransaction(options: PaymentOptions): Promise<any> {
        console.log(`[Durianpay] Creating checkout for Order: ${options.orderId}`);
        return {
            checkout_url: `https://checkout.durianpay.id/order/${options.orderId}`
        };
    }

    async charge(options: PaymentOptions): Promise<any> {
        return { status: 'success' };
    }

    async refund(transactionId: string, amount?: number): Promise<any> {
        return { status: 'refunded' };
    }

    async verifyNotification(payload: any): Promise<any> {
        return payload;
    }
}
