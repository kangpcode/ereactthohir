export class Validator {
    public static validate(data: any, rules: Record<string, string>): { isValid: boolean, errors: Record<string, string[]> } {
        const errors: Record<string, string[]> = {};
        let isValid = true;

        for (const [field, ruleString] of Object.entries(rules)) {
            const fieldRules = ruleString.split('|');
            const value = data[field];

            for (const rule of fieldRules) {
                if (rule === 'required' && (value === undefined || value === null || value === '')) {
                    this.addError(errors, field, `The ${field} field is required.`);
                    isValid = false;
                }

                if (rule === 'email' && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                    this.addError(errors, field, `The ${field} must be a valid email address.`);
                    isValid = false;
                }

                if (rule.startsWith('min:')) {
                    const min = parseInt(rule.split(':')[1]);
                    if (value && value.toString().length < min) {
                        this.addError(errors, field, `The ${field} must be at least ${min} characters.`);
                        isValid = false;
                    }
                }

                if (rule.startsWith('max:')) {
                    const max = parseInt(rule.split(':')[1]);
                    if (value && value.toString().length > max) {
                        this.addError(errors, field, `The ${field} may not be greater than ${max} characters.`);
                        isValid = false;
                    }
                }

                if (rule === 'numeric' && value && isNaN(Number(value))) {
                    this.addError(errors, field, `The ${field} must be a number.`);
                    isValid = false;
                }

                if (rule === 'boolean' && value !== undefined && typeof value !== 'boolean' && value !== 0 && value !== 1 && value !== '0' && value !== '1') {
                    this.addError(errors, field, `The ${field} field must be true or false.`);
                    isValid = false;
                }

                if (rule === 'confirmed' && value !== data[`${field}_confirmation`]) {
                    this.addError(errors, field, `The ${field} confirmation does not match.`);
                    isValid = false;
                }
            }
        }

        return { isValid, errors };
    }

    private static addError(errors: Record<string, string[]>, field: string, message: string) {
        if (!errors[field]) {
            errors[field] = [];
        }
        errors[field].push(message);
    }
}
