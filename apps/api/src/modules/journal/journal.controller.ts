import { Response } from 'express';
import { AuthRequest } from '../../middleware/auth.js';
import { journalService } from './journal.service.js';
import { successResponse } from '../../utils/response.js';
import { getPaginationParams } from '../../utils/pagination.js';
import { JournalEntryFilters } from '@sovereign-self/shared';

export class JournalController {
  async createEntry(req: AuthRequest, res: Response): Promise<void> {
    const entry = await journalService.createEntry(req.auth!.userId, req.body);
    successResponse(res, entry, 201);
  }

  async getEntries(req: AuthRequest, res: Response): Promise<void> {
    const { page, limit } = getPaginationParams(req.query);
    const filters: JournalEntryFilters = {
      startDate: req.query.startDate ? new Date(req.query.startDate as string) : undefined,
      endDate: req.query.endDate ? new Date(req.query.endDate as string) : undefined,
      mood: req.query.mood as string,
      tags: req.query.tags ? (req.query.tags as string).split(',') : undefined,
      isArchived: req.query.isArchived === 'true',
      search: req.query.search as string,
    };

    const result = await journalService.getEntries(req.auth!.userId, filters, page, limit);
    successResponse(res, result);
  }

  async getEntry(req: AuthRequest, res: Response): Promise<void> {
    const entry = await journalService.getEntryById(req.auth!.userId, req.params.id);
    successResponse(res, entry);
  }

  async updateEntry(req: AuthRequest, res: Response): Promise<void> {
    const entry = await journalService.updateEntry(
      req.auth!.userId,
      req.params.id,
      req.body
    );
    successResponse(res, entry);
  }

  async deleteEntry(req: AuthRequest, res: Response): Promise<void> {
    await journalService.deleteEntry(req.auth!.userId, req.params.id);
    successResponse(res, { message: 'Entry deleted successfully' });
  }

  async getTags(req: AuthRequest, res: Response): Promise<void> {
    const tags = await journalService.getEntryTags(req.auth!.userId);
    successResponse(res, { tags });
  }

  async getStats(req: AuthRequest, res: Response): Promise<void> {
    const stats = await journalService.getEntryStats(req.auth!.userId);
    successResponse(res, stats);
  }
}

export const journalController = new JournalController();

