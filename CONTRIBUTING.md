# Contributing to EreactThohir 🤝

First off, thank you for considering contributing to EreactThohir! It's people like you who make it a great tool for everyone.

## 🌈 How Can I Contribute?

### Reporting Bugs
-   Use the GitHub issue tracker.
-   Provide a clear and concise description.
-   Include steps to reproduce the issue.

### Suggesting Enhancements
-   Open an issue with the "feature request" tag.
-   Explain why the feature would be useful.

### Pull Requests
1. Fork the repo and create your branch from `main`.
2. If you've added code that should be tested, add tests.
3. If you've changed APIs, update the documentation.
4. Ensure the test suite passes (`npm test`).
5. Make sure your code lints (`npm run lint`).

## 🛠️ Development Setup

```bash
# Clone the repo
git clone https://github.com/KangPCode/EreactThohir.git

# Install dependencies
npm install

# Build all packages
npm run build

# Run tests
npm test
```

## 🏢 Project Structure

EreactThohir is a **monorepo** managed with NPM Workspaces:
- `packages/core`: The heart of the framework (Services, Http, Database).
- `packages/cli`: The command-line interface tools.
- `packages/rice-ui`: Premium React component library.

## 🎨 Code Style

- Use **TypeScript** for everything.
- Follow **PascalCase** for Classes/Components and **camelCase** for methods/variables.
- Document public APIs using JSDoc/TSDoc.
- Keep components focused and reusable.

## 📜 Code of Conduct

We expect all contributors to be respectful, professional, and inclusive in all interactions.

## 📄 License

By contributing to EreactThohir, you agree that your contributions will be licensed under its [GNU GPL v3 License](LICENSE).
