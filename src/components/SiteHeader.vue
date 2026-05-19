<script setup lang="ts">
const navigationItems = [
  { label: 'Начало', href: '#top' },
  { label: 'Подход', href: '#services' },
  { label: 'Екип', href: '#team' },
  { label: 'Контакт', href: '#contact' },
]
</script>

<template>
  <header class="site-header">
    <div class="container-xl site-header__inner">
      <a class="site-header__logo" href="#top" aria-label="Начало">
        LOGO
      </a>

      <nav class="site-header__nav" aria-label="Основна навигация">
        <a
          v-for="item in navigationItems"
          :key="item.href"
          :href="item.href"
          class="site-header__link"
        >
          {{ item.label }}
        </a>
      </nav>
    </div>
  </header>
</template>
