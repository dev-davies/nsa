// ─── Shared layout ───────────────────────────────────────────────────────────

function emailLayout(siteUrl: string, bodyContent: string): string {
  const logoUrl = `${siteUrl}/img/novel_logo-removebg-preview.png`
  const year = new Date().getFullYear()

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Novel Academy</title>
</head>
<body style="margin:0;padding:0;background-color:#f1f5f9;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f1f5f9;padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

          <!-- ── Header ──────────────────────────────────────────────────── -->
          <tr>
            <td style="background:linear-gradient(135deg,#0b0f2b 0%,#1a2463 100%);border-radius:16px 16px 0 0;padding:28px 40px;text-align:center;">
              <img src="${logoUrl}" alt="Novel Academy" width="60" height="60"
                   style="display:inline-block;vertical-align:middle;margin-right:12px;object-fit:contain;" />
              <span style="display:inline-block;vertical-align:middle;font-size:20px;font-weight:800;color:#ffffff;letter-spacing:1px;">
                NOVEL ACADEMY
              </span>
              <p style="margin:8px 0 0;font-size:12px;color:#94a3b8;letter-spacing:0.5px;">
                Where Innovation Meets Sustainability
              </p>
            </td>
          </tr>

          <!-- ── Body ───────────────────────────────────────────────────── -->
          <tr>
            <td style="background:#ffffff;padding:40px;border-left:1px solid #e2e8f0;border-right:1px solid #e2e8f0;">
              ${bodyContent}
            </td>
          </tr>

          <!-- ── Footer ─────────────────────────────────────────────────── -->
          <tr>
            <td style="background:#0b0f2b;border-radius:0 0 16px 16px;padding:28px 40px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding-bottom:16px;border-bottom:1px solid rgba(255,255,255,0.1);margin-bottom:16px;">
                    <!-- Contact details -->
                    <table cellpadding="0" cellspacing="0" width="100%">
                      <tr>
                        <td width="33%" style="padding:4px 0;vertical-align:top;">
                          <span style="font-size:11px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:1px;display:block;margin-bottom:4px;">Address</span>
                          <span style="font-size:12px;color:#94a3b8;line-height:1.6;">
                            76, Adekunle Fajuyi Rd, Ibadan<br/>Opp. Gate 3, Adamasingba Stadium<br/>Oyo State, Nigeria
                          </span>
                        </td>
                        <td width="34%" style="padding:4px 0;vertical-align:top;text-align:center;">
                          <span style="font-size:11px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:1px;display:block;margin-bottom:4px;">Call Us</span>
                          <a href="tel:+2348113695917" style="font-size:12px;color:#94a3b8;text-decoration:none;">+234 811 369 5917</a>
                        </td>
                        <td width="33%" style="padding:4px 0;vertical-align:top;text-align:right;">
                          <span style="font-size:11px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:1px;display:block;margin-bottom:4px;">Email</span>
                          <a href="mailto:info@novel-academy.com" style="font-size:12px;color:#94a3b8;text-decoration:none;">info@novel-academy.com</a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="padding-top:16px;text-align:center;">
                    <p style="margin:0;font-size:11px;color:#475569;">
                      &copy; ${year} Novel Academy. All Rights Reserved.
                    </p>
                    <p style="margin:6px 0 0;font-size:11px;color:#334155;">
                      <a href="${siteUrl}" style="color:#60a5fa;text-decoration:none;">${siteUrl.replace('https://', '')}</a>
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}

// ─── Template: Registration confirmation (→ applicant) ────────────────────────

