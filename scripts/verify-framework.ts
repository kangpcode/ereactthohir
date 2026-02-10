import { AI } from '../packages/core/src/services/Ai';
import { GeminiDriver } from '../packages/core/src/services/ai/GeminiDriver';
import { Payment } from '../packages/core/src/services/Payment';
import { MidtransDriver } from '../packages/core/src/services/payments/MidtransDriver';
import { HealthCheck } from '../packages/core/src/foundation/Health';

async function verify() {
    console.log('--- EreactThohir Framework Verification ---');

    // 1. Verify AI
    AI.extend('gemini', new GeminiDriver({ apiKey: 'mock-key' }));
    const aiResponse = await AI.driver('gemini').generate('Hello Ereact!');
    console.log('AI Verify:', aiResponse.text);

    // 2. Verify Payment
    Payment.extend('midtrans', new MidtransDriver({ serverKey: 'mock-key', isProduction: false }));
    const transaction = await Payment.createTransaction({
        orderId: 'VERIFY-001',
        amount: 250000
    });
    console.log('Payment Verify:', transaction.redirect_url);

    // 3. Verify Health
    HealthCheck.check('database', async () => ({ status: 'ok', message: 'Database connected' }));
    const health = await HealthCheck.run();
    console.log('Health Verify:', health.status);

    console.log('--- Verification Complete: System is Powerful! ---');
}

verify().catch(console.error);
