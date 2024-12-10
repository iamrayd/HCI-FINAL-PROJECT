import express from 'express';
import authMiddleware from '../middleswares/authMiddleware.js';
import {
  /*
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  */
  getScanHistory,
  deleteFavorite,
  getFavorites,
  removeAllergen,
  checkEmail,
  getUserAllergens,
} from '../controller/userController.js';

const router = express.Router();

router.delete('/allergens', removeAllergen)
router.delete('/remove-favorite', deleteFavorite);

router.get('/allergens/:user_id', getUserAllergens);
router.get('/favorites/:user_id', getFavorites);
router.get('/scan-history/:user_id', getScanHistory);

router.post('/check-email', checkEmail);

/*
router.get('/', authMiddleware, getAllUsers);
router.get('/:id', authMiddleware, getUserById);
router.put('/:id', authMiddleware, updateUser);
router.delete('/:id', authMiddleware, deleteUser);
*/

export default router;
