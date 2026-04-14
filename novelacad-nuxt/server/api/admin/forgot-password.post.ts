export default defineEventHandler(async (event) => {
  const { email } = await readBody(event)

  if (!email || !email.includes('@')) {
    throw createError({ statusCode: 400, statusMessage: 'Valid email is required.' })
  }

  const db = getDb()
  const adminRes = await db.execute({
    sql: `SELECT id, username, email FROM admins WHERE email = ?`,
    args: [email]
  })
  const admin = adminRes.rows[0] as unknown as {
    id: number
    username: string
    email: string
  } | undefined

  if (!admin) {
    // Don't reveal if email exists for security
    return { status: 'success', message: 'If an account exists with this email, a reset link has been sent.' }
  }

  // Generate reset token
  const { token, hash } = generateResetToken()
  const expiresAt = getResetTokenExpiry()

  // Store hashed token in database (never store plaintext tokens)
  await db.execute({
    sql: `
    UPDATE admins 
    SET reset_token = ?, reset_token_expires = ?
    WHERE id = ?
  `,
    args: [hash, expiresAt, admin.id]
  })

  // Send reset email
  const config = useRuntimeConfig()
  const resetUrl = `${process.env.NUXT_PUBLIC_API_BASE || 'https://novel-academy.com'}/admin/reset-password/${token}`

  try {
    await sendMail({
      to: admin.email,
      subject: 'Novel Academy - Password Reset Request',
      text: `Hi ${admin.username},

You requested a password reset. Click the link below to reset your password:

${resetUrl}

This link will expire in 24 hours.

If you didn't request a password reset, you can safely ignore this email.

Best regards,
The Novel Academy Team`,
      html: `
        <h2>Password Reset Request</h2>
        <p>Hi ${admin.username},</p>
        <p>You requested a password reset. Click the button below to reset your password:</p>
        <p>
          <a href="${resetUrl}" style="display: inline-block; padding: 12px 24px; background-color: #2878EB; color: white; text-decoration: none; border-radius: 8px; font-weight: bold;">
            Reset Password
          </a>
        </p>
        <p>Or copy this link: <code>${resetUrl}</code></p>
        <p><strong>This link will expire in 24 hours.</strong></p>
        <p>If you didn't request a password reset, you can safely ignore this email.</p>
        <p>Best regards,<br/>The Novel Academy Team</p>
      `,
    })
  } catch (e) {
    console.error('[Mailer] Failed to send password reset email:', e)
    // Don't fail the request - the token is still stored in database
  }

  return {
    status: 'success',
    message: 'If an account exists with this email, a reset link has been sent.',
  }
})
