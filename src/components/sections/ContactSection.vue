<script setup lang="ts">
import { nextTick, ref } from 'vue'
import { useContactForm } from '@/composables/useContactForm'
import { contactLimits } from '@/shared/contact'

const { form, errors, isSending, feedback, isSuccess, validateField, submit } = useContactForm()
const formElement = ref<HTMLFormElement>()

async function handleSubmit() {
  await submit()
  await nextTick()
  formElement.value?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus()
}
</script>

<template>
  <section id="contact" class="section-band section-band--warm" aria-labelledby="contact-title">
    <div class="container-xl contact-section">
      <div class="section-heading">
        <p class="eyebrow">Контакт</p>
        <h2 id="contact-title">Първата стъпка може да бъде кратко съобщение</h2>
        <p>
          Споделете с какво можем да Ви бъдем полезни. Ще се свържем с Вас
          на посочения имейл адрес.
        </p>
        <a class="contact-email" href="mailto:tihomir.marinov2102@gmail.com">tihomir.marinov2102@gmail.com</a>
      </div>

      <form ref="formElement" class="contact-form" aria-label="Форма за контакт" :aria-busy="isSending" novalidate @submit.prevent="handleSubmit">
        <fieldset :disabled="isSending" class="contact-form__fields">
          <div class="contact-form__field">
            <label for="contact-name">Име</label>
            <input id="contact-name" v-model="form.name" name="name" type="text" autocomplete="name" required :maxlength="contactLimits.name" :aria-invalid="Boolean(errors.name)" :aria-describedby="errors.name ? 'contact-name-error' : undefined" @blur="validateField('name')" />
            <p v-if="errors.name" id="contact-name-error" class="contact-form__error">{{ errors.name }}</p>
          </div>
          <div class="contact-form__field">
            <label for="contact-email">Имейл</label>
            <input id="contact-email" v-model="form.email" name="email" type="email" autocomplete="email" required :maxlength="contactLimits.email" :aria-invalid="Boolean(errors.email)" :aria-describedby="errors.email ? 'contact-email-error' : undefined" @blur="validateField('email')" />
            <p v-if="errors.email" id="contact-email-error" class="contact-form__error">{{ errors.email }}</p>
          </div>
          <div class="contact-form__field">
            <label for="contact-message">Съобщение</label>
            <textarea id="contact-message" v-model="form.message" name="message" rows="5" required :maxlength="contactLimits.message" :aria-invalid="Boolean(errors.message)" :aria-describedby="errors.message ? 'contact-message-count contact-message-error' : 'contact-message-count'" @blur="validateField('message')"></textarea>
            <p id="contact-message-count" class="contact-form__count">{{ form.message.length }} / {{ contactLimits.message }}</p>
            <p v-if="errors.message" id="contact-message-error" class="contact-form__error">{{ errors.message }}</p>
          </div>
          <button class="btn-soft btn-soft--primary contact-form__submit" type="submit">{{ isSending ? 'Изпращане…' : 'Изпрати запитване' }}</button>
        </fieldset>
        <div aria-live="polite" aria-atomic="true">
          <p v-if="feedback" class="contact-form__feedback" :class="{ 'contact-form__feedback--success': isSuccess }">{{ feedback }}</p>
        </div>
      </form>
    </div>
  </section>
</template>
