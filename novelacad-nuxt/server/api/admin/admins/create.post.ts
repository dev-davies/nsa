export default defineEventHandler(async (event) => {
  await requireAdminSession(event, true) // master only
  const { username, email, password, role } = await readBody(event)

  if (!username || !email || !password) {
    throw createError({ statusCode: 400, statusMessage: 'All fields are required.' })
  }

  const validRole = ['admin', 'master'].includes(role) ? role : 'admin'
  const hash = await hashPassword(password)

  const db = getDb()
  try {
    await db.execute({
      sql: `INSERT INTO admins (username, email, role, password_hash) VALUES (?,?,?,?)`,
      args: [username, email, validRole, hash]
    })
  } catch (e: any) {
    if (e.message?.includes('UNIQUE constraint')) {
      throw createError({ statusCode: 409, statusMessage: 'Username or email already exists.' })
    }
    throw e
  }

  return { status: 'success', message: `Admin '${username}' created.` }
})
