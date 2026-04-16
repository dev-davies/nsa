export default defineEventHandler(async (event) => {
  await requireAdminSession(event)
  const id = getRouterParam(event, 'id')
  const db = getDb()
  await db.execute({
    sql: `DELETE FROM messages WHERE id = ?`,
    args: [id]
  })
  return { status: 'success', message: `Message #${id} deleted.` }
})
