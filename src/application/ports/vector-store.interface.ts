export interface VectorSearchResult {
  propertyId: string;
  score: number;
  content: string; // The text chunk we saved earlier
}

export interface IVectorStore {
  savePropertyVector(propertyId: string, vector: number[], content: string): Promise<void>;
  
  // New method:
  search(queryVector: number[], limit: number): Promise<VectorSearchResult[]>;
}