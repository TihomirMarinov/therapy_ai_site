import nodemailer from 'nodemailer'
import type { SendMailOptions } from 'nodemailer'
import type { ContactData } from '../src/shared/contact'

export const contactMailbox = 'tihomir.marinov2102@gmail.com'
export type MailSender = (data: ContactData) => Promise<{ confirmationSent: boolean }>

export function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (character) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  })[character]!)
}

// Email clients need table layout and inline colors; website styles remain in CSS.
function emailLayout(title: string, content: string): string {
  return `<!doctype html>
<html lang="bg"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${title}</title></head>
<body style="margin:0;padding:0;background-color:#fbf7ef;color:#26342f;font-family:Arial,Helvetica,sans-serif;line-height:1.7;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#fbf7ef;"><tr><td align="center" style="padding:24px 12px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background-color:#ffffff;border:1px solid #d8e7d6;border-radius:8px;">
<tr><td style="padding:24px;background-color:#d8e7d6;border-radius:8px 8px 0 0;font-size:16px;font-weight:bold;">Екип психотерапевти</td></tr>
<tr><td style="padding:28px 24px;overflow-wrap:anywhere;word-break:break-word;"><h1 style="margin:0 0 20px;font-size:24px;line-height:1.35;color:#26342f;">${title}</h1>${content}</td></tr>
<tr><td style="padding:20px 24px;border-top:1px solid #d8e7d6;font-size:13px;color:#69766f;">Това е автоматично съобщение от контактната форма на нашия сайт.</td></tr>
</table></td></tr></table></body></html>`
}

export function createEmails(data: ContactData) {
  const name = escapeHtml(data.name)
  const email = escapeHtml(data.email)
  const message = escapeHtml(data.message).replace(/\r?\n/g, '<br>')
  return {
    inquiry: {
      subject: 'Ново запитване от сайта',
      text: `Ново запитване\n\nИме: ${data.name}\nИмейл: ${data.email}\n\n${data.message}`,
      html: emailLayout('Ново запитване', `<p><strong>Име:</strong> ${name}<br><strong>Имейл:</strong> ${email}</p><div style="padding:20px;background-color:#fbf7ef;border-left:4px solid #b9ddd2;">${message}</div>`),
    },
    confirmation: {
      subject: 'Получихме Вашето запитване',
      text: `Здравейте, ${data.name},\n\nБлагодарим Ви, че се свързахте с нас. Получихме Вашето запитване и ще го разгледаме с внимание.\n\nЧлен на нашия екип ще се свърже с Вас на посочения имейл адрес.\n\nС уважение,\nЕкипът психотерапевти\n\nТова е автоматично потвърждение.`,
      html: emailLayout('Получихме Вашето запитване', `<p>Здравейте, ${name},</p><p>Благодарим Ви, че се свързахте с нас. Получихме Вашето запитване и ще го разгледаме с внимание.</p><p>Член на нашия екип ще се свърже с Вас на посочения имейл адрес.</p><p style="margin:28px 0 0;">С уважение,<br><strong>Екипът психотерапевти</strong></p>`),
    },
  }
}

export function createGmailSender(env: Record<string, string | undefined>): MailSender | undefined {
  const password = env.GMAIL_APP_PASSWORD?.replace(/\s/g, '')
  if (!password) return undefined

  const transport = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: contactMailbox, pass: password },
    connectionTimeout: 10_000,
    greetingTimeout: 10_000,
    socketTimeout: 20_000,
    disableFileAccess: true,
    disableUrlAccess: true,
  })
  return createContactSender((mail) => transport.sendMail(mail))
}

export function createContactSender(send: (mail: SendMailOptions) => Promise<{ accepted: unknown[] }>): MailSender {
  const from = { name: 'Екип психотерапевти', address: contactMailbox }
  return async (data) => {
    const emails = createEmails(data)
    const inquiry = await send({ from, to: contactMailbox, replyTo: data.email, ...emails.inquiry })
    if (!inquiry.accepted?.length) throw new Error('Inquiry not accepted by SMTP')
    try {
      const confirmation = await send({
        from, to: data.email, ...emails.confirmation,
        headers: { 'Auto-Submitted': 'auto-replied', 'X-Auto-Response-Suppress': 'All' },
      })
      return { confirmationSent: Boolean(confirmation.accepted?.length) }
    } catch {
      // Never retry the whole inquiry after it has already reached the team.
      console.error('Confirmation email could not be sent.')
      return { confirmationSent: false }
    }
  }
}
