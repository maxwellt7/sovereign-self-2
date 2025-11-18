import { Router } from 'express';
import { requireAuth, requireAdmin } from '../../middleware/auth.js';
import { adminController } from './admin.controller.js';
import { z } from 'zod';
import { validate } from '../../middleware/validation.js';

const router = Router();

// All admin routes require authentication AND admin role
router.use(requireAuth, requireAdmin);

// Get system stats
router.get('/stats', (req, res, next) => {
  adminController.getSystemStats(req, res).catch(next);
});

// Get all users
router.get('/users', (req, res, next) => {
  adminController.getUsers(req, res).catch(next);
});

// Get specific user
router.get('/users/:id', (req, res, next) => {
  adminController.getUser(req, res).catch(next);
});

// Update user role
router.patch(
  '/users/:id/role',
  validate(
    z.object({
      body: z.object({
        role: z.enum(['USER', 'ADMIN']),
      }),
    })
  ),
  (req, res, next) => {
    adminController.updateUserRole(req, res).catch(next);
  }
);

// Delete user
router.delete('/users/:id', (req, res, next) => {
  adminController.deleteUser(req, res).catch(next);
});

export default router;

