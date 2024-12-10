import express from 'express';
import { getProductDetails, getRecentScans, addToRecentScans } from '../controller/barcodeController.js';

const router = express.Router();

router.get('/:barcode', getProductDetails);
router.get('/recent-scans/:user_id', getRecentScans);

router.post('/recent-scans/:user_id', addToRecentScans);

export default router;
