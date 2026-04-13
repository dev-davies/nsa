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
  let sqlQuery = `SELECT id, full_name, email, phone, course, submitted_at FROM registrations`
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
    course: string
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

  // Table headers
  const tableTop = doc.y
  const col1 = 50
  const col2 = 150
  const col3 = 250
  const col4 = 350
  const col5 = 420
  const col6 = 500
  const rowHeight = 20

  doc.fontSize(9).font('Helvetica-Bold')
  doc.fillColor('#2878EB').rect(col1 - 10, tableTop, 490, rowHeight).fill()
  doc.fillColor('#000000')

  const headers = ['ID', 'Full Name', 'Email', 'Phone', 'Course', 'Submitted At']
  doc.fillColor('#FFFFFF')
  doc.text('ID', col1, tableTop + 5, { width: 90, align: 'left' })
  doc.text('Full Name', col2, tableTop + 5, { width: 90, align: 'left' })
  doc.text('Email', col3, tableTop + 5, { width: 90, align: 'left' })
  doc.text('Phone', col4, tableTop + 5, { width: 60, align: 'left' })
  doc.text('Course', col5, tableTop + 5, { width: 70, align: 'left' })
  doc.text('Submitted', col6, tableTop + 5, { width: 60, align: 'left' })

  // Table rows
  doc.fillColor('#000000')
  doc.font('Helvetica')
  doc.fontSize(8)

  let currentY = tableTop + rowHeight
  let isAlternate = false

  for (const reg of registrations) {
    // Alternate row colors
    if (isAlternate) {
      doc.fillColor('#F5F5F5').rect(col1 - 10, currentY, 490, rowHeight).fill()
      doc.fillColor('#000000')
    }

    doc.text(String(reg.id), col1, currentY + 3, { width: 90, align: 'left' })
    doc.text(reg.full_name, col2, currentY + 3, { width: 90, align: 'left' })
    doc.text(reg.email, col3, currentY + 3, { width: 90, align: 'left' })
    doc.text(reg.phone, col4, currentY + 3, { width: 60, align: 'left' })
    doc.text(reg.course, col5, currentY + 3, { width: 70, align: 'left' })
    doc.text(reg.submitted_at, col6, currentY + 3, { width: 60, align: 'left' })

    currentY += rowHeight
    isAlternate = !isAlternate

    // Add new page if content exceeds page height
    if (currentY > 750) {
      doc.addPage()
      currentY = 40
      isAlternate = false
    }
  }

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
