import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { join } from 'path';

// Load .env file
dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
  // Use __dirname to create absolute paths
  // Use {.ts,.js} to match both source and compiled files
  entities: [join(__dirname, '**', '*.entity{.ts,.js}')],
  migrations: [join(__dirname, 'migrations', '*{.ts,.js}')],
  
  synchronize: false, // Keep this false to use migrations
  logging: true,      // Useful for debugging why migrations might fail
});