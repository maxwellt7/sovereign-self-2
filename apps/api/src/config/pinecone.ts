import { Pinecone } from '@pinecone-database/pinecone';

let pineconeClient: Pinecone | null = null;

export const getPineconeClient = (): Pinecone => {
  if (!pineconeClient) {
    if (!process.env.PINECONE_API_KEY) {
      throw new Error('PINECONE_API_KEY is not set');
    }

    pineconeClient = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY,
    });
  }

  return pineconeClient;
};

export const PINECONE_INDEXES = {
  JOURNAL: process.env.PINECONE_INDEX_JOURNAL || 'journal-embeddings',
  KNOWLEDGE: process.env.PINECONE_INDEX_KNOWLEDGE || 'knowledge-embeddings',
} as const;

// OpenAI text-embedding-3-small supports: 512, 1024, 1536 (default)
// Use 1024 as it's a common Pinecone preset
export const EMBEDDING_DIMENSION = parseInt(process.env.EMBEDDING_DIMENSION || '1024', 10);

export default getPineconeClient;

