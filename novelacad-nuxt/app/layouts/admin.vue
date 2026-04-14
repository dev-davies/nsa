<template>
  <div class="min-h-screen bg-gray-50 flex">
    <!-- Sidebar -->
    <aside class="w-64 bg-gray-900 text-white flex flex-col min-h-screen fixed left-0 top-0 bottom-0 z-40">
      <div class="p-6 border-b border-gray-700">
        <NuxtLink to="/" class="flex items-center gap-2">
          <i class="fas fa-book-reader text-brand-400 text-xl"></i>
          <span class="font-heading font-bold text-lg">Novel Academy</span>
        </NuxtLink>
        <p class="text-xs text-gray-400 mt-1">Admin Panel</p>
      </div>

      <nav class="flex-1 p-4 space-y-1">
        <NuxtLink
          to="/admin/dashboard"
          class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
          active-class="bg-brand-500/20 text-brand-400"
        >
          <i class="fas fa-tachometer-alt w-5"></i>
          <span>Dashboard</span>
        </NuxtLink>
      </nav>

      <div class="p-4 border-t border-gray-700">
        <div class="flex items-center gap-3 mb-3 px-3">
          <div class="w-8 h-8 rounded-full bg-brand-500 flex items-center justify-center text-sm font-bold">
            {{ username?.charAt(0)?.toUpperCase() }}
          </div>
          <div>
            <p class="text-sm font-medium text-white">{{ username }}</p>
            <p class="text-xs text-gray-400 capitalize">{{ role }}</p>
          </div>
        </div>
        <button
          @click="logout"
          class="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-gray-400 hover:bg-red-900/30 hover:text-red-400 transition-colors text-sm"
        >
          <i class="fas fa-sign-out-alt w-5"></i>
          <span>Logout</span>
        </button>
      </div>
    </aside>

    <!-- Main content -->
    <div class="flex-1 ml-64">
      <header class="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between sticky top-0 z-30">
        <slot name="header">
          <h1 class="text-xl font-heading font-bold text-gray-800">Dashboard</h1>
        </slot>
      </header>
      <main class="p-8">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
const { data } = await useFetch('/api/admin/session')
const username = computed(() => (data.value as any)?.username ?? '')
const role = computed(() => (data.value as any)?.role ?? '')

async function logout() {
  await $fetch('/api/admin/logout', { method: 'POST' })
  navigateTo('/admin/login')
}
</script>

