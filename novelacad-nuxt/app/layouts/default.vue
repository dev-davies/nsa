<template>
  <div class="min-h-screen flex flex-col bg-white">
    <AppNavBar />
    <main class="flex-1">
      <slot />
    </main>
    <AppFooter />
  </div>
</template>

<script setup lang="ts">
import AppNavBar from '../components/AppNavBar.vue'
import AppFooter from '../components/AppFooter.vue'
</script>

