import express from 'express';
import { getProductDetails  } from '../controller/barcodeController.js';

const router = express.Router();

router.post('/:barcode', getProductDetails);

export default router;
