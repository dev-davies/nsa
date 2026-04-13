export default defineEventHandler(async (event) => {
  await requireAdminSession(event)
  const db = getDb()
  const registrations = db.prepare(
    `SELECT id, full_name, email, phone, course, submitted_at FROM registrations ORDER BY submitted_at DESC`
  ).all()
  return registrations
})
