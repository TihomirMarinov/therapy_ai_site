import express from 'express'
import type { ErrorRequestHandler } from 'express'
import rateLimit from 'express-rate-limit'
import { contactSchema, getContactErrors } from '../src/shared/contact'
import type { MailSender } from './mail'

export function createContactApp(options: { sendMail?: MailSender; allowedOrigins: string[] }) {
  const app = express()
  app.disable('x-powered-by')
  app.use('/api', (_request, response, next) => {
    response.set({ 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' })
    next()
  })
  app.post('/api/contact', (request, response, next) => {
    const origin = request.get('origin')
    if (!origin || !options.allowedOrigins.includes(origin)) {
      response.status(403).json({ message: 'Заявката не е разрешена от този адрес.' })
      return
    }
    if (!request.is('application/json')) {
      response.status(415).json({ message: 'Невалиден формат на заявката.' })
      return
    }
    next()
  }, rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 5,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    message: { message: 'Изпратихте твърде много заявки. Моля, опитайте след 15 минути.' },
  }), express.json({ limit: '16kb' }), async (request, response) => {
    const result = contactSchema.safeParse(request.body)
    if (!result.success) {
      response.status(400).json({ message: 'Моля, проверете попълнените полета.', errors: getContactErrors(result.error) })
      return
    }
    if (!options.sendMail) {
      response.status(503).json({ message: 'В момента формулярът не е достъпен. Моля, опитайте по-късно или ни пишете директно по имейл.' })
      return
    }
    try {
      const { confirmationSent } = await options.sendMail(result.data)
      response.json({ confirmationSent, message: confirmationSent
        ? 'Благодарим Ви! Вашето запитване е изпратено. Изпратихме потвърждение на Вашия имейл адрес.'
        : 'Благодарим Ви! Вашето запитване е изпратено. Потвърждението по имейл не успя да се изпрати, но не е необходимо да подавате запитването отново.' })
    } catch {
      console.error('Contact inquiry could not be sent.')
      response.status(502).json({ message: 'Не успяхме да изпратим запитването. Моля, опитайте по-късно или ни пишете директно по имейл.' })
    }
  })
  app.use('/api', (_request, response) => {
    response.status(404).json({ message: 'Невалиден API адрес.' })
  })
  const errorHandler: ErrorRequestHandler = (error, _request, response, _next) => {
    const status = error?.type === 'entity.too.large' ? 413 : error?.type === 'entity.parse.failed' ? 400 : 500
    response.status(status).json({ message: status === 413 ? 'Съобщението е твърде голямо.' : 'Заявката не може да бъде обработена.' })
  }
  app.use(errorHandler)
  return app
}
