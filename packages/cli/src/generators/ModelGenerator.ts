/**
 * Model Generator - Auto-generate model classes with relationships
 */

export function generateModel(name: string, attributes: string[] = [], relations: string[] = []): string {
  const className = name.charAt(0).toUpperCase() + name.slice(1);
  const tableName = name.toLowerCase() + 's';

  const attributeProperties = attributes
    .map((attr) => `  ${attr}: any;`)
    .join('\n');

  const relationMethods = relations
    .map((rel) => {
      const relClass = rel.charAt(0).toUpperCase() + rel.slice(1);
      return `
  ${rel}() {
    return this.hasOne(${relClass});
  }`;
    })
    .join('\n');

  return `import { Model } from '@ereactthohir/core';

export class ${className} extends Model {
  protected table = '${tableName}';
  protected fillable = [${attributes.map((a) => `'${a}'`).join(', ')}];
  
${attributeProperties}
${relationMethods}
}
`;
}

/**
 * Controller Generator - Auto-generate CRUD controllers
 */

export function generateController(name: string, modelName: string): string {
  const className = name.includes('Controller') ? name : name + 'Controller';
  const modelClass = modelName.charAt(0).toUpperCase() + modelName.slice(1);

  return `import { Controller, Request, Response } from '@ereactthohir/core';
import { ${modelClass} } from '../models/${modelClass}';

export class ${className} extends Controller {
  async index(req: Request, res: Response) {
    const ${modelName}s = await ${modelClass}.paginate();
    return res.json(${modelName}s);
  }

  async store(req: Request, res: Response) {
    const ${modelName} = await ${modelClass}.create(req.all());
    return res.json(${modelName}, 201);
  }

  async show(req: Request, res: Response) {
    const ${modelName} = await ${modelClass}.find(req.param('id'));
    if (!${modelName}) return res.status(404).json({ message: 'Not found' });
    return res.json(${modelName});
  }

  async update(req: Request, res: Response) {
    const ${modelName} = await ${modelClass}.find(req.param('id'));
    if (!${modelName}) return res.status(404).json({ message: 'Not found' });
    
    await ${modelName}.update(req.all());
    return res.json(${modelName});
  }

  async destroy(req: Request, res: Response) {
    const ${modelName} = await ${modelClass}.find(req.param('id'));
    if (!${modelName}) return res.status(404).json({ message: 'Not found' });
    
    await ${modelName}.delete();
    return res.json({ message: 'Deleted successfully' });
  }
}
`;
}

/**
 * Migration Generator - Auto-generate database migrations
 */

export function generateMigration(name: string, fields: Record<string, string>): string {
  const timestamp = Date.now();
  const migrationName = `${timestamp}_create_${name}_table`;

  const fieldDefinitions = Object.entries(fields)
    .map(([fieldName, fieldType]) => `      .${fieldType}('${fieldName}')`)
    .join('\n');

  return `import { Migration } from '@ereactthohir/core';

export class Create${name.charAt(0).toUpperCase() + name.slice(1)}Table implements Migration {
  async up(): Promise<void> {
    // Create table schema
    console.log('Creating ${name} table...');
    // Implementation using query builder
  }

  async down(): Promise<void> {
    // Drop table
    console.log('Dropping ${name} table...');
  }
}
`;
}

/**
 * Service Generator - Generate business logic services
 */

export function generateService(name: string): string {
  const className = name.includes('Service') ? name : name + 'Service';

  return `import { Service } from '@ereactthohir/core';

export class ${className} extends Service {
  /**
   * Initialize service
   */
  async init(): Promise<void> {
    // Setup service
  }

  /**
   * Perform main service logic
   */
  async execute(): Promise<any> {
    // Implement business logic
  }

  /**
   * Cleanup service
   */
  async cleanup(): Promise<void> {
    // Cleanup resources
  }
}
`;
}

export const generators = {
  generateModel,
  generateController,
  generateMigration,
  generateService,
};
