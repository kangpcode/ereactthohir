# @ereactthohir/cli 🛡️

The official Command Line Interface for the **EreactThohir** framework.

## 🚀 Features

-   **Development Server**: `ereact dev` starts your app instantly.
-   **Security**: `ereact key:generate` secures your application.
-   **Scaffolding**: Rapidly generate controllers, models, migrations, and more.
-   **Database**: Built-in migration and seeding management.
-   **Debugging**: `ereact route:list` to visualize your application's entry points.

## 📦 Installation

```bash
npm install -g @ereactthohir/cli
```

## 🛠️ Usage

```bash
# Start development
ereact dev

# Database migrations
ereact migrate
ereact migrate:rollback

# Scaffolding
ereact make:controller UserController
ereact make:model User
ereact make:migration create_users_table

# Security
ereact key:generate
```

## 📄 License

Licensed under the [MIT License](../../LICENSE).
