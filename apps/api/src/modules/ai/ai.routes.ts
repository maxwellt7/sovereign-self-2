import { Router } from 'express';
import { requireAuth } from '../../middleware/auth.js';
import { aiLimiter } from '../../middleware/rateLimiter.js';
import { aiController } from './ai.controller.js';
import { z } from 'zod';
import { validate } from '../../middleware/validation.js';

const router = Router();

// All AI routes require authentication and have stricter rate limiting
router.use(requireAuth, aiLimiter);

// Semantic search for journal entries
router.post(
  '/search/journal',
  validate(
    z.object({
      body: z.object({
        query: z.string().min(1),
        limit: z.number().optional(),
      }),
    })
  ),
  (req, res, next) => {
    aiController.searchJournal(req, res).catch(next);
  }
);

// Semantic search for knowledge base
router.post(
  '/search/knowledge',
  validate(
    z.object({
      body: z.object({
        query: z.string().min(1),
        limit: z.number().optional(),
      }),
    })
  ),
  (req, res, next) => {
    aiController.searchKnowledge(req, res).catch(next);
  }
);

// Generate reflection prompts for a journal entry
router.get('/journal/:entryId/prompts', (req, res, next) => {
  aiController.generateReflectionPrompts(req, res).catch(next);
});

// Summarize a journal entry
router.get('/journal/:entryId/summary', (req, res, next) => {
  aiController.summarizeEntry(req, res).catch(next);
});

// Analyze mood trends
router.get('/mood/analyze', (req, res, next) => {
  aiController.analyzeMoodTrend(req, res).catch(next);
});

export default router;

