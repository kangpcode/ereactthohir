---
description: How to publish the EreactThohir framework packages
---

This workflow guides you through publishing the `@ereactthohir` packages to npm.

### Prerequisites
- You must have an npm account.
- You must be logged in to npm with `npm login`.

### Steps

1. **Build the project**
   Ensure all packages are built and ready to be published.
   ```bash
   npm run build
   ```

2. **Login to npm**
   If you haven't already, or if your session has expired:
   ```bash
   npm login
   ```

3. **Publish packages**
   You can now publish all packages at once using the new script:
   
   // turbo
   ```bash
   npm run publish-all
   ```
   
   Alternatively, you can manually publish each package:
   - **Core Package**: `cd packages/core && npm publish --access public`
   - **CLI Package**: `cd packages/cli && npm publish --access public`
   - **Rice UI Package**: `cd packages/rice-ui && npm publish --access public`

### Troubleshooting
- **Version Conflict**: If you get a "version already exists" error, increment the `version` field in the package's `package.json`.
- **Authorization**: If you get "403 Forbidden", ensure you have permission to publish to the `@ereactthohir` scope.
