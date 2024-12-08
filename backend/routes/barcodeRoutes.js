import express from 'express';
import { getProductDetails, getRecentScans, addToRecentScans } from '../controller/barcodeController.js';

const router = express.Router();

// Route to fetch product details by barcode
router.get('/:barcode', getProductDetails);
router.get('/recent-scans/:user_id', getRecentScans);

router.post('/recent-scans', addToRecentScans);

export default router;
