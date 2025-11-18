import { Response } from 'express';
import { AuthRequest } from '../../middleware/auth.js';
import { userService } from './user.service.js';
import { successResponse } from '../../utils/response.js';

export class UserController {
  async getProfile(req: AuthRequest, res: Response): Promise<void> {
    const user = await userService.getUserById(req.auth!.userId);
    successResponse(res, user);
  }

  async updateProfile(req: AuthRequest, res: Response): Promise<void> {
    const user = await userService.updateUser(req.auth!.userId, req.body);
    successResponse(res, user);
  }

  async completeOnboarding(req: AuthRequest, res: Response): Promise<void> {
    const user = await userService.completeOnboarding(req.auth!.userId);
    successResponse(res, user);
  }

  async deleteAccount(req: AuthRequest, res: Response): Promise<void> {
    await userService.deleteUser(req.auth!.userId);
    successResponse(res, { message: 'Account deleted successfully' });
  }
}

export const userController = new UserController();

