const REQUIRED_FIELDS = [
  'fullName', 'email', 'phoneNumber', 'dob', 'sex',
  'nationality', 'state', 'course', 'educationLevel',
  'qualification', 'courseGoals', 'infoSource'
]

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  const { valid, error } = validateAntiBot(body)
  if (!valid) {
    throw createError({ statusCode: 400, statusMessage: error })
  }

  const missing = REQUIRED_FIELDS.filter(f => !body[f])
  if (missing.length) {
    throw createError({ statusCode: 400, statusMessage: 'Please fill in all required fields.' })
  }

  const db = getDb()
  await db.execute({
    sql: `
    INSERT INTO registrations
      (full_name, email, phone, dob, address, sex, nationality, state, course,
       duration, level, qualification, goals, experience, info_source, submitted_at)
    VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?, datetime('now', '+1 hours'))
  `,
    args: [
      body.fullName, body.email, body.phoneNumber, body.dob,
      body.address || '', body.sex, body.nationality, body.state,
      body.course, body.duration || null, body.educationLevel,
      body.qualification, body.courseGoals, body.experience || null,
      body.infoSource
    ]
  })

  // Send applicant confirmation email
  const nameParts = String(body.fullName).split(' ')
  const firstName = nameParts[0]
  try {
    await sendMail({
      to: body.email,
      subject: 'Novel Academy: Application Received',
      text: `Hi ${firstName},\n\nThank you for submitting your details to Novel Academy. We have successfully received your application.\n\nOur team will review your information shortly and will be in touch soon to outline the next steps.\n\nBest regards,\nThe Novel Academy Team`,
    })
  } catch (e) {
    console.error('[Mailer] Failed to send applicant confirmation:', e)
  }

  // Send admin notification email
  try {
    const config = useRuntimeConfig()
    await sendMail({
      to: config.mailFrom as string,
      subject: `New Registration: ${body.fullName}`,
      text: `A new application has been submitted by ${body.fullName} for the ${body.course} course. Please log in to the admin dashboard to view the full details.`,
    })
  } catch (e) {
    console.error('[Mailer] Failed to send admin notification:', e)
  }

  return { status: 'success', message: 'Registration received', redirect: '/thank-you' }
})
