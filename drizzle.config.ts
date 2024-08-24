import { defineConfig } from 'drizzle-kit';
import * as dotenv from "dotenv";

dotenv.config({
    path: ".env.local",
})

if (!process.env.POSTGRES_URL) throw new Error('NEON DATABASE_URL not found in environment');


export default defineConfig({
  schema: './server/schema.ts',
  out: './server/migrations',
  dialect: 'postgresql', // 'postgresql' | 'mysql' | 'sqlite'
  dbCredentials: {
    url: process.env.POSTGRES_URL!,
  },
});