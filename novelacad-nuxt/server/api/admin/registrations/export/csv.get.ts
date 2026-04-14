export default defineEventHandler(async (event) => {
  await requireAdminSession(event)
  const db = getDb()

  const res = await db.execute(
    `SELECT id, full_name, email, phone, course, submitted_at FROM registrations ORDER BY submitted_at DESC`
  )
  const registrations = res.rows as unknown as Record<string, unknown>[]

  const headers = ['ID', 'Full Name', 'Email', 'Phone', 'Course', 'Submitted At']
  const rows = registrations.map(r => [
    r.id, r.full_name, r.email, r.phone, r.course, r.submitted_at
  ])

  const csvLines = [headers, ...rows].map(row =>
    row.map(cell => `"${String(cell ?? '').replace(/"/g, '""')}"`).join(',')
  )
  const csv = csvLines.join('\r\n')

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19)
  setResponseHeaders(event, {
    'Content-Type': 'text/csv',
    'Content-Disposition': `attachment; filename="registrations_${timestamp}.csv"`,
  })

  return csv
})
