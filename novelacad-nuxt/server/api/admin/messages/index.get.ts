export default defineEventHandler(async (event) => {
  await requireAdminSession(event)
  const db = getDb()
  const res = await db.execute(
    `SELECT * FROM messages ORDER BY submitted_at DESC`
  )
  return res.rows
})
