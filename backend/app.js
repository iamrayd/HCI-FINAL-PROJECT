import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import errorHandler from './middleswares/errorHandler.js';
import logger from './middleswares/logger.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import barcodeRoutes from './routes/barcodeRoutes.js';


dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logger);

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', barcodeRoutes);

app.get('/', (req, res) => res.send('API is running...'));
app.use(errorHandler);

export default app;
