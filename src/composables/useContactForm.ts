import { reactive, ref } from 'vue'
import { contactSchema, getContactErrors } from '@/shared/contact'
import type { ContactData, ContactErrors } from '@/shared/contact'

export function useContactForm() {
  const form = reactive<ContactData>({ name: '', email: '', message: '' })
  const errors = ref<ContactErrors>({})
  const isSending = ref(false)
  const feedback = ref('')
  const isSuccess = ref(false)

  function validateField(field: keyof ContactData) {
    const result = contactSchema.shape[field].safeParse(form[field])
    errors.value[field] = result.success ? undefined : result.error.issues[0]?.message
  }

  async function submit() {
    if (isSending.value) return
    feedback.value = ''
    isSuccess.value = false
    const result = contactSchema.safeParse(form)
    errors.value = result.success ? {} : getContactErrors(result.error)
    if (!result.success) return

    isSending.value = true
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(result.data),
      })
      const data = await response.json()
      if (!response.ok) {
        if (data.errors) errors.value = data.errors
        feedback.value = data.message || 'Възникна грешка. Моля, опитайте по-късно.'
        return
      }
      feedback.value = data.message
      isSuccess.value = true
      Object.assign(form, { name: '', email: '', message: '' })
    } catch {
      feedback.value = 'Не успяхме да потвърдим изпращането. Моля, проверете връзката и имейла си, преди да опитате отново.'
    } finally {
      isSending.value = false
    }
  }

  return { form, errors, isSending, feedback, isSuccess, validateField, submit }
}
