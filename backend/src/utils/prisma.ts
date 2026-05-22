import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient();
// Prisma v7 supports setting datasourceUrl inside the constructor if needed, 
// but if we are just using the environment variable DATABASE_URL, it automatically picks it up.
// And since Prisma v7 removed `url` from schema, passing it here or letting it use env var is the way.
