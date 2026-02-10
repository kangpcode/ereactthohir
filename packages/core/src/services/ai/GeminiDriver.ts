import { AiDriver, AiResponse } from '../Ai';

export class GeminiDriver implements AiDriver {
    private apiKey: string;
    private model: string;

    constructor(config: { apiKey: string, model?: string }) {
        this.apiKey = config.apiKey;
        this.model = config.model || 'gemini-1.5-pro';
    }

    async generate(prompt: string, options?: any): Promise<AiResponse> {
        console.log(`[Gemini] Generating text with model: ${this.model}`);
        // Mocking Google Generative AI call
        return {
            text: `Response from Gemini for: ${prompt.substring(0, 20)}...`,
            usage: { promptTokens: 10, completionTokens: 20, totalTokens: 30 },
            raw: {}
        };
    }

    async stream(prompt: string, callback: (chunk: string) => void, options?: any): Promise<void> {
        callback('Streaming response from Gemini...');
    }
}
