import { z } from 'zod';

export const userPreferencesSchema = z.object({
  theme: z.enum(['light', 'dark', 'auto']).optional(),
  notifications: z.object({
    email: z.boolean().optional(),
    push: z.boolean().optional(),
  }).optional(),
  journaling: z.object({
    defaultMood: z.string().optional(),
    autoSave: z.boolean().optional(),
  }).optional(),
});

export const createUserSchema = z.object({
  clerkUserId: z.string().min(1),
  email: z.string().email(),
  fullName: z.string().optional(),
});

export const updateUserSchema = z.object({
  fullName: z.string().optional(),
  preferences: userPreferencesSchema.partial().optional(),
  onboardingCompleted: z.boolean().optional(),
});

