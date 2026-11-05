# Therapy Website

Vue 3, Vite, TypeScript and a minimal Express contact API. Use Node.js 22.12+ (the project also includes a local Node runtime).

## Development

```sh
npm ci
npm run dev
```

Open http://127.0.0.1:5173. Stop the visible terminal with Ctrl+C.

## Contact Email Setup

1. Enable Google 2-Step Verification for `tihomir.marinov2102@gmail.com`.
2. Create an App Password at https://myaccount.google.com/apppasswords.
3. Create a local `.env` using the keys in `.env.example` and fill in `GMAIL_APP_PASSWORD`.
4. Restart `npm run dev` after configuring credentials.

Do not use your regular Google account password. Do not paste the App Password into chat, commit it, or prefix it with `VITE_`. The `.env` file is ignored by Git.

Both emails are sent by `tihomir.marinov2102@gmail.com`. The team notification has the visitor's address in Reply-To. The visitor receives a formal HTML confirmation with a plain-text fallback. This is an automated email from an existing Gmail inbox, not a separate no-reply mailbox.

The API validates every field, restricts body size and origins, and limits each IP to five submissions per 15 minutes. The in-memory rate limit is suitable for one Node instance; configure the known proxy hop count and a shared rate-limit store if deploying behind a proxy or multiple instances. Client-supplied forwarded-IP headers are not trusted by default.

## Verification

```sh
npm test
npm run build
```

Tests use a mock mail transport and send no real emails. A live test requires Gmail credentials and a real recipient you control. SMTP acceptance does not guarantee inbox delivery; check spam as well.

With the development server running, `npm run email:preview` generates a local HTML preview at `http://127.0.0.1:5173/.artifacts/confirmation-email.html`. Generated previews are ignored by Git and are not included in production.

## Production

Set `APP_ORIGIN` in the server environment to the exact public origin (for example `https://example.com`), configure Gmail credentials, then run:

```sh
npm run build
npm start
```

The Node server listens on `HOST` / `PORT` from `.env` (default `127.0.0.1:3000`) and serves `dist` and `/api/contact`. Configure HTTPS and the existing hosting reverse proxy when deploying. Uploading `dist` alone does not provide the contact API. `npm run preview` previews static assets only.
