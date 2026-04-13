export function initDb() {
  const db = getDb()

  const SCHEMA = `
    CREATE TABLE IF NOT EXISTS registrations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      full_name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT NOT NULL,
      dob TEXT NOT NULL,
      address TEXT NOT NULL,
      sex TEXT NOT NULL,
      nationality TEXT NOT NULL,
      state TEXT NOT NULL,
      course TEXT NOT NULL,
      duration TEXT,
      level TEXT NOT NULL,
      qualification TEXT,
      goals TEXT,
      experience TEXT,
      info_source TEXT,
      submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      subject TEXT NOT NULL,
      message TEXT NOT NULL,
      submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS admins (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL UNIQUE,
      email TEXT NOT NULL UNIQUE,
      role TEXT DEFAULT 'admin',
      password_hash TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `

  // Run schema (CREATE IF NOT EXISTS — safe to run multiple times)
  db.exec(SCHEMA)

  // Migration: add 'duration' column if missing
  const regCols = db.pragma('table_info(registrations)') as { name: string }[]
  if (!regCols.find(c => c.name === 'duration')) {
    db.exec(`ALTER TABLE registrations ADD COLUMN duration TEXT`)
  }

  // Migration: add 'created_at' to admins if missing
  const adminCols = db.pragma('table_info(admins)') as { name: string }[]
  if (!adminCols.find(c => c.name === 'created_at')) {
    db.exec(`ALTER TABLE admins ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP`)
  }

  // Ensure a master admin exists
  const masterCount = (db.prepare(`SELECT COUNT(*) as cnt FROM admins WHERE role = 'master'`).get() as { cnt: number }).cnt
  if (masterCount === 0) {
    const firstAdmin = db.prepare(`SELECT id FROM admins LIMIT 1`).get() as { id: number } | undefined
    if (firstAdmin) {
      db.prepare(`UPDATE admins SET role = 'master' WHERE id = ?`).run(firstAdmin.id)
      console.log('[DB] First admin promoted to master role.')
    }
  }

  console.log('[DB] Database initialized successfully.')
}
