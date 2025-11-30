export interface IVectorStore {
  savePropertyVector(propertyId: string, vector: number[], content: string): Promise<void>;
  // We will add search methods here later
}