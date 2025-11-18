import { z } from 'zod';

export const createJournalEntrySchema = z.object({
  title: z.string().optional(),
  content: z.any(), // Tiptap JSON
  mood: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

export const updateJournalEntrySchema = z.object({
  title: z.string().optional(),
  content: z.any().optional(),
  mood: z.string().optional(),
  tags: z.array(z.string()).optional(),
  isArchived: z.boolean().optional(),
});

export const journalEntryFiltersSchema = z.object({
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
  mood: z.string().optional(),
  tags: z.array(z.string()).optional(),
  isArchived: z.boolean().optional(),
  search: z.string().optional(),
});

export const createReflectionSchema = z.object({
  journalEntryId: z.string().uuid().optional(),
  prompt: z.string().min(1),
  response: z.string().min(1),
  aiGenerated: z.boolean().optional(),
});

