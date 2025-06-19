
import { PrismaClient } from '@prisma/client';

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

// Check if DATABASE_URL is set
if (!process.env.DATABASE_URL) {
  console.error("ERROR: DATABASE_URL environment variable is not set.");
  if (process.env.NODE_ENV === 'development') {
    console.warn("Please ensure your .env.local file is configured correctly with the DATABASE_URL.");
  }
  // For a production environment, you might want to throw an error or exit
  // to prevent the application from running without a database connection string.
  // For now, PrismaClient will throw an error internally if it's not configured.
}

const prisma = global.prisma || new PrismaClient({
  // Log Prisma queries in development for debugging purposes
  log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['error'],
});

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}

export default prisma;
