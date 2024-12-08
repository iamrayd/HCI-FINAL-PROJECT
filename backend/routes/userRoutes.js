import express from 'express';
import authMiddleware from '../middleswares/authMiddleware.js';
import {
  /*
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  */
  removeAllergen,
  checkEmail,
  getUserAllergens,
} from '../controller/userController.js';

const router = express.Router();

router.delete('/allergens', removeAllergen)
router.get('/allergens/:user_id', getUserAllergens);
router.post('/check-email', checkEmail);

/*
router.get('/', authMiddleware, getAllUsers);
router.get('/:id', authMiddleware, getUserById);
router.put('/:id', authMiddleware, updateUser);
router.delete('/:id', authMiddleware, deleteUser);
*/

export default router;
