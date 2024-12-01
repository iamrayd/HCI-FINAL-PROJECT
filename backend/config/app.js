import dotenv from 'dotenv';

dotenv.config(); 

const config = {
  port: process.env.PORT,
  env: process.env.NODE_ENV,
  dbHost: process.env.DB_HOST,
  dbName: process.env.DB_NAME
};

export default config;
