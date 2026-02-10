export class Gate {
    private abilities: Map<string, Function> = new Map();
    private policies: Map<string, any> = new Map();

    public define(ability: string, callback: (user: any, ...args: any[]) => boolean) {
        this.abilities.set(ability, callback);
    }

    public policy(modelClass: any, policyClass: any) {
        this.policies.set(modelClass.name, new policyClass());
    }

    public allows(user: any, ability: string, ...args: any[]): boolean {
        const abilityCallback = this.abilities.get(ability);
        if (abilityCallback) {
            return abilityCallback(user, ...args);
        }

        // Check policies
        if (args.length > 0 && args[0] && args[0].constructor) {
            const modelName = args[0].constructor.name;
            const policy = this.policies.get(modelName);
            if (policy && typeof policy[ability] === 'function') {
                return policy[ability](user, ...args);
            }
        }

        return false;
    }

    public denies(user: any, ability: string, ...args: any[]): boolean {
        return !this.allows(user, ability, ...args);
    }
}

export const GateManager = new Gate();
