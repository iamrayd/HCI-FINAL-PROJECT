import express from 'express';
import { getProductDetails } from '../controller/barcodeController.js';

const router = express.Router();

// Route to fetch product details by barcode
router.get('/:barcode', getProductDetails);

export default router;
