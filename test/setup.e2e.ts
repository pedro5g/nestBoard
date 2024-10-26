import { PrismaClient } from '@prisma/client';
import { execSync } from 'node:child_process';
import { randomUUID } from 'node:crypto';
import 'dotenv/config';

const prisma = new PrismaClient();

function generateUniqueDatabaseURL(schemaId: string) {
  if (!process.env.DATABASE_URL) {
    throw new Error('Please provider a DATABASE_URL environment variable');
  }

  const _url = new URL(process.env.DATABASE_URL);

  _url.searchParams.set('schema', schemaId);

  return _url.toString();
}

const schemaId = randomUUID();

beforeAll(async () => {
  const databaseUrl = generateUniqueDatabaseURL(schemaId);
  process.env.DATABASE_URL = databaseUrl;

  execSync('npx prisma migrate deploy');
  await prisma.$connect();
  console.log('Database test is up');
});

afterAll(async () => {
  await prisma.$executeRawUnsafe(`DROP SCHEMA IF EXISTS "${schemaId}" CASCADE`);
  await prisma.$disconnect();
  console.log('Database test is drop');
});
