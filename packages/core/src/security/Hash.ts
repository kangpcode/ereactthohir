import bcrypt from 'bcryptjs';

export class Hash {
    private static rounds: number = 10;

    /**
     * Hash the given value.
     */
    static async make(value: string): Promise<string> {
        return await bcrypt.hash(value, this.rounds);
    }

    /**
     * Check the given plain value against a hash.
     */
    static async check(value: string, hashedValue: string): Promise<boolean> {
        return await bcrypt.compare(value, hashedValue);
    }

    /**
     * Set the salt rounds.
     */
    static setRounds(rounds: number) {
        this.rounds = rounds;
    }
}
