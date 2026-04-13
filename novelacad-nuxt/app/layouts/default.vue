<template>
  <div class="min-h-screen flex flex-col">
    <AppNavBar />
    <main class="flex-1">
      <slot />
    </main>
    <AppFooter />
    <!-- Back to top -->
    <button
      v-show="showTop"
      @click="scrollTop"
      class="fixed bottom-6 right-6 z-50 w-12 h-12 bg-brand-500 hover:bg-brand-600 text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110"
      aria-label="Back to top"
    >
      <i class="fas fa-angle-double-up text-lg"></i>
    </button>
  </div>
</template>

<script setup lang="ts">
const showTop = ref(false)

onMounted(() => {
  window.addEventListener('scroll', () => {
    showTop.value = window.scrollY > 400
  })
})

function scrollTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>
