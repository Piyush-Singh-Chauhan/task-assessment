import express from 'express';
import Protect from '../middlewares/authMiddleware.js';
import { getProfile, updateProfile } from '../controllers/userController.js';

const router = express.Router();

// Get user profile
router.get('/profile', Protect, getProfile);
router.put('/profile', Protect, updateProfile);

export default router;