import { UUID, Timestamps } from './common';

export interface JournalEntry extends Timestamps {
  id: UUID;
  userId: UUID;
  title: string | null;
  content: any; // Tiptap JSON
  mood: string | null;
  tags: string[];
  embeddingSynced: boolean;
  isArchived: boolean;
}

export interface CreateJournalEntryDto {
  title?: string;
  content: any;
  mood?: string;
  tags?: string[];
}

export interface UpdateJournalEntryDto {
  title?: string;
  content?: any;
  mood?: string;
  tags?: string[];
  isArchived?: boolean;
}

export interface JournalEntryFilters {
  startDate?: Date;
  endDate?: Date;
  mood?: string;
  tags?: string[];
  isArchived?: boolean;
  search?: string;
}

export interface Reflection extends Timestamps {
  id: UUID;
  userId: UUID;
  journalEntryId: UUID | null;
  prompt: string;
  response: string;
  aiGenerated: boolean;
}

export interface CreateReflectionDto {
  journalEntryId?: UUID;
  prompt: string;
  response: string;
  aiGenerated?: boolean;
}