export function registrationConfirmationHtml(siteUrl: string, firstName: string, course: string): string {
  const body = `
    <h1 style="margin:0 0 8px;font-size:26px;font-weight:800;color:#0b0f2b;">
      Application Received! 🎉
    </h1>
    <p style="margin:0 0 24px;font-size:14px;color:#64748b;">
      We're glad to hear from you.
    </p>

    <p style="margin:0 0 16px;font-size:15px;color:#1e293b;line-height:1.7;">
      Hi <strong>${firstName}</strong>,
    </p>
    <p style="margin:0 0 16px;font-size:15px;color:#1e293b;line-height:1.7;">
      Thank you for submitting your application to <strong>Novel Academy</strong>.
      We have successfully received your details for the
      <strong style="color:#2563eb;">${course}</strong> programme.
    </p>
    <p style="margin:0 0 28px;font-size:15px;color:#1e293b;line-height:1.7;">
      Our admissions team will review your information shortly and reach out
      to guide you through the next steps.
    </p>

    <!-- Info box -->
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
      <tr>
        <td style="background:#eff6ff;border-left:4px solid #2563eb;border-radius:0 8px 8px 0;padding:16px 20px;">
          <p style="margin:0;font-size:13px;color:#1e40af;font-weight:600;">What happens next?</p>
          <ul style="margin:8px 0 0;padding-left:18px;font-size:13px;color:#1e3a8a;line-height:2;">
            <li>Our team will contact you within 1–3 business days</li>
            <li>You may be asked to attend a brief orientation session</li>
            <li>Payment and enrolment details will be communicated to you</li>
          </ul>
        </td>
      </tr>
    </table>

    <!-- CTA Button -->
    <table cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
      <tr>
        <td style="background:linear-gradient(135deg,#2563eb,#1d4ed8);border-radius:10px;padding:14px 32px;text-align:center;">
          <a href="${siteUrl}" style="color:#ffffff;font-size:14px;font-weight:700;text-decoration:none;letter-spacing:0.3px;">
            Visit Our Website
          </a>
        </td>
      </tr>
    </table>

    <p style="margin:0;font-size:14px;color:#64748b;line-height:1.7;">
      If you have any questions in the meantime, feel free to reply to this email
      or call us at <a href="tel:+2348113695917" style="color:#2563eb;">+234 811 369 5917</a>.
    </p>

    <p style="margin:28px 0 0;font-size:14px;color:#1e293b;">
      Warm regards,<br />
      <strong>The Novel Academy Team</strong>
    </p>
  `
  return emailLayout(siteUrl, body)
}

// ─── Template: New registration notification (→ admin) ────────────────────────

export function registrationAdminHtml(siteUrl: string, data: {
  fullName: string
  email: string
  phone: string
  course: string
  nationality: string
  state: string
  educationLevel: string
}): string {
  const adminUrl = `${siteUrl}/admin/dashboard`

  const row = (label: string, value: string) => `
    <tr>
      <td style="padding:10px 16px;font-size:13px;font-weight:600;color:#475569;background:#f8fafc;border-bottom:1px solid #e2e8f0;white-space:nowrap;width:140px;">
        ${label}
      </td>
      <td style="padding:10px 16px;font-size:13px;color:#1e293b;border-bottom:1px solid #e2e8f0;">
        ${value}
      </td>
    </tr>
  `

  const body = `
    <p style="margin:0 0 4px;font-size:12px;font-weight:700;color:#2563eb;text-transform:uppercase;letter-spacing:1px;">
      ⚡ New Application
    </p>
    <h1 style="margin:0 0 24px;font-size:24px;font-weight:800;color:#0b0f2b;">
      ${data.fullName}
    </h1>

    <p style="margin:0 0 16px;font-size:14px;color:#475569;">
      A new registration has been submitted. Details are listed below:
    </p>

    <!-- Applicant table -->
    <table width="100%" cellpadding="0" cellspacing="0"
           style="border:1px solid #e2e8f0;border-radius:10px;overflow:hidden;margin-bottom:28px;">
      ${row('Full Name', data.fullName)}
      ${row('Email', `<a href="mailto:${data.email}" style="color:#2563eb;">${data.email}</a>`)}
      ${row('Phone', `<a href="tel:${data.phone}" style="color:#2563eb;">${data.phone}</a>`)}
      ${row('Course', `<strong style="color:#2563eb;">${data.course}</strong>`)}
      ${row('Nationality', data.nationality)}
      ${row('State', data.state)}
      ${row('Education Level', data.educationLevel)}
    </table>

    <!-- CTA Button -->
    <table cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
      <tr>
        <td style="background:linear-gradient(135deg,#0b0f2b,#1a2463);border-radius:10px;padding:14px 32px;text-align:center;">
          <a href="${adminUrl}" style="color:#ffffff;font-size:14px;font-weight:700;text-decoration:none;">
            View in Admin Dashboard →
          </a>
        </td>
      </tr>
    </table>

    <p style="margin:0;font-size:12px;color:#94a3b8;">
      This is an automated notification. Do not reply directly to this email.
    </p>
  `
  return emailLayout(siteUrl, body)
}

