import { Queue, Worker } from 'bullmq';
import redis from '../config/redis.js';
import { embeddingService } from './embedding.service.js';
import prisma from '../config/database.js';

// Define job types
interface EmbeddingJob {
  type: 'journal' | 'knowledge';
  userId: string;
  entityId: string;
}

// Create queue
export const embeddingQueue = new Queue<EmbeddingJob>('embeddings', {
  connection: redis,
});

// Create worker to process jobs
const embeddingWorker = new Worker<EmbeddingJob>(
  'embeddings',
  async (job) => {
    const { type, userId, entityId } = job.data;

    try {
      if (type === 'journal') {
        // Fetch journal entry
        const entry = await prisma.journalEntry.findUnique({
          where: { id: entityId },
        });

        if (!entry) {
          throw new Error(`Journal entry ${entityId} not found`);
        }

        // Generate and store embedding
        await embeddingService.storeJournalEmbedding(userId, entityId, entry.content, {
          userId,
          title: entry.title || undefined,
          tags: entry.tags,
          createdAt: entry.createdAt.toISOString(),
        });

        // Mark as synced
        await prisma.journalEntry.update({
          where: { id: entityId },
          data: { embeddingSynced: true },
        });

        console.log(`✅ Synced journal entry ${entityId} to Pinecone`);
      } else if (type === 'knowledge') {
        // Fetch knowledge item
        const item = await prisma.knowledgeBaseItem.findUnique({
          where: { id: entityId },
        });

        if (!item) {
          throw new Error(`Knowledge item ${entityId} not found`);
        }

        // Generate and store embedding
        await embeddingService.storeKnowledgeEmbedding(userId, entityId, item.content, {
          userId,
          title: item.title,
          tags: item.tags,
          createdAt: item.createdAt.toISOString(),
        });

        // Mark as synced
        await prisma.knowledgeBaseItem.update({
          where: { id: entityId },
          data: { embeddingSynced: true },
        });

        console.log(`✅ Synced knowledge item ${entityId} to Pinecone`);
      }
    } catch (error) {
      console.error(`❌ Failed to process embedding job:`, error);
      throw error; // Will trigger retry
    }
  },
  {
    connection: redis,
    concurrency: 5,
  }
);

embeddingWorker.on('completed', (job) => {
  console.log(`Job ${job.id} completed`);
});

embeddingWorker.on('failed', (job, err) => {
  console.error(`Job ${job?.id} failed:`, err);
});

export const queueService = {
  /**
   * Queue journal entry for embedding generation
   */
  async queueJournalEmbedding(userId: string, entryId: string): Promise<void> {
    await embeddingQueue.add(
      'journal-embedding',
      { type: 'journal', userId, entityId: entryId },
      {
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 2000,
        },
      }
    );
  },

  /**
   * Queue knowledge item for embedding generation
   */
  async queueKnowledgeEmbedding(userId: string, itemId: string): Promise<void> {
    await embeddingQueue.add(
      'knowledge-embedding',
      { type: 'knowledge', userId, entityId: itemId },
      {
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 2000,
        },
      }
    );
  },
};

