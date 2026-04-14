import PDFDocument from 'pdfkit'

export default defineEventHandler(async (event) => {
  await requireAdminSession(event)
  
  const db = getDb()
  const query = getQuery(event)
  
  // Get filter parameters
  const exportType = String(query.export_type || 'all')
  const selectedIds = typeof query.selected_ids === 'string' 
    ? query.selected_ids.split(',').map(id => parseInt(id)) 
    : Array.isArray(query.selected_ids) 
    ? (query.selected_ids as string[]).map(id => parseInt(id))
    : []
  const startDate = String(query.start_date || '')
  const endDate = String(query.end_date || '')

  // Build query based on export type
  let sqlQuery = `
    SELECT
      id,
      full_name,
      email,
      phone,
      dob,
      address,
      sex,
      nationality,
      state,
      course,
      duration,
      level,
      qualification,
      goals,
      experience,
      info_source,
      submitted_at
    FROM registrations
  `.trim()
  const params: any[] = []

  if (exportType === 'selected' && selectedIds.length > 0) {
    const placeholders = selectedIds.map(() => '?').join(',')
    sqlQuery += ` WHERE id IN (${placeholders})`
    params.push(...selectedIds)
  } else if (exportType === 'date_range' && startDate && endDate) {
    sqlQuery += ` WHERE submitted_at >= ? AND submitted_at < ?`
    params.push(startDate, endDate)
  }

  sqlQuery += ` ORDER BY submitted_at DESC`

  const res = await db.execute({
    sql: sqlQuery,
    args: params
  })
  const registrations = res.rows as unknown as Array<{
    id: number
    full_name: string
    email: string
    phone: string
    dob: string
    address: string
    sex: string
    nationality: string
    state: string
    course: string
    duration: string | null
    level: string
    qualification: string | null
    goals: string | null
    experience: string | null
    info_source: string | null
    submitted_at: string
  }>

  // Create PDF in memory
  const doc = new PDFDocument({
    size: 'A4',
    margin: 40,
  })

  // PDF Title
  doc.fontSize(18).font('Helvetica-Bold').text('Course Registrations Report', { align: 'center' })
  doc.moveDown(0.5)
  doc.fontSize(10).font('Helvetica').text(
    `Generated: ${new Date().toISOString().split('T')[0]}`,
    { align: 'center' }
  )
  doc.moveDown(1)

  const left = doc.page.margins.left
  const right = doc.page.width - doc.page.margins.right
  const contentWidth = right - left

  const labelWidth = Math.min(150, Math.floor(contentWidth * 0.32))
  const valueWidth = contentWidth - labelWidth

  function formatValue(v: unknown) {
    if (v === null || v === undefined) return '—'
    const s = String(v).trim()
    return s ? s : '—'
  }

  function drawField(label: string, value: unknown) {
    const y = doc.y
    doc.font('Helvetica-Bold').fillColor('#111827').text(label, left, y, { width: labelWidth })
    doc.font('Helvetica').fillColor('#111827').text(formatValue(value), left + labelWidth, y, {
      width: valueWidth,
      lineGap: 2,
    })
    doc.moveDown(0.6)
  }

  function drawRegistrationDetails(reg: (typeof registrations)[number], idx: number) {
    if (idx > 0) doc.addPage()

    // Header block
    doc.fillColor('#111827').font('Helvetica-Bold').fontSize(14).text(`Registration #${reg.id}`, { align: 'left' })
    doc.moveDown(0.25)
    doc.font('Helvetica').fontSize(10).fillColor('#6B7280').text(`Submitted: ${formatValue(reg.submitted_at)}`)
    doc.moveDown(0.8)

    // Divider
    const y = doc.y
    doc.moveTo(left, y).lineTo(right, y).lineWidth(1).strokeColor('#E5E7EB').stroke()
    doc.moveDown(1)

    // Core details
    doc.fontSize(10)
    drawField('Full name', reg.full_name)
    drawField('Email', reg.email)
    drawField('Phone', reg.phone)
    drawField('Date of birth', reg.dob)
    drawField('Sex', reg.sex)
    drawField('Nationality', reg.nationality)
    drawField('State', reg.state)
    drawField('Address', reg.address)

    doc.moveDown(0.3)
    const y2 = doc.y
    doc.moveTo(left, y2).lineTo(right, y2).lineWidth(1).strokeColor('#F3F4F6').stroke()
    doc.moveDown(0.8)

    // Course details
    doc.font('Helvetica-Bold').fillColor('#111827').fontSize(11).text('Course details')
    doc.moveDown(0.6)
    doc.fontSize(10).font('Helvetica')
    drawField('Course', reg.course)
    drawField('Duration', reg.duration)
    drawField('Education level', reg.level)
    drawField('Qualification', reg.qualification)
    drawField('Goals', reg.goals)
    drawField('Experience', reg.experience)
    drawField('Info source', reg.info_source)
  }

  registrations.forEach(drawRegistrationDetails)

  // Add footer with totals
  doc.moveDown(1)
  doc.fontSize(10).font('Helvetica-Bold').text(`Total Registrations: ${registrations.length}`)

  // Finalize PDF
  const filename = `registrations_${new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19)}.pdf`
  
  setResponseHeaders(event, {
    'Content-Type': 'application/pdf',
    'Content-Disposition': `attachment; filename="${filename}"`,
  })

  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = []
    
    doc.on('data', (chunk: Buffer) => {
      chunks.push(chunk)
    })
    
    doc.on('end', () => {
      resolve(Buffer.concat(chunks))
    })
    
    doc.on('error', (err) => {
      reject(err)
    })
    
    doc.end()
  })
})
