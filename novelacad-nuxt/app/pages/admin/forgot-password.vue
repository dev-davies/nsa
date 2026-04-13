<template>
  <div class="min-h-screen bg-gradient-to-br from-brand-50 to-blue-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full">
      <!-- Header -->
      <div class="text-center mb-8">
        <h1 class="text-3xl font-heading font-bold text-gray-800 mb-2">Reset Password</h1>
        <p class="text-gray-600">Enter your email to receive a password reset link</p>
      </div>

      <!-- Form -->
      <div class="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
        <form @submit.prevent="submitForm" class="space-y-6">
          <!-- Email Input -->
          <div>
            <label for="email" class="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
            <input
              id="email"
              v-model="email"
              type="email"
              required
              class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all"
              placeholder="admin@novel-academy.com"
              :disabled="loading"
            />
          </div>

          <!-- Error Message -->
          <div v-if="errorMsg" class="p-4 bg-red-50 border border-red-200 rounded-xl">
            <p class="text-sm text-red-700">{{ errorMsg }}</p>
          </div>

          <!-- Success Message -->
          <div v-if="successMsg" class="p-4 bg-green-50 border border-green-200 rounded-xl">
            <p class="text-sm text-green-700">{{ successMsg }}</p>
          </div>

          <!-- Submit Button -->
          <button
            type="submit"
            :disabled="loading"
            class="w-full bg-brand-600 hover:bg-brand-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            <i v-if="loading" class="fas fa-spinner fa-spin"></i>
            {{ loading ? 'Sending...' : 'Send Reset Link' }}
          </button>

          <!-- Back to Login -->
          <div class="text-center">
            <NuxtLink to="/admin/login" class="text-brand-600 hover:text-brand-700 font-semibold text-sm">
              Back to Login
            </NuxtLink>
          </div>
        </form>
      </div>

      <!-- Info Box -->
      <div class="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
        <p class="text-sm text-blue-700">
          <i class="fas fa-info-circle mr-2"></i>
          Check your email for a password reset link. The link expires in 24 hours.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const email = ref('')
const loading = ref(false)
const errorMsg = ref('')
const successMsg = ref('')

async function submitForm() {
  errorMsg.value = ''
  successMsg.value = ''
  loading.value = true

  try {
    const response = await $fetch('/api/admin/forgot-password', {
      method: 'POST',
      body: { email: email.value },
    })

    if (response.status === 'success') {
      successMsg.value = response.message
      email.value = ''
    }
  } catch (e: any) {
    errorMsg.value = e?.data?.statusMessage || 'Failed to request password reset.'
    console.error('Password reset request error:', e)
  } finally {
    loading.value = false
  }
}
</script>
