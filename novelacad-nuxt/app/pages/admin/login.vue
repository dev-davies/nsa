<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-900 to-brand-900 flex items-center justify-center px-4 py-16">
    <div class="w-full max-w-md">
      <div class="text-center mb-8">
        <div class="inline-flex items-center gap-2 text-white mb-4">
          <i class="fas fa-book-reader text-brand-400 text-2xl"></i>
          <span class="font-heading font-bold text-xl">Novel Academy</span>
        </div>
        <h1 class="font-heading text-3xl font-bold text-white">Admin Login</h1>
        <p class="text-gray-400 text-sm mt-2">Sign in to your admin dashboard</p>
      </div>

      <div class="bg-white rounded-3xl shadow-2xl p-8">
        <div v-if="errorMsg" class="mb-5 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm flex items-center gap-2">
          <i class="fas fa-exclamation-circle"></i> {{ errorMsg }}
        </div>

        <form @submit.prevent="login" class="space-y-5">
          <div>
            <label class="form-label">Username</label>
            <div class="relative">
              <i class="fas fa-user absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"></i>
              <input
                v-model="username"
                type="text"
                class="form-input pl-10"
                placeholder="Enter your username"
                required
                autocomplete="username"
              />
            </div>
          </div>
          <div>
            <div class="flex items-center justify-between mb-2">
              <label class="form-label">Password</label>
              <NuxtLink to="/admin/forgot-password" class="text-xs text-brand-600 hover:text-brand-700 font-semibold">
                Forgot Password?
              </NuxtLink>
            </div>
            <div class="relative">
              <i class="fas fa-lock absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"></i>
              <input
                v-model="password"
                :type="showPass ? 'text' : 'password'"
                class="form-input pl-10 pr-10"
                placeholder="Enter your password"
                required
                autocomplete="current-password"
              />
              <button type="button" @click="showPass = !showPass" class="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                <i :class="showPass ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
              </button>
            </div>
          </div>
          <button
            type="submit"
            :disabled="isLoading"
            class="btn-primary w-full justify-center"
          >
            <span v-if="isLoading"><i class="fas fa-spinner fa-spin mr-2"></i>Signing in...</span>
            <span v-else><i class="fas fa-sign-in-alt mr-2"></i>Sign In</span>
          </button>
        </form>
      </div>

      <p class="text-center mt-6 text-gray-500 text-sm">
        <NuxtLink to="/" class="text-brand-300 hover:text-white transition-colors">← Back to Website</NuxtLink>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
useHead({ title: 'Admin Login | Novel Academy' })
definePageMeta({ layout: false })

const username = ref('')
const password = ref('')
const showPass = ref(false)
const isLoading = ref(false)
const errorMsg = ref('')

async function login() {
  isLoading.value = true
  errorMsg.value = ''
  try {
    const res = await $fetch<{ status: string; role: string }>('/api/admin/login', {
      method: 'POST',
      body: { username: username.value, password: password.value },
    })
    if (res.status === 'success') {
      navigateTo('/admin/dashboard')
    }
  } catch (e: any) {
    errorMsg.value = e?.data?.statusMessage || e?.data?.message || 'Invalid username or password.'
  } finally {
    isLoading.value = false
  }
}
</script>
