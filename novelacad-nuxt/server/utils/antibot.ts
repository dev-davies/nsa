import type { H3Event } from 'h3'
import { getHeader } from 'h3'

interface AntibotData {
  website?: string
  email_confirm?: string
  _form_start_time?: string | number
  fullName?: string
  email?: string
  [key: string]: unknown
}

export function validateAntiBot(data: AntibotData): { valid: boolean; error?: string } {
  // Honeypot checks
  if (data.website && String(data.website).trim()) {
    return { valid: false, error: 'Invalid submission detected.' }
  }
  if (data.email_confirm && String(data.email_confirm).trim()) {
    return { valid: false, error: 'Invalid submission detected.' }
  }

  // Timing check
  const formStart = parseFloat(String(data._form_start_time || '0'))
  if (!formStart) {
    return { valid: false, error: 'Form timing validation failed. Please refresh and try again.' }
  }

  const elapsed = Date.now() / 1000 - formStart

  if (elapsed < 2) {
    return { valid: false, error: 'Form submitted too quickly. Please take your time filling out all fields carefully.' }
  }
  if (elapsed < 3 && data.fullName) {
    return { valid: false, error: 'Form submitted too quickly. Please ensure all fields are completed accurately.' }
  }
  if (elapsed > 3600) {
    return { valid: false, error: 'Form session expired. Please refresh the page and try again.' }
  }

  // Name === email bot check
  if (data.fullName && data.email) {
    if (String(data.fullName).toLowerCase() === String(data.email).toLowerCase()) {
      return { valid: false, error: 'Invalid form data detected.' }
    }
  }

  return { valid: true }
}
