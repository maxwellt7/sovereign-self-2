import prisma from '../../config/database.js';
import { User, PaginatedResponse } from '@sovereign-self/shared';
import { createPaginatedResponse, getPrismaSkipTake } from '../../utils/pagination.js';
import { AppError } from '../../middleware/errorHandler.js';

export class AdminService {
  async getAllUsers(
    page: number,
    limit: number,
    search?: string
  ): Promise<PaginatedResponse<User>> {
    const where: any = {};

    if (search) {
      where.OR = [
        { email: { contains: search, mode: 'insensitive' } },
        { fullName: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        ...getPrismaSkipTake(page, limit),
      }),
      prisma.user.count({ where }),
    ]);

    return createPaginatedResponse(users as User[], total, page, limit);
  }

  async getUserById(id: string): Promise<User> {
    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new AppError(404, 'User not found', 'USER_NOT_FOUND');
    }

    return user as User;
  }

  async updateUserRole(id: string, role: 'USER' | 'ADMIN'): Promise<User> {
    const user = await prisma.user.update({
      where: { id },
      data: { role },
    });

    return user as User;
  }

  async deleteUser(id: string): Promise<void> {
    await prisma.user.delete({
      where: { id },
    });
  }

  async getSystemStats(): Promise<{
    totalUsers: number;
    activeUsersThisWeek: number;
    totalJournalEntries: number;
    totalKnowledgeItems: number;
    recentSignups: number;
  }> {
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const [
      totalUsers,
      activeUsersThisWeek,
      totalJournalEntries,
      totalKnowledgeItems,
      recentSignups,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({
        where: {
          journalEntries: {
            some: {
              createdAt: { gte: weekAgo },
            },
          },
        },
      }),
      prisma.journalEntry.count(),
      prisma.knowledgeBaseItem.count(),
      prisma.user.count({
        where: { createdAt: { gte: weekAgo } },
      }),
    ]);

    return {
      totalUsers,
      activeUsersThisWeek,
      totalJournalEntries,
      totalKnowledgeItems,
      recentSignups,
    };
  }
}

export const adminService = new AdminService();

