import { mkdirSync, writeFileSync } from 'node:fs'
import { createEmails } from '../server/mail'

const { confirmation } = createEmails({
  name: 'Иван Петров',
  email: 'visitor@example.com',
  message: 'Примерно запитване.',
})
mkdirSync('.artifacts', { recursive: true })
writeFileSync('.artifacts/confirmation-email.html', confirmation.html, 'utf8')
console.log('Email preview: http://127.0.0.1:5173/.artifacts/confirmation-email.html')
