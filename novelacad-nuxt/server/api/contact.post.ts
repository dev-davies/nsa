export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  const { valid, error } = validateAntiBot(body)
  if (!valid) {
    throw createError({ statusCode: 400, statusMessage: error })
  }

  const { name, email, subject, message } = body
  if (!name || !email || !message) {
    throw createError({ statusCode: 400, statusMessage: 'Please fill in all required fields.' })
  }

  const db = getDb()
  db.prepare(`INSERT INTO messages (name, email, subject, message, submitted_at)
              VALUES (?, ?, ?, ?, datetime('now', '+1 hours'))`)
    .run(name, email, subject || '', message)

  // Send notification email (non-blocking failure)
  try {
    const config = useRuntimeConfig()
    const adminEmail = config.mailFrom as string
    await sendMail({
      to: adminEmail,
      subject: `New Contact Message from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\nSubject: ${subject || 'N/A'}\n\nMessage:\n${message}`,
    })
  } catch (e) {
    console.error('[Mailer] Failed to send contact notification:', e)
  }

  return { status: 'success', message: 'Your message has been sent successfully!' }
})
