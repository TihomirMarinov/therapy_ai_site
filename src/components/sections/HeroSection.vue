<script setup lang="ts">
const heroActions = [
  { label: 'Запитване за среща', href: '#contact' },
  { label: 'Научи повече', href: '#services' },
]
</script>

<template>
  <section class="hero-section" aria-labelledby="hero-title">
    <div class="container-xl hero-section__content">
      <div class="hero-section__copy">
        <p class="eyebrow">Психотерапия за деца и семейства</p>
        <h1 id="hero-title">Място за спокойствие, игра и изразяване чрез рисунка</h1>
        <p class="hero-section__lead">
          Подкрепяме деца и родители чрез внимателен терапевтичен процес, в който
          рисуването помага на чувствата да намерят ясен и безопасен език.
        </p>
        <nav class="hero-section__actions" aria-label="Основни действия">
          <a
            v-for="action in heroActions"
            :key="action.href"
            :href="action.href"
            class="btn-soft"
          >
            {{ action.label }}
          </a>
        </nav>
      </div>

      <div class="hero-section__visual" aria-label="Абстрактна арт терапия">
        <span class="paint-stroke paint-stroke--mint"></span>
        <span class="paint-stroke paint-stroke--peach"></span>
        <span class="paint-stroke paint-stroke--blue"></span>
      </div>
    </div>
  </section>
</template>
