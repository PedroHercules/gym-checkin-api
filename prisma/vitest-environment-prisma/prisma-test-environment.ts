import 'dotenv/config'
import { randomUUID } from 'node:crypto'
import { execSync } from 'node:child_process'
import { Environment } from 'vitest'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

function generateDatabaseUrl(schema: string) {
  if (!process.env.DATABASE_URL) {
    throw new Error('Please provide a DATABASE_URL environment variable.')
  }

  const url = new URL(process.env.DATABASE_URL)
  url.searchParams.set('schema', schema)

  return url.toString()
}

// This environment will be executed before each test file
export default <Environment>{
  name: 'prisma',
  async setup() {
    // This code will run before tests run
    const schema = randomUUID()
    const databaseUrl = generateDatabaseUrl(schema)

    // Assigns new database url to environment variable
    process.env.DATABASE_URL = databaseUrl

    // Use deploy to prisma do not compare with database
    // just read and run existing migrations
    execSync('npx prisma migrate deploy')

    return {
      async teardown() {
        // This code will run after the tests run
        await prisma.$executeRawUnsafe(
          `DROP SCHEMA IF EXISTS "${schema}" CASCADE`,
        )
        await prisma.$disconnect()
      },
    }
  },
}
