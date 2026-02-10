/**
 * Advanced Database Migrations System
 */

export interface Migration {
  up(): Promise<void>;
  down(): Promise<void>;
}

export class MigrationRunner {
  private migrations: Map<string, Migration> = new Map();
  private executed: Set<string> = new Set();

  register(name: string, migration: Migration): this {
    this.migrations.set(name, migration);
    return this;
  }

  async run(name: string): Promise<void> {
    if (this.executed.has(name)) {
      console.log(`Migration "${name}" already executed`);
      return;
    }

    const migration = this.migrations.get(name);
    if (!migration) {
      throw new Error(`Migration "${name}" not found`);
    }

    console.log(`Running migration: ${name}`);
    await migration.up();
    this.executed.add(name);
    console.log(`Migration "${name}" completed`);
  }

  async runAll(): Promise<void> {
    for (const [name] of this.migrations) {
      if (!this.executed.has(name)) {
        await this.run(name);
      }
    }
  }

  async rollback(name: string): Promise<void> {
    const migration = this.migrations.get(name);
    if (!migration) {
      throw new Error(`Migration "${name}" not found`);
    }

    console.log(`Rolling back migration: ${name}`);
    await migration.down();
    this.executed.delete(name);
    console.log(`Rollback of "${name}" completed`);
  }

  async rollbackAll(): Promise<void> {
    const executedArray = Array.from(this.executed).reverse();
    for (const name of executedArray) {
      await this.rollback(name);
    }
  }

  status(): { executed: string[]; pending: string[] } {
    const executed = Array.from(this.executed);
    const pending = Array.from(this.migrations.keys()).filter(name => !this.executed.has(name));
    return { executed, pending };
  }
}
