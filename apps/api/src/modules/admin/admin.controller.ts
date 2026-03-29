import { Response } from 'express';
import { AuthRequest } from '../../middleware/auth.js';
import { adminService } from './admin.service.js';
import { successResponse } from '../../utils/response.js';
import { getPaginationParams } from '../../utils/pagination.js';

export class AdminController {
  async getUsers(req: AuthRequest, res: Response): Promise<void> {
    const { page, limit } = getPaginationParams(req.query);
    const search = req.query.search as string;

    const result = await adminService.getAllUsers(page, limit, search);
    successResponse(res, result);
  }

  async getUser(req: AuthRequest, res: Response): Promise<void> {
    const user = await adminService.getUserById(req.params.id);
    successResponse(res, user);
  }

  async updateUserRole(req: AuthRequest, res: Response): Promise<void> {
    const { role } = req.body;
    const user = await adminService.updateUserRole(req.params.id, role);
    successResponse(res, user);
  }

  async deleteUser(req: AuthRequest, res: Response): Promise<void> {
    await adminService.deleteUser(req.params.id);
    successResponse(res, { message: 'User deleted successfully' });
  }

  async getSystemStats(_req: AuthRequest, res: Response): Promise<void> {
    const stats = await adminService.getSystemStats();
    successResponse(res, stats);
  }
}

export const adminController = new AdminController();
