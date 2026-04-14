export default defineEventHandler(async (event) => {
  const session = await requireAdminSession(event, true) // master only
  const id = getRouterParam(event, 'id')
  const db = getDb()

  // Prevent self-deletion
  const currentRes = await db.execute({
    sql: `SELECT id FROM admins WHERE username = ?`,
    args: [session.data.adminUsername]
  })
  const current = currentRes.rows[0] as unknown as { id: number } | undefined
  if (current && String(current.id) === String(id)) {
    throw createError({ statusCode: 400, statusMessage: 'You cannot delete your own account.' })
  }

  await db.execute({
    sql: `DELETE FROM admins WHERE id = ?`,
    args: [id]
  })
  return { status: 'success', message: 'Admin deleted.' }
})
