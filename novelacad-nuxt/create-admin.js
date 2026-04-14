#!/usr/bin/env node

/**
 * Simple script to create a new admin user in the SQLite database
 * Usage: node create-admin.js <username> <email> <password>
 * Example: node create-admin.js admin admin@novel-academy.com MySecurePassword123
 */

import bcrypt from 'bcryptjs'
import Database from 'better-sqlite3'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const args = process.argv.slice(2)

if (args.length < 3) {
  console.error('Usage: node create-admin.js <username> <email> <password>')
  console.error('Example: node create-admin.js admin admin@novel-academy.com MyPassword123')
  process.exit(1)
}

const [username, email, password] = args
const dbPath = path.join(__dirname, 'database.db')

try {
  const db = new Database(dbPath)
  const hash = bcrypt.hashSync(password, 12)

  const stmt = db.prepare(`
    INSERT INTO admins (username, email, role, password_hash)
    VALUES (?, ?, ?, ?)
  `)

  stmt.run(username, email, 'master', hash)
  console.log(`✅ Admin '${username}' created successfully!`)
  console.log(`   Email: ${email}`)
  console.log(`   Role: master`)
  console.log(`\n🔐 Login at: /admin/login`)

  db.close()
} catch (error) {
  if (error.message && error.message.includes('UNIQUE constraint')) {
    console.error('❌ Error: Username or email already exists!')
  } else {
    console.error('❌ Error:', error.message)
  }
  process.exit(1)
}
