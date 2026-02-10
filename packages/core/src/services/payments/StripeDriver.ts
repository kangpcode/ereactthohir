import { PaymentGateway, PaymentOptions } from '../Payment';

export class StripeDriver implements PaymentGateway {
    private secretKey: string;

    constructor(config: { secretKey: string }) {
        this.secretKey = config.secretKey;
    }

    async createTransaction(options: PaymentOptions): Promise<any> {
        console.log(`[Stripe] Creating Checkout Session for Order: ${options.orderId}`);
        return {
            url: `https://checkout.stripe.com/pay/${options.orderId}`,
            id: 'cs_test_123'
        };
    }

    async charge(options: PaymentOptions): Promise<any> {
        console.log(`[Stripe] Charging ${options.amount} ${options.currency}`);
        return { status: 'succeeded' };
    }

    async refund(transactionId: string, amount?: number): Promise<any> {
        console.log(`[Stripe] Refunding ${transactionId}`);
        return { status: 'refunded' };
    }

    async verifyNotification(payload: any): Promise<any> {
        return payload;
    }
}
