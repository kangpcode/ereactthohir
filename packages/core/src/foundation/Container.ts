export interface BindingResolver {
    (container: Container): any;
}

export class Container {
    protected bindings: Map<string, { concrete: any, singleton: boolean }> = new Map();
    protected instances: Map<string, any> = new Map();
    protected resolvers: Map<string, BindingResolver> = new Map();
    protected aliases: Map<string, string> = new Map();
    protected tags: Map<string, string[]> = new Map();

    public bind(abstract: string, concrete: any, singleton: boolean = false) {
        this.bindings.set(abstract, { concrete, singleton });
        return this;
    }

    public singleton(abstract: string, concrete: any) {
        this.bind(abstract, concrete, true);
        return this;
    }

    public instance(abstract: string, instance: any) {
        this.instances.set(abstract, instance);
        return this;
    }

    public resolve(abstract: string, resolver: BindingResolver) {
        this.resolvers.set(abstract, resolver);
        return this;
    }

    public alias(alias: string, abstract: string) {
        this.aliases.set(alias, abstract);
        return this;
    }

    public tag(tags: string[], bindings: string[]) {
        bindings.forEach(binding => {
            if (!this.tags.has(binding)) {
                this.tags.set(binding, []);
            }
            this.tags.get(binding)!.push(...tags);
        });
        return this;
    }

    public tagged(tag: string): any[] {
        const results: any[] = [];
        this.tags.forEach((bindingTags, binding) => {
            if (bindingTags.includes(tag)) {
                results.push(this.make(binding));
            }
        });
        return results;
    }

    public make<T = any>(abstract: string): T {
        // Handle aliases
        const realAbstract = this.aliases.get(abstract) || abstract;

        if (this.instances.has(realAbstract)) {
            return this.instances.get(realAbstract);
        }

        if (this.resolvers.has(realAbstract)) {
            const instance = this.resolvers.get(realAbstract)!(this);
            this.instances.set(realAbstract, instance);
            return instance;
        }

        const binding = this.bindings.get(realAbstract);

        if (!binding) {
            throw new Error(`Target [${abstract}] is not bound in the container.`);
        }

        let instance: any;

        if (typeof binding.concrete === 'function' && !binding.concrete.prototype) {
            // It's a closure
            instance = binding.concrete(this);
        } else if (typeof binding.concrete === 'function') {
            // It's a class
            instance = new binding.concrete();
        } else {
            // It's a value
            instance = binding.concrete;
        }

        if (binding.singleton) {
            this.instances.set(realAbstract, instance);
        }

        return instance;
    }

    public has(abstract: string): boolean {
        return (
            this.bindings.has(abstract) ||
            this.instances.has(abstract) ||
            this.resolvers.has(abstract) ||
            this.aliases.has(abstract)
        );
    }

    public bound(abstract: string): boolean {
        return this.has(abstract);
    }
}
