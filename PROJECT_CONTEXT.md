# Project Context

## Purpose

This file is the shared base context for the therapy website project. Use it as the primary source of truth for technology choices, coding rules, structure, styling direction, and future project decisions.

## Communication And Working Style

- Act as a senior fullstack software engineer.
- Communicate in Bulgarian by default, unless the user asks otherwise.
- Be practical, calm, and direct.
- Explain important decisions briefly before implementing them.
- Prefer working changes over abstract plans when the goal is clear.
- Ask questions only when missing information would materially change the implementation.
- Preserve existing user work and do not revert unrelated changes.

## Project Description

The project is a website for a group of psychotherapists. It should work as a calm, professional portfolio and presentation website for their practice.

The therapists mainly work with children and use drawing/art therapy as an important part of their therapeutic approach. The website should feel simple, warm, trustworthy, child-friendly, and emotionally safe.

The first version should be a landing-style website where the main content is presented on one primary page, split into multiple clear sections. The exact sections will be defined later.

## Current Scope

- Portfolio/presentation website for a group of psychotherapists.
- Primary focus: children and therapy through drawing/art.
- One main landing page with several sections.
- Blog should be included or planned as part of the site.
- User login should be included or planned, but no payments are needed.
- No payment flow.
- No hosting decision is needed now because hosting/server are already available.
- Deployment strategy will be decided when the website is ready.

## Backend Scope

The backend should stay minimal for now.

Expected backend needs:

- Contact form submission.
- Send an email notification to the therapy team when a client submits an inquiry.
- Send an automatic confirmation email to the client after a successful inquiry.

No other backend features are required for the first version unless the scope changes.

## Tech Stack

- VueJS 3
- Vite
- TailwindCSS
- Node.js 22+
- Composition API only
- TypeScript preferred
- Vuetify can be used when it helps the UI
- Bootstrap can be used as an additional utility when needed

## Rules

- Always use `<script setup>`.
- Use Composition API instead of Options API.
- Prefer reusable components.
- Use mobile-first responsive design.
- Use semantic HTML.
- Keep components small and modular.
- Avoid unnecessary dependencies.

## Styling

- Use TailwindCSS and Vuetify, with additional Bootstrap only when useful.
- Do not use inline styles.
- Use CSS variables for colors.
- Keep the visual language soft, calm, and therapy-oriented.
- Prefer gentle spacing, readable typography, and accessible contrast.

## Code Style

- Use `camelCase` for variables and functions.
- Use `PascalCase` for Vue components.
- Keep composables inside `/src/composables`.
- Keep section components inside `/src/components/sections`.
- Keep components focused on one clear responsibility.
- Prefer TypeScript for new code when practical.

## Project Structure

```text
src/
  components/
    sections/
  composables/
  pages/
  assets/
  router/
```

## UX Direction

- Calm
- Minimalistic
- Child-friendly
- Soft colors
- Smooth animations
- Accessibility focused
- Clear navigation
- Supportive calls to action

## Accessibility

- Use semantic HTML.
- Maintain keyboard navigation.
- Keep color contrast readable.
- Avoid text embedded only in images.
- Provide descriptive labels and alt text where relevant.
- Keep motion gentle and avoid effects that may distract or overwhelm users.

## Product Direction

- Build a trustworthy, warm, professional website for therapy services.
- Present the therapists as a group with a clear, human portfolio-style identity.
- Make the child-focused and art/drawing therapy direction visible and understandable.
- Prioritize clarity, calm pacing, accessibility, and easy navigation.
- Avoid exaggerated marketing language.
- Make the first screen useful and emotionally grounded.
- Content should be easy to scan and emotionally safe.

## Future Plans

- Authentication/login.
- Admin panel possible later.
- Blog.
- Possible backend expansion if the blog, login, or admin panel require it.
- Deployment to the already available hosting/server once the site is ready.

## Development Rules

- Prefer simple, maintainable implementation.
- Follow existing project patterns once the codebase exists.
- Keep changes scoped to the requested task.
- Verify important UI changes in a browser when possible.
- Document major decisions in this file.

## Commit Convention

- Use only two commit types: `feat` and `fix`.
- `feat` is the default commit type.
- Use `fix` only when explicitly fixing a bug.
- Every commit message must include an incrementing project identifier in the format `[UP-<number>]`.
- The identifier starts from `[UP-1]` and increments by one for each new commit: `[UP-1]`, `[UP-2]`, `[UP-3]`, and so on.
- The message text after the identifier must start with a capital letter.
- Format: `<type>: [UP-<number>] - <Message>`
- Example: `feat: [UP-1] - Init project`
