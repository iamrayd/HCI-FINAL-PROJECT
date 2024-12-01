import express from 'express';
import authMiddleware from '../middleswares/authMiddleware.js';
import {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  checkEmail,

} from '../controller/userController.js';

const router = express.Router();

router.get('/users', authMiddleware, getAllUsers);
router.get('/users/:id', authMiddleware, getUserById);
router.put('/users/:id', authMiddleware, updateUser);
router.delete('/users/:id', authMiddleware, deleteUser);

router.post('/users/check-email', checkEmail);



export default router;
