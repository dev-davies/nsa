export async function initDb() {
  const db = getDb()

  const SCHEMA = [
    `CREATE TABLE IF NOT EXISTS registrations (
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
    );`,
    `CREATE TABLE IF NOT EXISTS messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      subject TEXT NOT NULL,
      message TEXT NOT NULL,
      submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );`,
    `CREATE TABLE IF NOT EXISTS admins (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL UNIQUE,
      email TEXT NOT NULL UNIQUE,
      role TEXT DEFAULT 'admin',
      password_hash TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );`
  ]

  // Run schema commands sequentially
  for (const cmd of SCHEMA) {
    await db.execute(cmd)
  }

  // Migration: add 'duration' column if missing
  const regColsRes = await db.execute("PRAGMA table_info(registrations)")
  const regCols = regColsRes.rows as unknown as { name: string }[]
  if (!regCols.find(c => c.name === 'duration')) {
    await db.execute(`ALTER TABLE registrations ADD COLUMN duration TEXT`)
  }

  // Migration: add 'created_at' to admins if missing
  const adminColsRes = await db.execute("PRAGMA table_info(admins)")
  const adminCols = adminColsRes.rows as unknown as { name: string }[]
  if (!adminCols.find(c => c.name === 'created_at')) {
    await db.execute(`ALTER TABLE admins ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP`)
  }

  // Ensure a master admin exists
  const masterCountRes = await db.execute(`SELECT COUNT(*) as cnt FROM admins WHERE role = 'master'`)
  const masterCount = masterCountRes.rows[0]?.cnt as number
  
  if (masterCount === 0) {
    const firstAdminRes = await db.execute(`SELECT id FROM admins LIMIT 1`)
    const firstAdmin = firstAdminRes.rows[0] as { id: number } | undefined
    if (firstAdmin) {
      await db.execute({
        sql: `UPDATE admins SET role = 'master' WHERE id = ?`,
        args: [firstAdmin.id]
      })
      console.log('[DB] First admin promoted to master role.')
    }
  }

  console.log('[DB] Database initialized successfully.')
}
