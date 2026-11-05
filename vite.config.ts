import { fileURLToPath, URL } from 'node:url'

import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'
import { defineConfig, loadEnv } from 'vite'
import type { Connect } from 'vite'
import vuetify from 'vite-plugin-vuetify'
import { createContactApp } from './server/app'
import { createGmailSender } from './server/mail'

export default defineConfig({
  plugins: [
    vue(),
    vuetify({ autoImport: true }),
    tailwindcss(),
    {
      name: 'contact-api',
      configureServer(server) {
        const env = { ...process.env, ...loadEnv(server.config.mode, process.cwd(), '') }
        const sendMail = createGmailSender(env)
        if (!sendMail) server.config.logger.warn('Contact email is disabled: set GMAIL_APP_PASSWORD in .env.')
        const port = server.config.server.port
        const app = createContactApp({
          sendMail,
          allowedOrigins: [`http://127.0.0.1:${port}`, `http://localhost:${port}`],
        })
        const middleware = app as unknown as Connect.NextHandleFunction
        server.middlewares.use((request, response, next) => {
          if (request.url?.split('?')[0]?.startsWith('/api/')) middleware(request, response, next)
          else next()
        })
      },
    },
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: { port: 5173, strictPort: true },
})
