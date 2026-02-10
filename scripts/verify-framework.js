"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Ai_1 = require("../packages/core/src/services/Ai");
const GeminiDriver_1 = require("../packages/core/src/services/ai/GeminiDriver");
const Payment_1 = require("../packages/core/src/services/Payment");
const MidtransDriver_1 = require("../packages/core/src/services/payments/MidtransDriver");
const Health_1 = require("../packages/core/src/foundation/Health");
async function verify() {
    console.log('--- EreactThohir Framework Verification ---');
    // 1. Verify AI
    Ai_1.AI.extend('gemini', new GeminiDriver_1.GeminiDriver({ apiKey: 'mock-key' }));
    const aiResponse = await Ai_1.AI.driver('gemini').generate('Hello Ereact!');
    console.log('AI Verify:', aiResponse.text);
    // 2. Verify Payment
    Payment_1.Payment.extend('midtrans', new MidtransDriver_1.MidtransDriver({ serverKey: 'mock-key', isProduction: false }));
    const transaction = await Payment_1.Payment.createTransaction({
        orderId: 'VERIFY-001',
        amount: 250000
    });
    console.log('Payment Verify:', transaction.redirect_url);
    // 3. Verify Health
    Health_1.HealthCheck.check('database', async () => ({ status: 'ok', message: 'Database connected' }));
    const health = await Health_1.HealthCheck.run();
    console.log('Health Verify:', health.status);
    console.log('--- Verification Complete: System is Powerful! ---');
}
verify().catch(console.error);
//# sourceMappingURL=verify-framework.js.map