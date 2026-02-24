import mongoose from 'mongoose';
import { logger } from '@utils';

export const connectDB = () => {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error('DATABASE_URL environment variable is not set');
  }
  return mongoose.connect(databaseUrl);
};

const db = mongoose.connection;

db.once('open', () => {
  logger().info('Connected to MongoDB');
});

db.on('error', () => logger().error('MongoDB connection failed'));
