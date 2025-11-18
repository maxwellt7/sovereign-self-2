import { Router } from 'express';
import { requireAuth } from '../../middleware/auth.js';
import { validate } from '../../middleware/validation.js';
import { updateUserSchema } from '@sovereign-self/shared';
import { userController } from './user.controller.js';
import { z } from 'zod';

const router = Router();

// All user routes require authentication
router.use(requireAuth);

// Get current user profile
router.get('/me', (req, res, next) => {
  userController.getProfile(req, res).catch(next);
});

// Update user profile
router.patch(
  '/me',
  validate(z.object({ body: updateUserSchema })),
  (req, res, next) => {
    userController.updateProfile(req, res).catch(next);
  }
);

// Complete onboarding
router.post('/me/onboarding/complete', (req, res, next) => {
  userController.completeOnboarding(req, res).catch(next);
});

// Delete account
router.delete('/me', (req, res, next) => {
  userController.deleteAccount(req, res).catch(next);
});

export default router;

