import { existsSync } from 'node:fs'
import { resolve } from 'node:path'
import express from 'express'
import { createContactApp } from './app'
import { createGmailSender } from './mail'

if (existsSync('.env')) process.loadEnvFile('.env')
const origin = process.env.APP_ORIGIN
if (!origin) throw new Error('Set APP_ORIGIN to the public website origin in .env.')
const sendMail = createGmailSender(process.env)
if (!sendMail) throw new Error('Set GMAIL_APP_PASSWORD in .env before starting the server.')

const app = createContactApp({ sendMail, allowedOrigins: [new URL(origin).origin] })
app.use(express.static(resolve('dist')))
app.listen(Number(process.env.PORT ?? 3000), process.env.HOST ?? '127.0.0.1', () => {
  console.log(`Website server listening on port ${process.env.PORT ?? 3000}.`)
})
