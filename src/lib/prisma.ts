import { PrismaClient } from '@prisma/client'

const getDatabaseUrl = () => {
  return (
    process.env.DATABASE_URL ||
    process.env.groupnamed_DATABASE_URL ||
    process.env.STORAGE_DATABASE_URL ||
    process.env.POSTGRES_URL ||
    process.env.POSTGRES_PRISMA_URL
  )
}

declare const global: Global & { prisma?: PrismaClient }

export let p: PrismaClient = undefined as any as PrismaClient

if (typeof window === 'undefined') {
  const options = {
    datasources: {
      db: {
        url: getDatabaseUrl(),
      },
    },
  }
  // await delay(1000)
  if (process.env['NODE_ENV'] === 'production') {
    p = new PrismaClient(options)
  } else {
    if (!global.prisma) {
      global.prisma = new PrismaClient(options)
    }
    p = global.prisma
  }
}

export const prisma = p
