import { UUID, Timestamps } from './common';

export enum KnowledgeItemType {
  NOTE = 'note',
  ARTICLE = 'article',
  RESOURCE = 'resource',
  INSIGHT = 'insight',
}

export interface KnowledgeBaseItem extends Timestamps {
  id: UUID;
  userId: UUID;
  type: KnowledgeItemType;
  title: string;
  content: any; // Rich text JSON
  sourceUrl: string | null;
  tags: string[];
  embeddingSynced: boolean;
  parentId: UUID | null;
}

export interface CreateKnowledgeItemDto {
  type: KnowledgeItemType;
  title: string;
  content: any;
  sourceUrl?: string;
  tags?: string[];
  parentId?: UUID;
}

export interface UpdateKnowledgeItemDto {
  title?: string;
  content?: any;
  sourceUrl?: string;
  tags?: string[];
  parentId?: UUID;
}

export interface KnowledgeItemFilters {
  type?: KnowledgeItemType;
  tags?: string[];
  parentId?: UUID;
  search?: string;
}

export interface UserGoal extends Timestamps {
  id: UUID;
  userId: UUID;
  title: string;
  description: string;
  status: 'active' | 'completed' | 'paused';
  progress: number; // 0-100
  targetDate: Date | null;
  completedAt: Date | null;
}

export interface CreateGoalDto {
  title: string;
  description: string;
  targetDate?: Date;
}

export interface UpdateGoalDto {
  title?: string;
  description?: string;
  status?: 'active' | 'completed' | 'paused';
  progress?: number;
  targetDate?: Date;
}

export interface GrowthMetric extends Timestamps {
  id: UUID;
  userId: UUID;
  metricType: 'mood_trend' | 'consistency' | 'word_count' | 'custom';
  value: number;
  metadata: Record<string, any>;
  recordedAt: Date;
}

