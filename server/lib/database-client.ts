import { PrismaClient } from '@prisma/client';

export type DbClient = PrismaClient;

export const db = new PrismaClient();
