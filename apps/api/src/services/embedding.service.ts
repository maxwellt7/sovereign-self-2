import { openai, EMBEDDING_MODEL } from '../config/openai.js';
import { getPineconeClient, PINECONE_INDEXES, EMBEDDING_DIMENSION } from '../config/pinecone.js';

export interface EmbeddingMetadata {
  userId: string;
  entityId: string;
  entityType: 'journal' | 'knowledge';
  title?: string;
  tags: string[];
  createdAt: string;
}

export class EmbeddingService {
  private pinecone = getPineconeClient();

  /**
   * Generate embedding for text content
   */
  async generateEmbedding(text: string): Promise<number[]> {
    const dimensions = parseInt(process.env.EMBEDDING_DIMENSION || '1024', 10);
    
    const response = await openai.embeddings.create({
      model: EMBEDDING_MODEL,
      input: text,
      encoding_format: 'float',
      dimensions, // OpenAI text-embedding-3-small supports 512, 1024, or 1536
    });

    return response.data[0].embedding;
  }

  /**
   * Extract text from Tiptap JSON content
   */
  extractTextFromContent(content: any): string {
    if (!content || typeof content !== 'object') {
      return '';
    }

    let text = '';

    const traverse = (node: any) => {
      if (node.type === 'text') {
        text += node.text + ' ';
      }

      if (node.content && Array.isArray(node.content)) {
        node.content.forEach(traverse);
      }
    };

    traverse(content);

    return text.trim();
  }

  /**
   * Store journal entry embedding in Pinecone
   */
  async storeJournalEmbedding(
    userId: string,
    entryId: string,
    content: any,
    metadata: Omit<EmbeddingMetadata, 'entityId' | 'entityType'>
  ): Promise<void> {
    const text = this.extractTextFromContent(content);

    if (!text) {
      console.warn(`No text extracted from journal entry ${entryId}`);
      return;
    }

    const embedding = await this.generateEmbedding(text);
    const index = this.pinecone.Index(PINECONE_INDEXES.JOURNAL);

    await index.upsert([
      {
        id: entryId,
        values: embedding,
        metadata: {
          ...metadata,
          userId,
          entityId: entryId,
          entityType: 'journal',
        },
      },
    ]);
  }

  /**
   * Store knowledge base item embedding in Pinecone
   */
  async storeKnowledgeEmbedding(
    userId: string,
    itemId: string,
    content: any,
    metadata: Omit<EmbeddingMetadata, 'entityId' | 'entityType'>
  ): Promise<void> {
    const text = this.extractTextFromContent(content);

    if (!text) {
      console.warn(`No text extracted from knowledge item ${itemId}`);
      return;
    }

    const embedding = await this.generateEmbedding(text);
    const index = this.pinecone.Index(PINECONE_INDEXES.KNOWLEDGE);

    await index.upsert([
      {
        id: itemId,
        values: embedding,
        metadata: {
          ...metadata,
          userId,
          entityId: itemId,
          entityType: 'knowledge',
        },
      },
    ]);
  }

  /**
   * Search journal entries by semantic similarity
   */
  async searchJournalEntries(
    userId: string,
    query: string,
    topK: number = 10
  ): Promise<Array<{ id: string; score: number; metadata: any }>> {
    const queryEmbedding = await this.generateEmbedding(query);
    const index = this.pinecone.Index(PINECONE_INDEXES.JOURNAL);

    const results = await index.query({
      vector: queryEmbedding,
      topK,
      filter: { userId: { $eq: userId } },
      includeMetadata: true,
    });

    return results.matches.map((match) => ({
      id: match.id,
      score: match.score || 0,
      metadata: match.metadata,
    }));
  }

  /**
   * Search knowledge base items by semantic similarity
   */
  async searchKnowledgeItems(
    userId: string,
    query: string,
    topK: number = 10
  ): Promise<Array<{ id: string; score: number; metadata: any }>> {
    const queryEmbedding = await this.generateEmbedding(query);
    const index = this.pinecone.Index(PINECONE_INDEXES.KNOWLEDGE);

    const results = await index.query({
      vector: queryEmbedding,
      topK,
      filter: { userId: { $eq: userId } },
      includeMetadata: true,
    });

    return results.matches.map((match) => ({
      id: match.id,
      score: match.score || 0,
      metadata: match.metadata,
    }));
  }

  /**
   * Delete journal entry embedding
   */
  async deleteJournalEmbedding(entryId: string): Promise<void> {
    const index = this.pinecone.Index(PINECONE_INDEXES.JOURNAL);
    await index.deleteOne(entryId);
  }

  /**
   * Delete knowledge item embedding
   */
  async deleteKnowledgeEmbedding(itemId: string): Promise<void> {
    const index = this.pinecone.Index(PINECONE_INDEXES.KNOWLEDGE);
    await index.deleteOne(itemId);
  }
}

export const embeddingService = new EmbeddingService();

