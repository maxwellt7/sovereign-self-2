import { Router } from 'express';
import { handleClerkWebhook } from './webhook.controller.js';

const router = Router();

// Clerk webhook endpoint (no auth middleware - verified by Svix)
router.post('/webhooks/clerk', handleClerkWebhook);

export default router;

