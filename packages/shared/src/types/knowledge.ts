import { UUID, Timestamps } from './common';

export enum KnowledgeItemType {
  NOTE = 'NOTE',
  ARTICLE = 'ARTICLE',
  RESOURCE = 'RESOURCE',
  INSIGHT = 'INSIGHT',
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
  status: 'ACTIVE' | 'COMPLETED' | 'PAUSED';
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
  status?: 'ACTIVE' | 'COMPLETED' | 'PAUSED';
  progress?: number;
  targetDate?: Date;
}

export interface GrowthMetric extends Timestamps {
  id: UUID;
  userId: UUID;
  metricType: 'MOOD_TREND' | 'CONSISTENCY' | 'WORD_COUNT' | 'CUSTOM';
  value: number;
  metadata: Record<string, any>;
  recordedAt: Date;
}
