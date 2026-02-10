# Changelog

All notable changes to the **EreactThohir** project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.5.0] - 2026-02-10

### Added
- **Enterprise CRUD Generator**: Added `make:crud` to generate Model, Migration, Controller, Factory, and React Page in one command.
- **AI Ecosystem Extension**: Added `make:ai-driver` for creating custom AI provider implementations.
- **Unified Payment Providers**: Added `make:payment-provider` to easily integrate new payment gateways.
- **Auth Template Refactor**: Support for multiple UI frameworks (Material UI, Bootstrap 5, and Rice UI) during project creation.
- **Advanced Resource Management**: Improved `make:resource` with better transformation logic.

## [1.4.0] - 2026-02-10

### Added
- **Core AI Module**: Unified interface for OpenAI, Google Gemini, and Ollama.
- **Payment Gateway Ecosystem**: Multi-driver support for Midtrans (Primary), Duitku, Durianpay, and Stripe.
- **REST API Enhancements**: Professional standardized response patterns with pagination metadata.
- **Security Upgrades**: AES-256-CBC encryption and Bcrypt password hashing.
- **Database Schema & Blueprint**: Laravel-style migration syntax for table creation.
- **Rice UI Components**: Added `DashboardLayout`, `MetricCard`, `Sidebar`, `Navbar`, and `ChatBox`.
- **System Health Checks**: Real-time monitoring for database, storage, and external services.
- **Auto API Documentation**: Added `toOpenApi()` generator in the Router.
- **Backup Service**: Automated system and data backup capabilities.
- **CLI Generators**: Added `make:event`, `make:listener`, `make:mail`, and `make:command`.
- **Localization**: Middleware based `SetLocale` and `Lang` service.

### Changed
- Standardized API error reporting to use `422` for validation errors.
- Enhanced `Controller` with helper methods (`success`, `error`, `validate`).
- Improved `Logger` with colored output and better log levels.
- Updated `QueryBuilder` for better fluent interface support.

### Fixed
- Fixed case-sensitivity issues in module imports.
- Corrected relative paths in core services.

## [1.3.1] - 2026-02-07

### Added
- Enhanced Debug Mode UI with premium error overlays.
- Improved Exception stack trace rendering.

## [1.2.0] - 2026-02-01

### Added
- Initial implementation of Mail and Storage services.
- Basic CLI generators for Controllers and Models.
- Core HTTP Kernel and Routing.
