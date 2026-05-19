<script setup lang="ts">
const values = ['емпатия', 'доверие', 'игра', 'рисуване']
</script>

<template>
  <section id="team" class="team-section" aria-labelledby="team-title">
    <div class="container-xl team-section__layout">
      <div>
        <p class="eyebrow">Екип</p>
        <h2 id="team-title">Група терапевти с фокус върху детския свят</h2>
      </div>
      <p>
        Представянето на екипа ще бъде изградено с кратки човешки профили,
        професионален опит и ясен фокус върху начина, по който всяко дете бива
        посрещнато спокойно и с уважение.
      </p>
      <ul class="value-list" aria-label="Основни ценности">
        <li v-for="value in values" :key="value">{{ value }}</li>
      </ul>
    </div>
  </section>
</template>
