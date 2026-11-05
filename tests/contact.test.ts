import assert from 'node:assert/strict'
import { once } from 'node:events'
import type { AddressInfo } from 'node:net'
import { test } from 'node:test'
import type { TestContext } from 'node:test'
import { createContactApp } from '../server/app'
import { contactMailbox, createContactSender, createEmails, createGmailSender, escapeHtml } from '../server/mail'
import type { MailSender } from '../server/mail'
import { contactSchema } from '../src/shared/contact'

const origin = 'http://127.0.0.1:5173'
const validData = { name: 'Иван Петров', email: 'visitor@example.com', message: 'Здравейте! Бих искал да се свържем.' }

async function setup(t: TestContext, sendMail?: MailSender) {
  const server = createContactApp({ sendMail, allowedOrigins: [origin] }).listen(0, '127.0.0.1')
  await once(server, 'listening')
  t.after(() => new Promise<void>((resolve, reject) => {
    server.closeAllConnections()
    server.close((error) => error ? reject(error) : resolve())
  }))
  const url = `http://127.0.0.1:${(server.address() as AddressInfo).port}/api/contact`
  return (body: unknown, requestOrigin = origin) => fetch(url, {
    method: 'POST', headers: { 'Content-Type': 'application/json', Origin: requestOrigin }, body: JSON.stringify(body),
  })
}

test('validates Bulgarian names, whitespace and exact field limits', () => {
  assert.equal(contactSchema.parse({ ...validData, name: '  Иван Петров  ' }).name, validData.name)
  assert.equal(contactSchema.safeParse({ ...validData, name: 'А'.repeat(75), message: 'а'.repeat(1500) }).success, true)
  for (const name of ['', '   ', 'Иван1', 'Иван@', 'Иван-Петров', 'А'.repeat(76), 'Иван\r\nBcc']) {
    assert.equal(contactSchema.safeParse({ ...validData, name }).success, false, name)
  }
  const email150 = `person@${'a'.repeat(63)}.${'b'.repeat(63)}.${'c'.repeat(15)}`
  assert.equal(email150.length, 150)
  assert.equal(contactSchema.safeParse({ ...validData, email: email150 }).success, true)
  for (const email of ['wrong', 'a@', 'a b@example.com', 'a@example.com\r\nBcc: other@example.com', `${email150}a`]) {
    assert.equal(contactSchema.safeParse({ ...validData, email }).success, false, email)
  }
  for (const message of ['', '  ', 'a'.repeat(1501), '<script>alert(1)</script>', '<img src=x onerror=alert(1)>', 'abc\0def']) {
    assert.equal(contactSchema.safeParse({ ...validData, message }).success, false)
  }
})

test('escapes all dynamic email content and supplies mobile-friendly HTML plus plain text', () => {
  assert.equal(escapeHtml(`<img title="x">&'`), '&lt;img title=&quot;x&quot;&gt;&amp;&#39;')
  const emails = createEmails({ ...validData, name: '<script>x</script>', message: '<img src=x>\nHello & goodbye' })
  for (const email of Object.values(emails)) {
    assert.ok(email.html.includes('name="viewport"'))
    assert.ok(email.text.length > 0)
    assert.equal(email.html.includes('<script>'), false)
  }
  assert.ok(emails.inquiry.html.includes('&lt;img src=x&gt;<br>Hello &amp; goodbye'))
  assert.ok(emails.confirmation.html.includes('Вашето запитване'))
})

test('sends team mail first and confirmation from the same Gmail identity', async () => {
  const sent: import('nodemailer').SendMailOptions[] = []
  const send = createContactSender(async (mail) => { sent.push(mail); return { accepted: [mail.to] } })
  assert.deepEqual(await send(validData), { confirmationSent: true })
  assert.equal(sent.length, 2)
  assert.equal(sent[0]?.to, contactMailbox)
  assert.equal(sent[0]?.replyTo, validData.email)
  assert.equal(sent[1]?.to, validData.email)
  assert.deepEqual(sent[1]?.from, { name: 'Екип психотерапевти', address: contactMailbox })
  assert.equal(createGmailSender({}), undefined)
})

test('never sends a confirmation when the team notification fails', async () => {
  let calls = 0
  const send = createContactSender(async () => { calls++; throw new Error('SMTP unavailable') })
  await assert.rejects(send(validData))
  assert.equal(calls, 1)
})

test('confirmation failure preserves successful team delivery', async () => {
  let calls = 0
  const send = createContactSender(async () => {
    if (++calls === 2) throw new Error('Confirmation unavailable')
    return { accepted: [contactMailbox] }
  })
  assert.deepEqual(await send(validData), { confirmationSent: false })
  assert.equal(calls, 2)
})

test('API validates input and does not send invalid messages', async (t) => {
  let calls = 0
  const post = await setup(t, async () => { calls++; return { confirmationSent: true } })
  const bad = await post({ ...validData, name: 'Иван123', message: '<b>test</b>' })
  assert.equal(bad.status, 400)
  const body = await bad.json()
  assert.ok(body.errors.name)
  assert.ok(body.errors.message)
  assert.equal(calls, 0)
  assert.equal((await post(validData)).status, 200)
  assert.equal(calls, 1)
})

test('API rejects foreign origins, malformed/oversized bodies, and wrong content types', async (t) => {
  let calls = 0
  const server = createContactApp({ allowedOrigins: [origin], sendMail: async () => { calls++; return { confirmationSent: true } } }).listen(0, '127.0.0.1')
  await once(server, 'listening')
  t.after(() => { server.closeAllConnections(); server.close() })
  const url = `http://127.0.0.1:${(server.address() as AddressInfo).port}/api/contact`
  for (const [body, type, source, expected] of [
    [JSON.stringify(validData), 'application/json', 'https://other.example', 403],
    [JSON.stringify(validData), 'text/plain', origin, 415],
    ['{', 'application/json', origin, 400],
    [JSON.stringify({ message: 'a'.repeat(20_000) }), 'application/json', origin, 413],
  ] as const) {
    const response = await fetch(url, { method: 'POST', headers: { Origin: source, 'Content-Type': type }, body })
    assert.equal(response.status, expected)
  }
  assert.equal(calls, 0)
})

test('API reports missing credentials and SMTP failure honestly', async (t) => {
  const unavailable = await setup(t)
  assert.equal((await unavailable(validData)).status, 503)
  const broken = await setup(t, async () => { throw new Error('SMTP failure') })
  assert.equal((await broken(validData)).status, 502)
  const partial = await setup(t, async () => ({ confirmationSent: false }))
  const response = await partial(validData)
  assert.equal(response.status, 200)
  assert.equal((await response.json()).confirmationSent, false)
})

test('API limits repeated submissions', async (t) => {
  const post = await setup(t, async () => ({ confirmationSent: true }))
  for (let count = 0; count < 5; count++) assert.equal((await post(validData)).status, 200)
  const response = await post(validData)
  assert.equal(response.status, 429)
  assert.ok(response.headers.has('retry-after'))
})
