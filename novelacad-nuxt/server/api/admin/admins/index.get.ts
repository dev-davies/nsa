export default defineEventHandler(async (event) => {
  await requireAdminSession(event)
  const db = getDb()
  const admins = db.prepare(
    `SELECT id, username, email, role, created_at FROM admins ORDER BY created_at DESC`
  ).all()
  return admins
})
