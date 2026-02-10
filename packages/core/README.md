# @ereactthohir/core 🏛️

The core foundation of the **EreactThohir** framework.

## 🚀 Features

-   **High Performance Kernel**: Efficient request/response handling.
-   **Advanced Routing**: Express-like routing with middleware support.
-   **Dependency Injection**: Modular service providers.
-   **Built-in Security**: Helmet, CORS, and CSRF support.
-   **Typed Core**: Fully written in TypeScript for the best DX.

## 📦 Installation

```bash
npm install @ereactthohir/core
```

## 🛠️ Usage

```ts
import { Kernel, Route } from '@ereactthohir/core';

Route.get('/', (req, res) => res.json({ hello: 'world' }));

const kernel = new Kernel();
kernel.handle();
kernel.listen(3000);
```

## 📄 License

Licensed under the [MIT License](../../LICENSE).
