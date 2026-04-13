
export default defineEventHandler(async (event) => {
  const { username, password } = await readBody(event)

  if (!username || !password) {
    throw createError({ statusCode: 400, statusMessage: 'Username and password are required.' })
  }

  const db = getDb()
  const admin = db.prepare(`SELECT * FROM admins WHERE username = ?`).get(username) as {
    id: number; username: string; email: string; role: string; password_hash: string
  } | undefined

  if (!admin || !(await verifyPassword(password, admin.password_hash))) {
    throw createError({ statusCode: 401, statusMessage: 'Invalid username or password.' })
  }

  const session = await getAdminSession(event)
  await session.update({
    adminLoggedIn: true,
    adminRole: admin.role,
    adminUsername: admin.username,
  })

  return { status: 'success', role: admin.role }
})

