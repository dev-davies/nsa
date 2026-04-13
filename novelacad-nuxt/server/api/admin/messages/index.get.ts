export default defineEventHandler(async (event) => {
  await requireAdminSession(event)
  const db = getDb()
  const messages = db.prepare(
    `SELECT * FROM messages ORDER BY submitted_at DESC`
  ).all()
  return messages
})
