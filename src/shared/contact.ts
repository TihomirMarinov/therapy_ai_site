import { z } from 'zod'

export const contactLimits = { name: 75, email: 150, message: 1500 } as const

export const contactSchema = z.object({
  name: z.string().max(contactLimits.name, 'Името може да съдържа до 75 символа.')
    .trim().min(1, 'Моля, въведете Вашето име.')
    .regex(/^[\p{L}\p{M}]+(?: +[\p{L}\p{M}]+)*$/u, 'Използвайте само букви и интервали.'),
  email: z.string().max(contactLimits.email, 'Имейлът може да съдържа до 150 символа.')
    .trim().email('Моля, въведете валиден имейл адрес.'),
  message: z.string().max(contactLimits.message, 'Съобщението може да съдържа до 1500 символа.')
    .trim().min(1, 'Моля, въведете Вашето съобщение.')
    .regex(/^[^<>\x00-\x08\x0B\x0C\x0E-\x1F]*$/u, 'Използвайте обикновен текст без HTML тагове и знаците < и >.'),
})

export type ContactData = z.infer<typeof contactSchema>
export type ContactErrors = Partial<Record<keyof ContactData, string>>

export function getContactErrors(error: z.ZodError): ContactErrors {
  const errors: ContactErrors = {}
  for (const issue of error.issues) {
    const field = issue.path[0] as keyof ContactData
    if (field in contactLimits && !errors[field]) errors[field] = issue.message
  }
  return errors
}
