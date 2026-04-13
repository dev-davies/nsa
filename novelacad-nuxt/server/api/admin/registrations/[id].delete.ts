export default defineEventHandler(async (event) => {
  await requireAdminSession(event)
  const id = getRouterParam(event, 'id')
  const db = getDb()
  db.prepare(`DELETE FROM registrations WHERE id = ?`).run(id)
  return { status: 'success', message: `Registration #${id} deleted.` }
})
