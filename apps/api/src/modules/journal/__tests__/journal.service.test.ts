import { describe, it, expect, vi, beforeEach } from 'vitest';
import { JournalService } from '../journal.service';
import prisma from '../../../config/database';

vi.mock('../../../config/database', () => ({
  default: {
    journalEntry: {
      create: vi.fn(),
      findMany: vi.fn(),
      findFirst: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      count: vi.fn(),
    },
  },
}));

describe('JournalService', () => {
  let journalService: JournalService;

  beforeEach(() => {
    journalService = new JournalService();
    vi.clearAllMocks();
  });

  describe('createEntry', () => {
    it('should create journal entry successfully', async () => {
      const mockEntry = {
        id: '123',
        userId: 'user-123',
        title: 'Test Entry',
        content: { type: 'doc', content: [] },
        mood: 'happy',
        tags: ['test'],
        embeddingSynced: false,
        isArchived: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (prisma.journalEntry.create as any).mockResolvedValue(mockEntry);

      const result = await journalService.createEntry('user-123', {
        title: 'Test Entry',
        content: { type: 'doc', content: [] },
        mood: 'happy',
        tags: ['test'],
      });

      expect(result.title).toBe('Test Entry');
      expect(prisma.journalEntry.create).toHaveBeenCalled();
    });
  });

  describe('getEntries', () => {
    it('should return paginated entries', async () => {
      const mockEntries = [
        {
          id: '1',
          userId: 'user-123',
          title: 'Entry 1',
          content: {},
          mood: null,
          tags: [],
          embeddingSynced: false,
          isArchived: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      (prisma.journalEntry.findMany as any).mockResolvedValue(mockEntries);
      (prisma.journalEntry.count as any).mockResolvedValue(1);

      const result = await journalService.getEntries('user-123', {}, 1, 20);

      expect(result.data).toHaveLength(1);
      expect(result.pagination.total).toBe(1);
    });
  });

  describe('deleteEntry', () => {
    it('should delete entry after verification', async () => {
      const mockEntry = {
        id: '123',
        userId: 'user-123',
        title: 'Test',
        content: {},
        mood: null,
        tags: [],
        embeddingSynced: false,
        isArchived: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (prisma.journalEntry.findFirst as any).mockResolvedValue(mockEntry);
      (prisma.journalEntry.delete as any).mockResolvedValue(mockEntry);

      await journalService.deleteEntry('user-123', '123');

      expect(prisma.journalEntry.delete).toHaveBeenCalledWith({
        where: { id: '123' },
      });
    });

    it('should throw error when entry not found', async () => {
      (prisma.journalEntry.findFirst as any).mockResolvedValue(null);

      await expect(journalService.deleteEntry('user-123', '123')).rejects.toThrow(
        'Journal entry not found'
      );
    });
  });
});

