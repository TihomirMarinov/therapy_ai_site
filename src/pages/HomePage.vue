<script setup lang="ts">
import SiteHeader from '@/components/SiteHeader.vue'
import ContactSection from '@/components/sections/ContactSection.vue'
import HeroSection from '@/components/sections/HeroSection.vue'
import ServicesSection from '@/components/sections/ServicesSection.vue'
import TeamSection from '@/components/sections/TeamSection.vue'
</script>

<template>
  <SiteHeader />
  <main id="top">
    <HeroSection />
    <ServicesSection />
    <TeamSection />
    <ContactSection />
  </main>
</template>
