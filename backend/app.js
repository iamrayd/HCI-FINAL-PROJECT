import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import errorHandler from './middleswares/errorHandler.js';
import logger from './middleswares/logger.js';
import userRoutes from './routes/userRoutes.js';
import authRoutes from './routes/authRoutes.js';

// Initialize app
dotenv.config();
const app = express();

// Middlewares
app.use(cors()); 
app.use(express.json());
app.use(express.urlencoded({ extended: true })); 
app.use(logger);

app.use('/api/auth', authRoutes);

app.use('/api', userRoutes);



app.get('/', (req, res) => {
  res.send('API is running...');
});

app.use(errorHandler);

export default app;
