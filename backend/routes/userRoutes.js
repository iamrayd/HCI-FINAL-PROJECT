import express from 'express';
import authMiddleware from '../middleswares/authMiddleware.js';
import {
  /*
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  */
  getUserInfo,
  addFavorite,
  getSafeScanHistory,
  getDetectedScanHistory,
  getAllScanHistory,
  deleteFavorite,
  getFavorites,
  removeAllergen,
  checkEmail,
  getUserAllergens,
} from '../controller/userController.js';

const router = express.Router();

router.delete('/allergens', removeAllergen)
router.delete('/remove-favorite', deleteFavorite);

router.get('/user-info/:user_id', getUserInfo);
router.get('/allergens/:user_id', getUserAllergens);
router.get('/favorites/:user_id', getFavorites);
router.get('/scan-history/all/:user_id', getAllScanHistory);
router.get('/scan-history/safe/:user_id', getSafeScanHistory);
router.get('/scan-history/detected/:user_id', getDetectedScanHistory);

router.post('/check-email', checkEmail);
router.post('/favorites', addFavorite)

/*
router.get('/', authMiddleware, getAllUsers);
router.get('/:id', authMiddleware, getUserById);
router.put('/:id', authMiddleware, updateUser);
router.delete('/:id', authMiddleware, deleteUser);
*/

export default router;
