import { PrismaClient } from '@prisma/client'

const getDatabaseUrl = () => {
  const envUrl = process.env.DATABASE_URL
  const isLocal = envUrl?.includes('localhost') || envUrl?.includes('127.0.0.1')
  
  if (envUrl && (!isLocal || process.env.NODE_ENV !== 'production')) {
    return envUrl
  }
  return (
    process.env.groupnamed_DATABASE_URL ||
    process.env.STORAGE_DATABASE_URL ||
    process.env.POSTGRES_URL ||
    process.env.POSTGRES_PRISMA_URL ||
    envUrl
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
