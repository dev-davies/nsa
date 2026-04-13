import { createClient, type Client } from '@libsql/client'

let client: Client | null = null

export function getDb(): Client {
  if (client) return client

  const config = useRuntimeConfig()
  
  // Use environment variables for Turso
  const url = (config.tursoUrl as string) || process.env.DATABASE_URL
  const authToken = (config.tursoToken as string) || process.env.DATABASE_TOKEN

  if (!url) {
    throw new Error('DATABASE_URL is not defined. Please check your .env file.')
  }

  client = createClient({
    url,
    authToken,
  })

  return client
}
