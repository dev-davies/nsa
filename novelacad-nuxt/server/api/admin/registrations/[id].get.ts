export default defineEventHandler(async (event) => {
  await requireAdminSession(event)
  const id = getRouterParam(event, 'id')
  const db = getDb()
  const res = await db.execute({
    sql: `SELECT * FROM registrations WHERE id = ?`,
    args: [id]
  })
  const reg = res.rows[0]
  if (!reg) throw createError({ statusCode: 404, statusMessage: 'Registration not found.' })
  return reg
})
