export default defineEventHandler(async (event) => {
  await requireAdminSession(event)
  const id = getRouterParam(event, 'id')
  const body = await readBody(event)

  const db = getDb()
  const existingRes = await db.execute({
    sql: `SELECT id FROM registrations WHERE id = ?`,
    args: [id]
  })
  if (existingRes.rows.length === 0) throw createError({ statusCode: 404, statusMessage: 'Registration not found.' })

  await db.execute({
    sql: `
    UPDATE registrations
    SET full_name=?, email=?, phone=?, course=?, level=?, dob=?,
        address=?, sex=?, nationality=?, state=?, duration=?,
        qualification=?, goals=?, experience=?, info_source=?
    WHERE id=?
  `,
    args: [
      body.full_name, body.email, body.phone, body.course, body.level,
      body.dob, body.address, body.sex, body.nationality, body.state,
      body.duration, body.qualification, body.goals, body.experience,
      body.info_source, id
    ]
  })

  return { status: 'success', message: 'Registration updated.' }
})
