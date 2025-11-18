import prisma from '../../config/database.js';
import {
  JournalEntry,
  CreateJournalEntryDto,
  UpdateJournalEntryDto,
  JournalEntryFilters,
  PaginatedResponse,
} from '@sovereign-self/shared';
import { AppError } from '../../middleware/errorHandler.js';
import { createPaginatedResponse, getPrismaSkipTake } from '../../utils/pagination.js';

export class JournalService {
  async createEntry(
    userId: string,
    data: CreateJournalEntryDto
  ): Promise<JournalEntry> {
    const entry = await prisma.journalEntry.create({
      data: {
        userId,
        title: data.title || null,
        content: data.content,
        mood: data.mood || null,
        tags: data.tags || [],
      },
    });

    return entry as JournalEntry;
  }

  async getEntries(
    userId: string,
    filters: JournalEntryFilters,
    page: number,
    limit: number
  ): Promise<PaginatedResponse<JournalEntry>> {
    const where: any = { userId };

    if (filters.startDate || filters.endDate) {
      where.createdAt = {};
      if (filters.startDate) where.createdAt.gte = filters.startDate;
      if (filters.endDate) where.createdAt.lte = filters.endDate;
    }

    if (filters.mood) {
      where.mood = filters.mood;
    }

    if (filters.tags && filters.tags.length > 0) {
      where.tags = { hasSome: filters.tags };
    }

    if (filters.isArchived !== undefined) {
      where.isArchived = filters.isArchived;
    }

    if (filters.search) {
      where.OR = [
        { title: { contains: filters.search, mode: 'insensitive' } },
        { content: { string_contains: filters.search } },
      ];
    }

    const [entries, total] = await Promise.all([
      prisma.journalEntry.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        ...getPrismaSkipTake(page, limit),
      }),
      prisma.journalEntry.count({ where }),
    ]);

    return createPaginatedResponse(entries as JournalEntry[], total, page, limit);
  }

  async getEntryById(userId: string, id: string): Promise<JournalEntry> {
    const entry = await prisma.journalEntry.findFirst({
      where: { id, userId },
    });

    if (!entry) {
      throw new AppError(404, 'Journal entry not found', 'ENTRY_NOT_FOUND');
    }

    return entry as JournalEntry;
  }

  async updateEntry(
    userId: string,
    id: string,
    data: UpdateJournalEntryDto
  ): Promise<JournalEntry> {
    // Verify ownership
    await this.getEntryById(userId, id);

    const entry = await prisma.journalEntry.update({
      where: { id },
      data: {
        ...data,
        // If content is updated, mark for re-syncing with Pinecone
        ...(data.content && { embeddingSynced: false }),
      },
    });

    return entry as JournalEntry;
  }

  async deleteEntry(userId: string, id: string): Promise<void> {
    // Verify ownership
    await this.getEntryById(userId, id);

    await prisma.journalEntry.delete({
      where: { id },
    });
  }

  async getEntryTags(userId: string): Promise<string[]> {
    const entries = await prisma.journalEntry.findMany({
      where: { userId },
      select: { tags: true },
    });

    const allTags = entries.flatMap((entry) => entry.tags);
    return Array.from(new Set(allTags)).sort();
  }

  async getEntryStats(userId: string): Promise<{
    totalEntries: number;
    thisWeek: number;
    thisMonth: number;
    averageWordCount: number;
  }> {
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const [totalEntries, thisWeek, thisMonth] = await Promise.all([
      prisma.journalEntry.count({ where: { userId } }),
      prisma.journalEntry.count({
        where: { userId, createdAt: { gte: weekAgo } },
      }),
      prisma.journalEntry.count({
        where: { userId, createdAt: { gte: monthAgo } },
      }),
    ]);

    // Calculate average word count (simplified - counts all text in content)
    const entries = await prisma.journalEntry.findMany({
      where: { userId },
      select: { content: true },
      take: 100, // Sample for performance
    });

    const totalWords = entries.reduce((sum, entry) => {
      const text = JSON.stringify(entry.content);
      return sum + text.split(/\s+/).length;
    }, 0);

    const averageWordCount = entries.length > 0 ? Math.round(totalWords / entries.length) : 0;

    return {
      totalEntries,
      thisWeek,
      thisMonth,
      averageWordCount,
    };
  }
}

export const journalService = new JournalService();

