export default defineEventHandler(async (event) => {
  await requireAdminSession(event)
  const db = getDb()
  const res = await db.execute(
    `SELECT id, username, email, role, created_at FROM admins ORDER BY created_at DESC`
  )
  return res.rows
})
