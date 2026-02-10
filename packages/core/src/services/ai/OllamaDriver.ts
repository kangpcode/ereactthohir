import { AiDriver, AiResponse } from '../Ai';

export class OllamaDriver implements AiDriver {
    private baseUrl: string;
    private model: string;

    constructor(config: { baseUrl?: string, model?: string }) {
        this.baseUrl = config.baseUrl || 'http://localhost:11434';
        this.model = config.model || 'llama3';
    }

    async generate(prompt: string, options?: any): Promise<AiResponse> {
        console.log(`[Ollama] Generating text with model: ${this.model} at ${this.baseUrl}`);
        // In real world, this centers on calling fetch(this.baseUrl + '/api/generate')
        return {
            text: `Local response from Ollama (${this.model}) for: ${prompt.substring(0, 20)}...`,
            raw: {}
        };
    }

    async stream(prompt: string, callback: (chunk: string) => void, options?: any): Promise<void> {
        callback('Streaming response from Local Ollama...');
    }
}
