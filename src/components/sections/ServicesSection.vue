<script setup lang="ts">
const services = [
  {
    title: 'Арт терапия',
    text: 'Рисуването дава мек път към теми, които детето още трудно назовава с думи.',
  },
  {
    title: 'Детска психотерапия',
    text: 'Работа в сигурна среда с внимание към темпото, възрастта и преживяванията на детето.',
  },
  {
    title: 'Подкрепа за родители',
    text: 'Практични разговори за разбиране на нуждите на детето и следващи спокойни стъпки.',
  },
]
</script>

<template>
  <section id="services" class="section-band" aria-labelledby="services-title">
    <div class="container-xl">
      <div class="section-heading">
        <p class="eyebrow">Подход</p>
        <h2 id="services-title">Терапия, която оставя пространство на детето</h2>
      </div>

      <div class="services-grid">
        <article v-for="service in services" :key="service.title" class="info-card">
          <h3>{{ service.title }}</h3>
          <p>{{ service.text }}</p>
        </article>
      </div>
    </div>
  </section>
</template>
