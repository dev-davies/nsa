export default defineEventHandler(async (event) => {
  const session = await requireAdminSession(event, true) // master only
  const id = getRouterParam(event, 'id')
  const db = getDb()

  // Prevent self-deletion
  const current = db.prepare(`SELECT id FROM admins WHERE username = ?`).get(session.data.adminUsername) as { id: number } | undefined
  if (current && String(current.id) === String(id)) {
    throw createError({ statusCode: 400, statusMessage: 'You cannot delete your own account.' })
  }

  db.prepare(`DELETE FROM admins WHERE id = ?`).run(id)
  return { status: 'success', message: 'Admin deleted.' }
})
