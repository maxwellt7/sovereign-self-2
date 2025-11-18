import { Response } from 'express';
import { AuthRequest } from '../../middleware/auth.js';
import { knowledgeService } from './knowledge.service.js';
import { successResponse } from '../../utils/response.js';
import { getPaginationParams } from '../../utils/pagination.js';
import { KnowledgeItemFilters, KnowledgeItemType } from '@sovereign-self/shared';

export class KnowledgeController {
  async createItem(req: AuthRequest, res: Response): Promise<void> {
    const item = await knowledgeService.createItem(req.auth!.userId, req.body);
    successResponse(res, item, 201);
  }

  async getItems(req: AuthRequest, res: Response): Promise<void> {
    const { page, limit } = getPaginationParams(req.query);
    const filters: KnowledgeItemFilters = {
      type: req.query.type as KnowledgeItemType,
      tags: req.query.tags ? (req.query.tags as string).split(',') : undefined,
      parentId: req.query.parentId as string,
      search: req.query.search as string,
    };

    const result = await knowledgeService.getItems(req.auth!.userId, filters, page, limit);
    successResponse(res, result);
  }

  async getItem(req: AuthRequest, res: Response): Promise<void> {
    const item = await knowledgeService.getItemById(req.auth!.userId, req.params.id);
    successResponse(res, item);
  }

  async updateItem(req: AuthRequest, res: Response): Promise<void> {
    const item = await knowledgeService.updateItem(
      req.auth!.userId,
      req.params.id,
      req.body
    );
    successResponse(res, item);
  }

  async deleteItem(req: AuthRequest, res: Response): Promise<void> {
    await knowledgeService.deleteItem(req.auth!.userId, req.params.id);
    successResponse(res, { message: 'Item deleted successfully' });
  }

  async getTags(req: AuthRequest, res: Response): Promise<void> {
    const tags = await knowledgeService.getItemTags(req.auth!.userId);
    successResponse(res, { tags });
  }

  async getHierarchy(req: AuthRequest, res: Response): Promise<void> {
    const hierarchy = await knowledgeService.getHierarchy(req.auth!.userId);
    successResponse(res, { items: hierarchy });
  }
}

export const knowledgeController = new KnowledgeController();

