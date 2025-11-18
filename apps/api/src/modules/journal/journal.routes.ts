import { Router } from 'express';
import { requireAuth } from '../../middleware/auth.js';
import { validate } from '../../middleware/validation.js';
import {
  createJournalEntrySchema,
  updateJournalEntrySchema,
  journalEntryFiltersSchema,
} from '@sovereign-self/shared';
import { journalController } from './journal.controller.js';
import { z } from 'zod';

const router = Router();

// All journal routes require authentication
router.use(requireAuth);

// Get journal stats
router.get('/stats', (req, res, next) => {
  journalController.getStats(req, res).catch(next);
});

// Get all tags
router.get('/tags', (req, res, next) => {
  journalController.getTags(req, res).catch(next);
});

// Get all journal entries with filters
router.get(
  '/',
  validate(z.object({ query: journalEntryFiltersSchema.partial() })),
  (req, res, next) => {
    journalController.getEntries(req, res).catch(next);
  }
);

// Create journal entry
router.post(
  '/',
  validate(z.object({ body: createJournalEntrySchema })),
  (req, res, next) => {
    journalController.createEntry(req, res).catch(next);
  }
);

// Get specific journal entry
router.get('/:id', (req, res, next) => {
  journalController.getEntry(req, res).catch(next);
});

// Update journal entry
router.patch(
  '/:id',
  validate(z.object({ body: updateJournalEntrySchema })),
  (req, res, next) => {
    journalController.updateEntry(req, res).catch(next);
  }
);

// Delete journal entry
router.delete('/:id', (req, res, next) => {
  journalController.deleteEntry(req, res).catch(next);
});

export default router;

