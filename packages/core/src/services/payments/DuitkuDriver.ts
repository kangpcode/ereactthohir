import { PaymentGateway, PaymentOptions } from '../Payment';

export class DuitkuDriver implements PaymentGateway {
    private apiKey: string;
    private merchantCode: string;

    constructor(config: { apiKey: string, merchantCode: string }) {
        this.apiKey = config.apiKey;
        this.merchantCode = config.merchantCode;
    }

    async createTransaction(options: PaymentOptions): Promise<any> {
        console.log(`[Duitku] Creating transaction for Order: ${options.orderId}`);
        return {
            paymentUrl: `https://passport.duitku.com/web-checkout/payment?ref=${options.orderId}`,
            merchantReference: options.orderId
        };
    }

    async charge(options: PaymentOptions): Promise<any> {
        return { status: 'success' };
    }

    async refund(transactionId: string, amount?: number): Promise<any> {
        console.log(`[Duitku] Refund not fully supported in simple driver`);
        return { status: 'requested' };
    }

    async verifyNotification(payload: any): Promise<any> {
        return payload;
    }
}
