# Database & Migrations

EreactThohir provides a powerful database layer with a fluent Query Builder, an Eloquent-like Model system, and a robust Migration engine.

## 1. Migrations & Schema

Building tables is easy with the `Schema` blueprint:

```typescript
import { Schema, Blueprint } from '@ereactthohir/core';

export default class CreateUsersTable {
    async up() {
        await Schema.create('users', (table: Blueprint) => {
            table.increments('id');
            table.string('name');
            table.string('email').unique();
            table.string('password');
            table.timestamps();
        });
    }

    async down() {
        await Schema.dropIfExists('users');
    }
}
```

## 1.1 CRUD Suite Generator
For rapid development, you can generate a full CRUD suite (Model, Migration, Controller, Factory, and Page) with a single command:

```bash
ereact make:crud Product
```

## 2. Models

Models provide a clean way to interact with your data.

```typescript
import { Model } from '@ereactthohir/core';

export default class User extends Model {
    static table = 'users';

    protected fillable = ['name', 'email', 'password'];
    protected hidden = ['password'];
}
```

## 3. Query Builder

Fluent SQL construction:

```typescript
const users = await Route.query()
    .where('active', true)
    .orderBy('created_at', 'desc')
    .paginate(15);
```
