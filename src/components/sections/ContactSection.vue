<script setup lang="ts">
const contactFields = ['Име', 'Имейл', 'Съобщение']
</script>

<template>
  <section id="contact" class="section-band section-band--warm" aria-labelledby="contact-title">
    <div class="container-xl contact-section">
      <div class="section-heading">
        <p class="eyebrow">Контакт</p>
        <h2 id="contact-title">Първата стъпка може да бъде кратко съобщение</h2>
        <p>
          Формата тук е визуална основа. Реалното изпращане на имейли ще се свърже
          към минимален backend, когато уточним email доставчика.
        </p>
      </div>

      <form class="contact-form" aria-label="Форма за контакт">
        <label v-for="field in contactFields" :key="field">
          <span>{{ field }}</span>
          <textarea v-if="field === 'Съобщение'" rows="4"></textarea>
          <input v-else :type="field === 'Имейл' ? 'email' : 'text'" />
        </label>
        <button class="btn-soft btn-soft--primary" type="button">Изпрати запитване</button>
      </form>
    </div>
  </section>
</template>
