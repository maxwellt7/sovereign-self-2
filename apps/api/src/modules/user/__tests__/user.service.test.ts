import { describe, it, expect, vi, beforeEach } from 'vitest';
import { UserService } from '../user.service';
import prisma from '../../../config/database';

vi.mock('../../../config/database', () => ({
  default: {
    user: {
      findUnique: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  },
}));

describe('UserService', () => {
  let userService: UserService;

  beforeEach(() => {
    userService = new UserService();
    vi.clearAllMocks();
  });

  describe('getUserById', () => {
    it('should return user when found', async () => {
      const mockUser = {
        id: '123',
        clerkUserId: 'user_123',
        email: 'test@example.com',
        fullName: 'Test User',
        role: 'USER',
        onboardingCompleted: true,
        preferences: {},
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (prisma.user.findUnique as any).mockResolvedValue(mockUser);

      const result = await userService.getUserById('123');
      
      expect(result).toEqual(mockUser);
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: '123' },
      });
    });

    it('should throw error when user not found', async () => {
      (prisma.user.findUnique as any).mockResolvedValue(null);

      await expect(userService.getUserById('123')).rejects.toThrow('User not found');
    });
  });

  describe('updateUser', () => {
    it('should update user successfully', async () => {
      const mockUser = {
        id: '123',
        clerkUserId: 'user_123',
        email: 'test@example.com',
        fullName: 'Updated Name',
        role: 'USER',
        onboardingCompleted: true,
        preferences: { theme: 'dark' },
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (prisma.user.findUnique as any).mockResolvedValue(mockUser);
      (prisma.user.update as any).mockResolvedValue(mockUser);

      const result = await userService.updateUser('123', { fullName: 'Updated Name' });

      expect(result.fullName).toBe('Updated Name');
      expect(prisma.user.update).toHaveBeenCalled();
    });
  });
});

