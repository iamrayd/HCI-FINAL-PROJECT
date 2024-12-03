import express from 'express';
import authMiddleware from '../middleswares/authMiddleware.js';
import {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  checkEmail,
  getUserAllergens,
} from '../controller/userController.js';

const router = express.Router();

// Routes
router.get('/', authMiddleware, getAllUsers);
router.get('/:id', authMiddleware, getUserById);
router.put('/:id', authMiddleware, updateUser);
router.delete('/:id', authMiddleware, deleteUser);

router.get('/:id/allergens', authMiddleware, getUserAllergens);
router.post('/check-email', checkEmail);

export default router;
