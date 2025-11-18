import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create a test user (you'll need to update the clerkUserId with a real one)
  const testUser = await prisma.user.upsert({
    where: { email: 'test@sovereignself.com' },
    update: {},
    create: {
      clerkUserId: 'user_test123',
      email: 'test@sovereignself.com',
      fullName: 'Test User',
      role: 'USER',
      onboardingCompleted: true,
      preferences: {
        theme: 'light',
        notifications: {
          email: true,
          push: false,
        },
        journaling: {
          autoSave: true,
        },
      },
    },
  });

  console.log('✅ Created test user:', testUser.email);

  // Create sample journal entry
  const journalEntry = await prisma.journalEntry.create({
    data: {
      userId: testUser.id,
      title: 'My First Journal Entry',
      content: {
        type: 'doc',
        content: [
          {
            type: 'paragraph',
            content: [
              {
                type: 'text',
                text: 'This is a sample journal entry to get you started!',
              },
            ],
          },
        ],
      },
      mood: 'grateful',
      tags: ['sample', 'first-entry'],
    },
  });

  console.log('✅ Created sample journal entry');

  // Create sample knowledge base item
  const knowledgeItem = await prisma.knowledgeBaseItem.create({
    data: {
      userId: testUser.id,
      type: 'NOTE',
      title: 'Welcome to Your Knowledge Base',
      content: {
        type: 'doc',
        content: [
          {
            type: 'paragraph',
            content: [
              {
                type: 'text',
                text: 'Store your insights, notes, and learnings here!',
              },
            ],
          },
        ],
      },
      tags: ['welcome', 'getting-started'],
    },
  });

  console.log('✅ Created sample knowledge base item');

  // Create a sample goal
  const goal = await prisma.userGoal.create({
    data: {
      userId: testUser.id,
      title: 'Journal Daily for 30 Days',
      description: 'Build a consistent journaling habit by writing every day for a month.',
      status: 'ACTIVE',
      progress: 10,
      targetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
  });

  console.log('✅ Created sample goal');

  console.log('🎉 Database seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

