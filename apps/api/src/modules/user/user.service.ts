import prisma from '../../config/database.js';
import { User, UpdateUserDto } from '@sovereign-self/shared';
import { AppError } from '../../middleware/errorHandler.js';

export class UserService {
  async getUserById(id: string): Promise<User> {
    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new AppError(404, 'User not found', 'USER_NOT_FOUND');
    }

    return user as User;
  }

  async getUserByClerkId(clerkUserId: string): Promise<User> {
    const user = await prisma.user.findUnique({
      where: { clerkUserId },
    });

    if (!user) {
      throw new AppError(404, 'User not found', 'USER_NOT_FOUND');
    }

    return user as User;
  }

  async updateUser(id: string, data: UpdateUserDto): Promise<User> {
    const user = await prisma.user.update({
      where: { id },
      data: {
        ...data,
        preferences: data.preferences
          ? { ...(await this.getUserById(id)).preferences, ...data.preferences }
          : undefined,
      },
    });

    return user as User;
  }

  async completeOnboarding(id: string): Promise<User> {
    const user = await prisma.user.update({
      where: { id },
      data: {
        onboardingCompleted: true,
      },
    });

    return user as User;
  }

  async deleteUser(id: string): Promise<void> {
    await prisma.user.delete({
      where: { id },
    });
  }
}

export const userService = new UserService();

