export interface AiResponse {
    text: string;
    usage?: {
        promptTokens: number;
        completionTokens: number;
        totalTokens: number;
    };
    raw: any;
}

export interface AiDriver {
    generate(prompt: string, options?: any): Promise<AiResponse>;
    stream(prompt: string, callback: (chunk: string) => void, options?: any): Promise<void>;
}

export class AiManager {
    private drivers: Map<string, AiDriver> = new Map();
    private defaultDriver: string = 'openai';

    public extend(name: string, driver: AiDriver) {
        this.drivers.set(name, driver);
    }

    public driver(name?: string): AiDriver {
        const driverName = name || this.defaultDriver;
        const driver = this.drivers.get(driverName);
        if (!driver) throw new Error(`AI driver [${driverName}] not found.`);
        return driver;
    }

    public async generate(prompt: string, options?: any) {
        return await this.driver().generate(prompt, options);
    }

    public async chat(messages: { role: string, content: string }[], options?: any) {
        // Simple chat implementation
        const prompt = messages.map(m => `${m.role}: ${m.content}`).join('\n');
        return await this.generate(prompt, options);
    }
}

export const AI = new AiManager();
