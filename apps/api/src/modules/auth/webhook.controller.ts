import { Request, Response } from 'express';
import { Webhook } from 'svix';
import prisma from '../../config/database.js';
import config from '../../config/index.js';

interface ClerkWebhookEvent {
  type: string;
  data: {
    id: string;
    email_addresses?: Array<{ email_address: string }>;
    first_name?: string;
    last_name?: string;
    public_metadata?: {
      role?: 'USER' | 'ADMIN';
    };
  };
}

export const handleClerkWebhook = async (req: Request, res: Response): Promise<void> => {
  try {
    const webhookSecret = config.clerk.webhookSecret;

    if (!webhookSecret) {
      console.error('Missing CLERK_WEBHOOK_SECRET');
      res.status(500).json({ error: 'Webhook secret not configured' });
      return;
    }

    // Verify the webhook signature
    const svix = new Webhook(webhookSecret);
    const payload = JSON.stringify(req.body);
    const headers = {
      'svix-id': req.headers['svix-id'] as string,
      'svix-timestamp': req.headers['svix-timestamp'] as string,
      'svix-signature': req.headers['svix-signature'] as string,
    };

    let event: ClerkWebhookEvent;

    try {
      event = svix.verify(payload, headers) as ClerkWebhookEvent;
    } catch (err) {
      console.error('Webhook verification failed:', err);
      res.status(400).json({ error: 'Invalid signature' });
      return;
    }

    // Handle the event
    switch (event.type) {
      case 'user.created':
        await handleUserCreated(event.data);
        break;

      case 'user.updated':
        await handleUserUpdated(event.data);
        break;

      case 'user.deleted':
        await handleUserDeleted(event.data);
        break;

      default:
        console.log(`Unhandled webhook event type: ${event.type}`);
    }

    res.status(200).json({ received: true });
  } catch (error) {
    console.error('Webhook handler error:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
};

async function handleUserCreated(data: ClerkWebhookEvent['data']): Promise<void> {
  const email = data.email_addresses?.[0]?.email_address;

  if (!email) {
    console.error('No email found in user.created event');
    return;
  }

  const fullName = data.first_name && data.last_name
    ? `${data.first_name} ${data.last_name}`
    : data.first_name || null;

  const role = data.public_metadata?.role || 'USER';

  await prisma.user.create({
    data: {
      clerkUserId: data.id,
      email,
      fullName,
      role,
      onboardingCompleted: false,
      preferences: {},
    },
  });

  console.log(`✅ Created user in database: ${email}`);
}

async function handleUserUpdated(data: ClerkWebhookEvent['data']): Promise<void> {
  const email = data.email_addresses?.[0]?.email_address;
  const fullName = data.first_name && data.last_name
    ? `${data.first_name} ${data.last_name}`
    : data.first_name || null;

  const role = data.public_metadata?.role || 'USER';

  await prisma.user.update({
    where: { clerkUserId: data.id },
    data: {
      email,
      fullName,
      role,
    },
  });

  console.log(`✅ Updated user in database: ${email}`);
}

async function handleUserDeleted(data: ClerkWebhookEvent['data']): Promise<void> {
  await prisma.user.delete({
    where: { clerkUserId: data.id },
  });

  console.log(`✅ Deleted user from database: ${data.id}`);
}

