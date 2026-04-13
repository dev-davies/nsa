export default defineEventHandler(async (event) => {
  await requireAdminSession(event)
  const id = getRouterParam(event, 'id')
  const db = getDb()
  const reg = db.prepare(`SELECT * FROM registrations WHERE id = ?`).get(id)
  if (!reg) throw createError({ statusCode: 404, statusMessage: 'Registration not found.' })
  return reg
})
