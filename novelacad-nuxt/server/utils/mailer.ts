import nodemailer from 'nodemailer'

let transporter: nodemailer.Transporter | null = null

function getTransporter() {
  if (transporter) return transporter

  const config = useRuntimeConfig()
  const port = parseInt(config.mailPort as string)
  transporter = nodemailer.createTransport({
    host: config.mailHost as string,
    port,
    secure: port === 465,
    auth: {
      user: config.mailUser as string,
      pass: config.mailPass as string,
    },
  })
  return transporter
}

export async function sendMail(options: {
  to: string | string[]
  subject: string
  text: string
  html?: string
}) {
  const config = useRuntimeConfig()
  const t = getTransporter()

  return t.sendMail({
    from: config.mailFrom as string,
    to: options.to,
    subject: options.subject,
    text: options.text,
    html: options.html,
  })
}
