import postgres from 'postgres'

const globalForDb = globalThis as unknown as { pg?: ReturnType<typeof postgres> }

export function createClient() {
  if (!globalForDb.pg) {
    globalForDb.pg = postgres(process.env.DATABASE_URL!, {
      max: 10,
      idle_timeout: 20,
      connect_timeout: 10,
    })
  }
  return globalForDb.pg
}
