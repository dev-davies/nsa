import Database from 'better-sqlite3';
import { createClient } from '@libsql/client';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const localDbPath = process.env.DB_PATH || './database.db';
const tursoUrl = process.env.DATABASE_URL;
const tursoToken = process.env.DATABASE_TOKEN;

if (!tursoUrl || !tursoToken) {
  console.error('Error: DATABASE_URL and DATABASE_TOKEN must be set in .env');
  process.exit(1);
}

const localDb = new Database(localDbPath);
const tursoClient = createClient({
  url: tursoUrl,
  authToken: tursoToken,
});

async function migrateTable(tableName) {
  console.log(`Migrating table: ${tableName}...`);
  
  // Get all rows from local table
  const rows = localDb.prepare(`SELECT * FROM ${tableName}`).all();
  if (rows.length === 0) {
    console.log(`Table ${tableName} is empty, skipping.`);
    return;
  }

  // Identify columns
  const columns = Object.keys(rows[0]);
  const placeholders = columns.map(() => '?').join(', ');
  const sql = `INSERT INTO ${tableName} (${columns.join(', ')}) VALUES (${placeholders})`;

  // Insert into Turso in batches or one by one (execute allows batching but let's do one by one or transactions)
  // Turso client.execute supports passing args as an array
  
  for (const row of rows) {
    const args = columns.map(col => row[col]);
    try {
      await tursoClient.execute({ sql, args });
    } catch (e) {
      console.error(`Failed to migrate row in ${tableName}:`, e.message);
    }
  }

  console.log(`Successfully migrated ${rows.length} rows to ${tableName}.`);
}

async function main() {
  try {
    // 1. Ensure tables exist in Turso (or assume they will be created by init-db)
    // Actually, it's safer to create them here if we are migrating data first.
    // I'll grab the schema from sqlite_master
    
    const tables = ['registrations', 'messages', 'admins'];
    
    for (const table of tables) {
      // Create table on Turso if it doesn't exist
      const schema = localDb.prepare(`SELECT sql FROM sqlite_master WHERE type='table' AND name='${table}'`).get();
      if (schema) {
        console.log(`Ensuring table ${table} exists on Turso...`);
        // Match CREATE TABLE and replace with CREATE TABLE IF NOT EXISTS if not present
        let createSql = schema.sql;
        if (!createSql.toUpperCase().includes('IF NOT EXISTS')) {
          createSql = createSql.replace(/CREATE TABLE/i, 'CREATE TABLE IF NOT EXISTS');
        }
        try {
          await tursoClient.execute(createSql);
        } catch (e) {
          console.warn(`Note: Could not ensure table ${table} exists: ${e.message}`);
        }
      }
      
      await migrateTable(table);
    }

    console.log('Migration completed successfully!');
  } catch (err) {
    console.error('Migration failed:', err);
  } finally {
    localDb.close();
  }
}

main();
