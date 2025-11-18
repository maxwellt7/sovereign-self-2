import { Response } from 'express';
import { AuthRequest } from '../../middleware/auth.js';
import { embeddingService } from '../../services/embedding.service.js';
import { aiService } from '../../services/ai.service.js';
import { successResponse } from '../../utils/response.js';
import prisma from '../../config/database.js';

export class AIController {
  async searchJournal(req: AuthRequest, res: Response): Promise<void> {
    const { query, limit = 10 } = req.body;

    // Perform semantic search
    const results = await embeddingService.searchJournalEntries(
      req.auth!.userId,
      query,
      parseInt(limit as string, 10)
    );

    // Fetch full entries
    const entryIds = results.map((r) => r.id);
    const entries = await prisma.journalEntry.findMany({
      where: {
        id: { in: entryIds },
        userId: req.auth!.userId,
      },
    });

    // Combine with scores
    const enrichedResults = entries.map((entry) => {
      const match = results.find((r) => r.id === entry.id);
      return {
        ...entry,
        relevanceScore: match?.score || 0,
      };
    });

    successResponse(res, { results: enrichedResults });
  }

  async searchKnowledge(req: AuthRequest, res: Response): Promise<void> {
    const { query, limit = 10 } = req.body;

    // Perform semantic search
    const results = await embeddingService.searchKnowledgeItems(
      req.auth!.userId,
      query,
      parseInt(limit as string, 10)
    );

    // Fetch full items
    const itemIds = results.map((r) => r.id);
    const items = await prisma.knowledgeBaseItem.findMany({
      where: {
        id: { in: itemIds },
        userId: req.auth!.userId,
      },
    });

    // Combine with scores
    const enrichedResults = items.map((item) => {
      const match = results.find((r) => r.id === item.id);
      return {
        ...item,
        relevanceScore: match?.score || 0,
      };
    });

    successResponse(res, { results: enrichedResults });
  }

  async generateReflectionPrompts(req: AuthRequest, res: Response): Promise<void> {
    const { entryId } = req.params;

    // Fetch entry
    const entry = await prisma.journalEntry.findFirst({
      where: { id: entryId, userId: req.auth!.userId },
    });

    if (!entry) {
      res.status(404).json({ success: false, error: { message: 'Entry not found' } });
      return;
    }

    // Extract text and generate prompts
    const text = embeddingService.extractTextFromContent(entry.content);
    const prompts = await aiService.generateReflectionPrompts(text);

    successResponse(res, { prompts });
  }

  async summarizeEntry(req: AuthRequest, res: Response): Promise<void> {
    const { entryId } = req.params;

    // Fetch entry
    const entry = await prisma.journalEntry.findFirst({
      where: { id: entryId, userId: req.auth!.userId },
    });

    if (!entry) {
      res.status(404).json({ success: false, error: { message: 'Entry not found' } });
      return;
    }

    // Extract text and summarize
    const text = embeddingService.extractTextFromContent(entry.content);
    const summary = await aiService.summarizeEntry(text);

    successResponse(res, { summary });
  }

  async analyzeMoodTrend(req: AuthRequest, res: Response): Promise<void> {
    // Fetch recent entries with mood
    const entries = await prisma.journalEntry.findMany({
      where: {
        userId: req.auth!.userId,
        mood: { not: null },
      },
      orderBy: { createdAt: 'desc' },
      take: 30,
      select: {
        createdAt: true,
        mood: true,
      },
    });

    if (entries.length === 0) {
      successResponse(res, {
        trend: 'stable',
        insights: 'Not enough mood data to analyze trends yet. Keep journaling!',
      });
      return;
    }

    const moodData = entries.map((e) => ({
      date: e.createdAt.toISOString().split('T')[0],
      mood: e.mood!,
    }));

    const analysis = await aiService.analyzeMoodTrend(moodData);
    successResponse(res, analysis);
  }
}

export const aiController = new AIController();

