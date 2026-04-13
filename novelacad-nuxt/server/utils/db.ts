import Database from 'better-sqlite3'
import fs from 'node:fs'
import path from 'node:path'

let db: Database.Database | null = null

export function getDb(): Database.Database {
  if (db) return db

  const config = useRuntimeConfig()
  const dbPath = (config.dbPath as string) || './database.db'

  // Ensure the directory exists
  const dir = path.dirname(path.resolve(dbPath))
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }

  db = new Database(path.resolve(dbPath))
  db.pragma('journal_mode = WAL')
  db.pragma('foreign_keys = ON')

  return db
}
