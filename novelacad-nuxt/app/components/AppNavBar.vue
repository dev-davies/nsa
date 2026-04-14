<template>
  <header class="sticky top-0 z-50">
    <!-- Top contact strip (thin) -->
    <div class="bg-gray-900 text-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 h-8 flex items-center justify-between text-[11px]">
        <div class="flex items-center gap-4">
          <a href="tel:+2348113695917" class="inline-flex items-center gap-2 hover:text-white">
            <i class="fas fa-phone-alt text-[10px]"></i>
            <span class="hidden sm:inline">+234 8113695917</span>
            <span class="sm:hidden">Call</span>
          </a>
          <a href="mailto:novelsolaracademy@gmail.com" class="hidden sm:inline-flex items-center gap-2 hover:text-white">
            <i class="fas fa-envelope text-[10px]"></i>
            <span>novelsolaracademy@gmail.com</span>
          </a>
        </div>
        <div class="flex items-center gap-3 text-sm">
          <a href="#" class="hover:text-white" aria-label="Twitter"><i class="fab fa-twitter"></i></a>
          <a href="#" class="hover:text-white" aria-label="Facebook"><i class="fab fa-facebook-f"></i></a>
          <a href="#" class="hover:text-white" aria-label="LinkedIn"><i class="fab fa-linkedin-in"></i></a>
          <a href="#" class="hover:text-white" aria-label="Instagram"><i class="fab fa-instagram"></i></a>
        </div>
      </div>
    </div>

    <!-- Main nav (skinny) -->
    <div class="bg-white/90 backdrop-blur border-b border-gray-100">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 h-14 flex items-center justify-between">
        <NuxtLink to="/" class="flex items-center gap-3">
          <img
            src="/img/novel_logo-removebg-preview.png"
            alt="Novel Academy"
            class="h-9 w-auto object-contain"
          />
        </NuxtLink>

        <nav class="hidden md:flex items-center gap-8 text-sm font-semibold text-gray-700">
          <NuxtLink to="/" class="hover:text-gray-900">Home</NuxtLink>
          <NuxtLink to="/#about" class="hover:text-gray-900">About</NuxtLink>
          <NuxtLink to="/courses" class="hover:text-gray-900">Courses</NuxtLink>
          <a :href="contactHref" class="hover:text-gray-900">Contact</a>
        </nav>

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
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-4 grid gap-2 text-sm font-semibold text-gray-700">
          <NuxtLink to="/" class="px-3 py-2 rounded-lg hover:bg-gray-50" @click="open = false">Home</NuxtLink>
          <NuxtLink to="/#about" class="px-3 py-2 rounded-lg hover:bg-gray-50" @click="open = false">About</NuxtLink>
          <NuxtLink to="/courses" class="px-3 py-2 rounded-lg hover:bg-gray-50" @click="open = false">Courses</NuxtLink>
          <a :href="contactHref" class="px-3 py-2 rounded-lg hover:bg-gray-50" @click="open = false">Contact</a>
          <NuxtLink to="/registration" class="btn-primary w-full justify-center mt-2" @click="open = false">
            Enroll Now <i class="fas fa-arrow-right text-xs"></i>
          </NuxtLink>
        </div>
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

