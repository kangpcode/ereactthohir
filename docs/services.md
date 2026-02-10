# Enterprise Services (AI & Payments)

EreactThohir v1.5.0 introduces powerful abstractions and extensibility for modern application needs.

## 🤖 AI Integration

The `AI` manager allows you to use multiple providers with the same API.

### Available Drivers:
- `OpenAiDriver`: GPT-4o, GPT-3.5
- `GeminiDriver`: Gemini 1.5 Pro/Flash
- `OllamaDriver`: Local AI (Llama 3, Mistral, etc.)

### Usage:
```typescript
import { AI } from '@ereactthohir/core';

// Set default or use specific driver
const reply = await AI.driver('gemini').generate('How to build a SaaS?');
```

### Extending AI
You can create custom AI drivers using the CLI:
```bash
ereact make:ai-driver MyCustomAI
```

## 💳 Payment Gateways

The `Payment` module simplifies complex payment flows, especially for Indonesia.

### Supported Gateways:
- **Midtrans**: Built-in Snap and API support.
- **Duitku**: Indonesian popular gateway.
- **Durianpay**: Fast integration.
- **Stripe**: International standard.

### Usage:
```typescript
import { Payment } from '@ereactthohir/core';

const transaction = await Payment.createTransaction({
    orderId: 'INV-001',
    amount: 50000, // Automaticaly IDR if using Midtrans
    customer: { name: 'User', email: 'user@example.com' }
});

return res.json({ url: transaction.redirect_url });
```

### New Payment Providers
Add custom payment gateways easily:
```bash
ereact make:payment-provider MyGateway
```

## 🏥 Health Checks

Monitor system vitals:

```typescript
import { HealthCheck } from '@ereactthohir/core';

const status = await HealthCheck.run();
// Returns { status: 'ok', details: { ... } }
```
