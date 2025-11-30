export interface IAIService {
  generateEmbedding(text: string): Promise<number[]>;
  // We will add chat/completion methods here later
generateCompletion(prompt: string): Promise<string>;
}