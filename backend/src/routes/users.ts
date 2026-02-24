import express from 'express';
import * as userController from '../controllers/userController';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

// Profile routes
router.get('/profile', authMiddleware, userController.getProfile);
router.patch('/profile', authMiddleware, userController.updateProfile);

// Browse professionals
router.get('/professionals', userController.getProfessionals);
router.get('/professionals/:id', userController.getProfessionalById);

export default router;
