# Core Architecture

EreactThohir follows a modular, provider-based architecture similar to Laravel but optimized for the Node.js / TypeScript environment.

## 1. Request Lifecycle

1.  **Entry Point**: Every request enters through `Application` and is handled by the `Kernel`.
2.  **Routing**: The `Router` matches the URL to a defined handler.
3.  **Middleware**: Requests pass through pipeline of middlewares (e.g., `SetLocale`, `CSRF`).
4.  **Controller**: The business logic is executed.
5.  **Response**: A standardized `ApiResponse` is returned.

## 2. Service Container

The `Container` is the heart of dependency injection. You can bind services and resolve them anywhere.

## 3. Service Providers

Service Providers are the central place for all application bootstrapping. All core services (AI, Payment, Database) are registered here.

## 4. Foundation Services

-   **Events**: Class-based events and listeners.
-   **Queue**: Background job processing.
-   **Scheduler**: Chron-like tasks logic.
-   **Lang**: Globalization and localization.
-   **Storage**: Filesystem abstraction (Local, S3).
-   **Mail**: Email sending with drivers.
