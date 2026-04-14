export default defineEventHandler(async (event) => {
  await requireAdminSession(event)
  const id = getRouterParam(event, 'id')
  const db = getDb()
  await db.execute({
    sql: `DELETE FROM registrations WHERE id = ?`,
    args: [id]
  })
  return { status: 'success', message: `Registration #${id} deleted.` }
})
