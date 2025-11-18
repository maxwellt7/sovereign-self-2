import prisma from '../../config/database.js';
import {
  KnowledgeBaseItem,
  CreateKnowledgeItemDto,
  UpdateKnowledgeItemDto,
  KnowledgeItemFilters,
  PaginatedResponse,
} from '@sovereign-self/shared';
import { AppError } from '../../middleware/errorHandler.js';
import { createPaginatedResponse, getPrismaSkipTake } from '../../utils/pagination.js';

export class KnowledgeService {
  async createItem(
    userId: string,
    data: CreateKnowledgeItemDto
  ): Promise<KnowledgeBaseItem> {
    // Verify parent exists if provided
    if (data.parentId) {
      const parent = await prisma.knowledgeBaseItem.findFirst({
        where: { id: data.parentId, userId },
      });

      if (!parent) {
        throw new AppError(404, 'Parent item not found', 'PARENT_NOT_FOUND');
      }
    }

    const item = await prisma.knowledgeBaseItem.create({
      data: {
        userId,
        type: data.type,
        title: data.title,
        content: data.content,
        sourceUrl: data.sourceUrl || null,
        tags: data.tags || [],
        parentId: data.parentId || null,
      },
    });

    return item as KnowledgeBaseItem;
  }

  async getItems(
    userId: string,
    filters: KnowledgeItemFilters,
    page: number,
    limit: number
  ): Promise<PaginatedResponse<KnowledgeBaseItem>> {
    const where: any = { userId };

    if (filters.type) {
      where.type = filters.type;
    }

    if (filters.tags && filters.tags.length > 0) {
      where.tags = { hasSome: filters.tags };
    }

    if (filters.parentId !== undefined) {
      where.parentId = filters.parentId || null;
    }

    if (filters.search) {
      where.OR = [
        { title: { contains: filters.search, mode: 'insensitive' } },
        { content: { string_contains: filters.search } },
      ];
    }

    const [items, total] = await Promise.all([
      prisma.knowledgeBaseItem.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        ...getPrismaSkipTake(page, limit),
      }),
      prisma.knowledgeBaseItem.count({ where }),
    ]);

    return createPaginatedResponse(items as KnowledgeBaseItem[], total, page, limit);
  }

  async getItemById(userId: string, id: string): Promise<KnowledgeBaseItem> {
    const item = await prisma.knowledgeBaseItem.findFirst({
      where: { id, userId },
      include: {
        children: {
          select: {
            id: true,
            title: true,
            type: true,
            createdAt: true,
          },
        },
      },
    });

    if (!item) {
      throw new AppError(404, 'Knowledge item not found', 'ITEM_NOT_FOUND');
    }

    return item as any;
  }

  async updateItem(
    userId: string,
    id: string,
    data: UpdateKnowledgeItemDto
  ): Promise<KnowledgeBaseItem> {
    // Verify ownership
    await this.getItemById(userId, id);

    // Verify new parent if provided
    if (data.parentId) {
      const parent = await prisma.knowledgeBaseItem.findFirst({
        where: { id: data.parentId, userId },
      });

      if (!parent) {
        throw new AppError(404, 'Parent item not found', 'PARENT_NOT_FOUND');
      }

      // Prevent circular references
      if (data.parentId === id) {
        throw new AppError(400, 'Item cannot be its own parent', 'CIRCULAR_REFERENCE');
      }
    }

    const item = await prisma.knowledgeBaseItem.update({
      where: { id },
      data: {
        ...data,
        // If content is updated, mark for re-syncing with Pinecone
        ...(data.content && { embeddingSynced: false }),
      },
    });

    return item as KnowledgeBaseItem;
  }

  async deleteItem(userId: string, id: string): Promise<void> {
    // Verify ownership
    await this.getItemById(userId, id);

    await prisma.knowledgeBaseItem.delete({
      where: { id },
    });
  }

  async getItemTags(userId: string): Promise<string[]> {
    const items = await prisma.knowledgeBaseItem.findMany({
      where: { userId },
      select: { tags: true },
    });

    const allTags = items.flatMap((item) => item.tags);
    return Array.from(new Set(allTags)).sort();
  }

  async getHierarchy(userId: string): Promise<any[]> {
    // Get all root items (no parent)
    const rootItems = await prisma.knowledgeBaseItem.findMany({
      where: { userId, parentId: null },
      orderBy: { createdAt: 'desc' },
    });

    // Recursively fetch children
    const buildHierarchy = async (items: any[]): Promise<any[]> => {
      return Promise.all(
        items.map(async (item) => {
          const children = await prisma.knowledgeBaseItem.findMany({
            where: { parentId: item.id },
            orderBy: { createdAt: 'desc' },
          });

          return {
            ...item,
            children: children.length > 0 ? await buildHierarchy(children) : [],
          };
        })
      );
    };

    return buildHierarchy(rootItems);
  }
}

export const knowledgeService = new KnowledgeService();

