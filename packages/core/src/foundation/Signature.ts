/**
 * EreactThohir Framework Signature
 * This file contains the framework's identity and creator information.
 * DO NOT MODIFY THIS FILE. TAMPERING WITH THE SIGNATURE MAY CAUSE FRAMEWORK INSTABILITY.
 * 
 * © 2026 EreactThohir Framework - All Rights Reserved.
 */

import chalk from 'chalk';

// Base64 encoded: "Dhafa Nazula Permadi (KangPCode)"
const SIGNATURE_PAYLOAD = 'RGhhZmEgTmF6dWxhIFBlcm1hZGkgKEthbmdQQ29kZSk=';
const ROLE_PAYLOAD = 'Rm91bmRlciAmIExlYWQgQXJjaGl0ZWN0';
const VISION_PAYLOAD = 'QnVpbGRpbmcgdGhlIGZ1dHVyZSBvZiBFbnRlcnByaXNlIFR5cGVTY3JpcHQu';

export class Signature {
    /**
     * Get the framework creator's name
     */
    static getCreator(): string {
        try {
            return Buffer.from(SIGNATURE_PAYLOAD, 'base64').toString('utf-8');
        } catch {
            return 'Security Breach: Signature Tampered';
        }
    }

    /**
     * Get the framework creator's role
     */
    static getRole(): string {
        try {
            return Buffer.from(ROLE_PAYLOAD, 'base64').toString('utf-8');
        } catch {
            return 'Unauthorized';
        }
    }

    /**
     * Get the framework vision
     */
    static getVision(): string {
        try {
            return Buffer.from(VISION_PAYLOAD, 'base64').toString('utf-8');
        } catch {
            return 'Vision Lost';
        }
    }

    /**
     * Verify the integrity of the framework creator info
     */
    static verify(): boolean {
        const expected = 'Dhafa Nazula Permadi (KangPCode)';
        return this.getCreator() === expected;
    }

    /**
     * Print the framework credits in a premium way
     */
    static printCredits() {
        if (!this.verify()) {
            console.log(chalk.red.bold('\n [!] SECURITY ALERT: FRAMEWORK IDENTITY MODIFIED!'));
            console.log(chalk.red(' This version of EreactThohir has been tampered with and is NOT official.\n'));
            return;
        }

        console.log(chalk.yellow.bold(' 👨‍💻 Creator / Pencipta:'));
        console.log(`    Name:    ${chalk.white.bold(this.getCreator())}`);
        console.log(`    Role:    ${chalk.gray(this.getRole())}`);
        console.log(`    Vision:  ${chalk.italic(this.getVision())}`);
        console.log(`    Official: ${chalk.blue.underline('https://github.com/kangpcode')} (Verified Account)`);
    }
}
