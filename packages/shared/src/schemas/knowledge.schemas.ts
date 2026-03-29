import { z } from 'zod';

export const knowledgeItemTypeSchema = z.enum(['NOTE', 'ARTICLE', 'RESOURCE', 'INSIGHT']);

export const createKnowledgeItemSchema = z.object({
  type: knowledgeItemTypeSchema,
  title: z.string().min(1),
  content: z.any(),
  sourceUrl: z.string().url().optional(),
  tags: z.array(z.string()).optional(),
  parentId: z.string().uuid().optional(),
});

export const updateKnowledgeItemSchema = z.object({
  title: z.string().min(1).optional(),
  content: z.any().optional(),
  sourceUrl: z.string().url().optional(),
  tags: z.array(z.string()).optional(),
  parentId: z.string().uuid().optional(),
});

export const knowledgeItemFiltersSchema = z.object({
  type: knowledgeItemTypeSchema.optional(),
  tags: z.array(z.string()).optional(),
  parentId: z.string().uuid().optional(),
  search: z.string().optional(),
});

export const createGoalSchema = z.object({
  title: z.string().min(1),
  description: z.string(),
  targetDate: z.coerce.date().optional(),
});

export const updateGoalSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  status: z.enum(['ACTIVE', 'COMPLETED', 'PAUSED']).optional(),
  progress: z.number().min(0).max(100).optional(),
  targetDate: z.coerce.date().optional(),
});
