<template>
  <div class="min-h-screen bg-gradient-to-br from-brand-50 to-blue-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full">
      <!-- Header -->
      <div class="text-center mb-8">
        <h1 class="text-3xl font-heading font-bold text-gray-800 mb-2">Set New Password</h1>
        <p class="text-gray-600">Enter your new password below</p>
      </div>

      <!-- Form -->
      <div class="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
        <!-- Token Invalid Message -->
        <div v-if="tokenInvalid" class="mb-6">
          <div class="p-4 bg-red-50 border border-red-200 rounded-xl mb-4">
            <p class="text-sm text-red-700">
              <i class="fas fa-exclamation-triangle mr-2"></i>
              This password reset link is invalid or has expired.
            </p>
          </div>
          <NuxtLink to="/admin/forgot-password" class="w-full block text-center bg-brand-600 hover:bg-brand-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors">
            Request New Reset Link
          </NuxtLink>
        </div>

        <!-- Form (hidden if token invalid) -->
        <form v-else @submit.prevent="submitForm" class="space-y-6">
          <!-- Password Input -->
          <div>
            <label for="password" class="block text-sm font-semibold text-gray-700 mb-2">New Password</label>
            <div class="relative">
              <input
                id="password"
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                required
                minlength="8"
                class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all"
                placeholder="At least 8 characters"
                :disabled="loading"
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
              >
                <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
              </button>
            </div>
            <p class="text-xs text-gray-500 mt-1">
              <i class="fas fa-info-circle mr-1"></i>
              At least 8 characters, mix of uppercase, lowercase, and numbers recommended
            </p>
          </div>

          <!-- Confirm Password Input -->
          <div>
            <label for="passwordConfirm" class="block text-sm font-semibold text-gray-700 mb-2">Confirm Password</label>
            <div class="relative">
              <input
                id="passwordConfirm"
                v-model="passwordConfirm"
                :type="showPasswordConfirm ? 'text' : 'password'"
                required
                minlength="8"
                class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all"
                placeholder="Confirm your password"
                :disabled="loading"
              />
              <button
                type="button"
                @click="showPasswordConfirm = !showPasswordConfirm"
                class="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
              >
                <i :class="showPasswordConfirm ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
              </button>
            </div>
          </div>

          <!-- Password Match Indicator -->
          <div v-if="password && passwordConfirm" class="flex items-center gap-2 text-sm">
            <i :class="password === passwordConfirm ? 'fas fa-check text-green-500' : 'fas fa-times text-red-500'"></i>
            <span :class="password === passwordConfirm ? 'text-green-600' : 'text-red-600'">
              {{ password === passwordConfirm ? 'Passwords match' : 'Passwords do not match' }}
            </span>
          </div>

          <!-- Error Message -->
          <div v-if="errorMsg" class="p-4 bg-red-50 border border-red-200 rounded-xl">
            <p class="text-sm text-red-700">{{ errorMsg }}</p>
          </div>

          <!-- Success Message -->
          <div v-if="successMsg" class="p-4 bg-green-50 border border-green-200 rounded-xl">
            <p class="text-sm text-green-700 mb-3">{{ successMsg }}</p>
            <NuxtLink to="/admin/login" class="inline-block text-brand-600 hover:text-brand-700 font-semibold text-sm">
              Go to Login
            </NuxtLink>
          </div>

          <!-- Submit Button -->
          <button
            v-if="!successMsg"
            type="submit"
            :disabled="loading || password !== passwordConfirm || password.length < 8"
            class="w-full bg-brand-600 hover:bg-brand-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            <i v-if="loading" class="fas fa-spinner fa-spin"></i>
            {{ loading ? 'Resetting...' : 'Reset Password' }}
          </button>

          <!-- Back to Login -->
          <div v-if="!successMsg" class="text-center">
            <NuxtLink to="/admin/login" class="text-brand-600 hover:text-brand-700 font-semibold text-sm">
              Back to Login
            </NuxtLink>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const password = ref('')
const passwordConfirm = ref('')
const loading = ref(false)
const errorMsg = ref('')
const successMsg = ref('')
const showPassword = ref(false)
const showPasswordConfirm = ref(false)
const tokenInvalid = ref(false)

const token = computed(() => route.params.token as string)

// Validate token exists
if (!token.value || typeof token.value !== 'string' || token.value.length < 32) {
  tokenInvalid.value = true
}

async function submitForm() {
  errorMsg.value = ''
  successMsg.value = ''
  loading.value = true

  try {
    const response = await $fetch('/api/admin/reset-password', {
      method: 'POST',
      body: {
        token: token.value,
        password: password.value,
        passwordConfirm: passwordConfirm.value,
      },
    })

    if (response.status === 'success') {
      successMsg.value = response.message
    }
  } catch (e: any) {
    errorMsg.value = e?.data?.statusMessage || 'Failed to reset password.'
    if (e?.data?.statusMessage?.includes('invalid or expired')) {
      tokenInvalid.value = true
    }
    console.error('Password reset error:', e)
  } finally {
    loading.value = false
  }
}
</script>
