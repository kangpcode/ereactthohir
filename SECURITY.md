# Security Policy

## Supported Versions

Currently, the following versions of EreactThohir are supported with security updates:

| Version | Supported          |
| ------- | ------------------ |
| 1.5.x   | :white_check_mark: |
| 1.4.x   | :x:                |
| < 1.4   | :x:                |

## Reporting a Vulnerability

We take the security of EreactThohir seriously. If you discover a security vulnerability within the framework, please send an e-mail to **dhafanazula@protonmail.com** (or your preferred contact). All security vulnerabilities will be promptly addressed.

Please include the following information in your report:

- Type of issue (e.g., XSS, SQLi, Remote Code Execution)
- A detailed description of the vulnerability
- Steps to reproduce the issue
- Potential impact

We will acknowledge receipt of your report within 48 hours and provide a timeline for a fix.

## Security Guarantees

EreactThohir includes built-in security features such as:

- **CSRF Protection**: Automatic token validation for all state-changing requests.
- **XSS Prevention**: Input sanitization and secure output encoding.
- **SQL Injection Protection**: Advanced Query Builder with prepared statements.
- **Encryption Service**: AES-256-CBC encryption for sensitive data.
- **Rate Limiting**: Protection against brute-force and DoS attacks.

Thank you for helping keep EreactThohir secure!
