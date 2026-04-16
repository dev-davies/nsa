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

  const config = useRuntimeConfig()
  const siteUrl = config.siteUrl as string
  const firstName = String(body.fullName).split(' ')[0]

  // Send applicant confirmation email
  try {
    await sendMail({
      to: body.email,
      subject: 'Novel Academy: Application Received ✅',
      text: `Hi ${firstName},\n\nThank you for applying to Novel Academy for the ${body.course} programme. Our team will be in touch with you shortly.\n\nBest regards,\nThe Novel Academy Team`,
      html: registrationConfirmationHtml(siteUrl, firstName, body.course),
    })
  } catch (e) {
    console.error('[Mailer] Failed to send applicant confirmation:', e)
  }

  // Send admin notification email
  try {
    await sendMail({
      to: config.mailFrom as string,
      subject: `New Registration: ${body.fullName} — ${body.course}`,
      text: `A new application has been submitted by ${body.fullName} (${body.email}) for the ${body.course} course. Log in to the admin dashboard to review.`,
      html: registrationAdminHtml(siteUrl, {
        fullName: body.fullName,
        email: body.email,
        phone: body.phoneNumber,
        course: body.course,
        nationality: body.nationality,
        state: body.state,
        educationLevel: body.educationLevel,
      }),
    })
  } catch (e) {
    console.error('[Mailer] Failed to send admin notification:', e)
  }

  return { status: 'success', message: 'Registration received', redirect: '/thank-you' }
})

