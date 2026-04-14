<template>
  <header class="sticky top-0 z-50 bg-white/80 backdrop-blur border-b border-gray-100">
    <div class="max-w-7xl mx-auto px-6 lg:px-10 py-4 flex items-center justify-between">
      <NuxtLink to="/" class="flex items-center gap-2 text-gray-900">
        <i class="fas fa-book-reader text-brand-500 text-xl"></i>
        <span class="font-heading font-extrabold tracking-tight">Novel Academy</span>
      </NuxtLink>

      <nav class="hidden md:flex items-center gap-7 text-sm font-semibold">
        <NuxtLink to="/" class="text-gray-700 hover:text-gray-900">Home</NuxtLink>
        <NuxtLink to="/courses" class="text-gray-700 hover:text-gray-900">Courses</NuxtLink>
        <NuxtLink to="/registration" class="text-gray-700 hover:text-gray-900">Registration</NuxtLink>
        <a :href="contactHref" class="text-gray-700 hover:text-gray-900">Contact</a>
      </nav>

      <div class="hidden md:flex items-center gap-3">
        <NuxtLink to="/registration" class="btn-primary !px-5 !py-2.5 text-sm">
          Enroll Now <i class="fas fa-arrow-right text-xs"></i>
        </NuxtLink>
      </div>

      <button
        type="button"
        class="md:hidden w-10 h-10 rounded-xl border border-gray-200 flex items-center justify-center text-gray-700 hover:bg-gray-50"
        @click="open = !open"
        :aria-expanded="open ? 'true' : 'false'"
        aria-label="Toggle menu"
      >
        <i class="fas" :class="open ? 'fa-times' : 'fa-bars'"></i>
      </button>
    </div>

    <div v-if="open" class="md:hidden border-t border-gray-100 bg-white">
      <div class="max-w-7xl mx-auto px-6 lg:px-10 py-4 grid gap-2">
        <NuxtLink to="/" class="px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-50" @click="open = false">Home</NuxtLink>
        <NuxtLink to="/courses" class="px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-50" @click="open = false">Courses</NuxtLink>
        <NuxtLink to="/registration" class="px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-50" @click="open = false">Registration</NuxtLink>
        <a :href="contactHref" class="px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-50" @click="open = false">Contact</a>
        <NuxtLink to="/registration" class="btn-primary w-full justify-center mt-2" @click="open = false">
          Enroll Now <i class="fas fa-arrow-right text-xs"></i>
        </NuxtLink>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
const open = ref(false)
const route = useRoute()

const contactHref = computed(() => {
  // Home page has the contact section. From other pages, go home then anchor.
  return route.path === '/' ? '#contact' : '/#contact'
})
</script>

