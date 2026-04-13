<template>
  <header>
    <!-- Topbar -->
    <div class="bg-gray-900 text-gray-300 py-2 px-4 lg:px-10">
      <div class="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-sm">
        <div class="flex items-center gap-4">
          <span><i class="fas fa-phone-alt mr-1.5 text-brand-400"></i>+234 811 369 5917</span>
          <span class="hidden sm:inline">|</span>
          <span class="hidden sm:inline"><i class="fas fa-envelope mr-1.5 text-brand-400"></i>info@novel-academy.com</span>
        </div>
        <div class="flex items-center gap-3">
          <a href="#" class="hover:text-white transition-colors"><i class="fab fa-facebook-f"></i></a>
          <a href="#" class="hover:text-white transition-colors"><i class="fab fa-twitter"></i></a>
          <a href="#" class="hover:text-white transition-colors"><i class="fab fa-linkedin-in"></i></a>
          <a href="#" class="hover:text-white transition-colors"><i class="fab fa-instagram"></i></a>
          <a href="#" class="hover:text-white transition-colors"><i class="fab fa-youtube"></i></a>
        </div>
      </div>
    </div>

    <!-- Main Navbar -->
    <nav class="bg-white shadow-sm sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 lg:px-10">
        <div class="flex items-center justify-between h-16">
          <!-- Logo -->
          <NuxtLink to="/" class="flex items-center gap-2 -ml-4">
            <img src="/img/novel_logo.png" alt="Novel Academy" class="h-10 w-auto" />
          </NuxtLink>

          <!-- Desktop Nav -->
          <div class="hidden lg:flex items-center gap-1">
            <NuxtLink to="/" class="nav-link" exact-active-class="text-brand-500 font-semibold">Home</NuxtLink>
            <NuxtLink to="/#about" class="nav-link" @click.prevent="scrollTo('about')">About</NuxtLink>
            <NuxtLink to="/courses" class="nav-link" active-class="text-brand-500 font-semibold">Courses</NuxtLink>
            <NuxtLink to="/#contact" class="nav-link" @click.prevent="scrollTo('contact')">Contact</NuxtLink>
            <NuxtLink
              to="/registration"
              class="ml-4 px-5 py-2 bg-brand-500 text-white rounded-full font-semibold text-sm hover:bg-brand-600 transition-colors"
            >
              Register Now
            </NuxtLink>
          </div>

          <!-- Mobile Toggle -->
          <button @click="mobileOpen = !mobileOpen" class="lg:hidden p-2 text-gray-600" aria-label="Toggle menu">
            <i :class="mobileOpen ? 'fas fa-times' : 'fas fa-bars'" class="text-xl"></i>
          </button>
        </div>

        <!-- Mobile Menu -->
        <Transition name="slide-down">
          <div v-if="mobileOpen" class="lg:hidden py-4 border-t border-gray-100 space-y-1">
            <NuxtLink to="/" class="mobile-link" @click="mobileOpen = false">Home</NuxtLink>
            <a href="/#about" class="mobile-link" @click="mobileOpen = false">About</a>
            <NuxtLink to="/courses" class="mobile-link" @click="mobileOpen = false">Courses</NuxtLink>
            <a href="/#contact" class="mobile-link" @click="mobileOpen = false">Contact</a>
            <NuxtLink to="/registration" class="mobile-link text-brand-500 font-semibold" @click="mobileOpen = false">Register Now</NuxtLink>
          </div>
        </Transition>
      </div>
    </nav>
  </header>
</template>

<script setup lang="ts">
const mobileOpen = ref(false)

function scrollTo(id: string) {
  mobileOpen.value = false
  const el = document.getElementById(id)
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  } else {
    navigateTo('/#' + id)
  }
}
</script>

<style scoped>
.nav-link {
  @apply px-4 py-2 text-gray-700 hover:text-brand-500 font-medium text-sm rounded-md transition-colors;
}
.mobile-link {
  @apply block px-4 py-2.5 text-gray-700 hover:text-brand-500 hover:bg-gray-50 rounded-lg font-medium transition-colors;
}
.slide-down-enter-active, .slide-down-leave-active {
  transition: all 0.2s ease;
}
.slide-down-enter-from, .slide-down-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
