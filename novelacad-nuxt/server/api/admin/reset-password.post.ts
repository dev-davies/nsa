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
  const admin = db.prepare(`
    SELECT id FROM admins 
    WHERE reset_token = ? AND reset_token_expires > datetime('now')
  `).get(tokenHash) as { id: number } | undefined

  if (!admin) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid or expired reset token. Please request a new password reset.',
    })
  }

  // Hash new password and update database
  const passwordHash = await hashPassword(password)

  db.prepare(`
    UPDATE admins 
    SET password_hash = ?, reset_token = NULL, reset_token_expires = NULL
    WHERE id = ?
  `).run(passwordHash, admin.id)

  return {
    status: 'success',
    message: 'Password reset successfully. You can now log in with your new password.',
  }
})
