import crypto from 'node:crypto'

export default defineEventHandler(async (event) => {
  const { token, password, passwordConfirm } = await readBody(event)

  if (!token || !password) {
    throw createError({ statusCode: 400, statusMessage: 'Token and password are required.' })
  }

  if (password !== passwordConfirm) {
    throw createError({ statusCode: 400, statusMessage: 'Passwords do not match.' })
  }

  if (password.length < 8) {
    throw createError({ statusCode: 400, statusMessage: 'Password must be at least 8 characters.' })
  }

  // Hash the token to find the admin
  const tokenHash = crypto.createHash('sha256').update(token).digest('hex')

  const db = getDb()
  const adminRes = await db.execute({
    sql: `
    SELECT id FROM admins 
    WHERE reset_token = ? AND reset_token_expires > datetime('now')
  `,
    args: [tokenHash]
  })
  const admin = adminRes.rows[0] as unknown as { id: number } | undefined

  if (!admin) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid or expired reset token. Please request a new password reset.',
    })
  }

  // Hash new password and update database
  const passwordHash = await hashPassword(password)

  await db.execute({
    sql: `
    UPDATE admins 
    SET password_hash = ?, reset_token = NULL, reset_token_expires = NULL
    WHERE id = ?
  `,
    args: [passwordHash, admin.id]
  })

  return {
    status: 'success',
    message: 'Password reset successfully. You can now log in with your new password.',
  }
})
