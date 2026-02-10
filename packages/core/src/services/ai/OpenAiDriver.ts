import { AiDriver, AiResponse } from '../Ai';

export class OpenAiDriver implements AiDriver {
    private apiKey: string;
    private model: string;

    constructor(config: { apiKey: string, model?: string }) {
        this.apiKey = config.apiKey;
        this.model = config.model || 'gpt-4o';
    }

    async generate(prompt: string, options?: any): Promise<AiResponse> {
        console.log(`[OpenAI] Generating text with model: ${this.model}`);
        return {
            text: `Response from OpenAI for: ${prompt.substring(0, 20)}...`,
            usage: { promptTokens: 15, completionTokens: 25, totalTokens: 40 },
            raw: {}
        };
    }

    async stream(prompt: string, callback: (chunk: string) => void, options?: any): Promise<void> {
        callback('Streaming response from OpenAI...');
    }
}
