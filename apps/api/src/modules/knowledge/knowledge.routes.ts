import { Router } from 'express';
import { requireAuth } from '../../middleware/auth.js';
import { validate } from '../../middleware/validation.js';
import {
  createKnowledgeItemSchema,
  updateKnowledgeItemSchema,
  knowledgeItemFiltersSchema,
} from '@sovereign-self/shared';
import { knowledgeController } from './knowledge.controller.js';
import { z } from 'zod';

const router = Router();

// All knowledge routes require authentication
router.use(requireAuth);

// Get hierarchy (tree structure)
router.get('/hierarchy', (req, res, next) => {
  knowledgeController.getHierarchy(req, res).catch(next);
});

// Get all tags
router.get('/tags', (req, res, next) => {
  knowledgeController.getTags(req, res).catch(next);
});

// Get all knowledge items with filters
router.get(
  '/',
  validate(z.object({ query: knowledgeItemFiltersSchema.partial() })),
  (req, res, next) => {
    knowledgeController.getItems(req, res).catch(next);
  }
);

// Create knowledge item
router.post(
  '/',
  validate(z.object({ body: createKnowledgeItemSchema })),
  (req, res, next) => {
    knowledgeController.createItem(req, res).catch(next);
  }
);

// Get specific knowledge item
router.get('/:id', (req, res, next) => {
  knowledgeController.getItem(req, res).catch(next);
});

// Update knowledge item
router.patch(
  '/:id',
  validate(z.object({ body: updateKnowledgeItemSchema })),
  (req, res, next) => {
    knowledgeController.updateItem(req, res).catch(next);
  }
);

// Delete knowledge item
router.delete('/:id', (req, res, next) => {
  knowledgeController.deleteItem(req, res).catch(next);
});

export default router;