// ─── Template: New contact message notification (→ admin) ─────────────────────

export function contactAdminHtml(siteUrl: string, data: {
  name: string
  email: string
  subject: string
  message: string
}): string {
  return emailLayout(siteUrl, `
    <p style="margin:0 0 4px;font-size:12px;font-weight:700;color:#16a34a;text-transform:uppercase;letter-spacing:1px;">
      💬 New Contact Message
    </p>
    <h1 style="margin:0 0 24px;font-size:24px;font-weight:800;color:#0b0f2b;">
      ${data.subject || 'No Subject'}
    </h1>

    <p style="margin:0 0 16px;font-size:14px;color:#475569;">
      A visitor has sent a message through the website contact form.
    </p>

    <!-- Sender details -->
    <table width="100%" cellpadding="0" cellspacing="0"
           style="border:1px solid #e2e8f0;border-radius:10px;overflow:hidden;margin-bottom:24px;">
      <tr>
        <td style="padding:10px 16px;font-size:13px;font-weight:600;color:#475569;background:#f8fafc;border-bottom:1px solid #e2e8f0;width:100px;">
          From
        </td>
        <td style="padding:10px 16px;font-size:13px;color:#1e293b;border-bottom:1px solid #e2e8f0;">
          <strong>${data.name}</strong>
        </td>
      </tr>
      <tr>
        <td style="padding:10px 16px;font-size:13px;font-weight:600;color:#475569;background:#f8fafc;border-bottom:1px solid #e2e8f0;">
          Reply-To
        </td>
        <td style="padding:10px 16px;font-size:13px;border-bottom:1px solid #e2e8f0;">
          <a href="mailto:${data.email}" style="color:#2563eb;">${data.email}</a>
        </td>
      </tr>
      <tr>
        <td style="padding:10px 16px;font-size:13px;font-weight:600;color:#475569;background:#f8fafc;">
          Subject
        </td>
        <td style="padding:10px 16px;font-size:13px;color:#1e293b;">
          ${data.subject || 'N/A'}
        </td>
      </tr>
    </table>

    <!-- Message body -->
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
      <tr>
        <td style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:20px;">
          <p style="margin:0 0 8px;font-size:11px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:1px;">
            Message
          </p>
          <p style="margin:0;font-size:14px;color:#1e293b;line-height:1.8;white-space:pre-wrap;">${data.message}</p>
        </td>
      </tr>
    </table>

    <!-- Reply CTA -->
    <table cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
      <tr>
        <td style="background:linear-gradient(135deg,#16a34a,#15803d);border-radius:10px;padding:14px 32px;text-align:center;">
          <a href="mailto:${data.email}?subject=Re: ${encodeURIComponent(data.subject || 'Your message')}"
             style="color:#ffffff;font-size:14px;font-weight:700;text-decoration:none;">
            Reply to ${data.name} →
          </a>
        </td>
      </tr>
    </table>

    <p style="margin:0;font-size:12px;color:#94a3b8;">
      This is an automated notification. Click the button above to reply directly to the sender.
    </p>
  `)
}
