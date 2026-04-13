<template>
  <NuxtLayout name="admin">
    <template #header>
      <div class="flex items-center gap-4">
        <NuxtLink :to="`/admin/registrations/${id}`" class="text-gray-400 hover:text-gray-600 transition-colors">
          <i class="fas fa-arrow-left"></i>
        </NuxtLink>
        <h1 class="text-xl font-heading font-bold text-gray-800">Edit Registration #{{ id }}</h1>
      </div>
    </template>

    <div v-if="pending" class="flex items-center justify-center py-20 text-gray-400">
      <i class="fas fa-spinner fa-spin mr-3 text-2xl"></i> Loading...
    </div>

    <div v-else-if="form" class="max-w-3xl">
      <div v-if="successMsg" class="mb-6 p-4 bg-green-50 border border-green-200 rounded-2xl text-green-700 text-sm font-semibold">
        <i class="fas fa-check-circle mr-2"></i>{{ successMsg }}
      </div>
      <div v-if="errorMsg" class="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-sm font-semibold">
        <i class="fas fa-exclamation-circle mr-2"></i>{{ errorMsg }}
      </div>

      <form @submit.prevent="save" class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div class="px-6 py-5 border-b border-gray-100 bg-gray-50">
          <h2 class="font-bold text-gray-700">Personal Information</h2>
        </div>
        <div class="p-6 grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label class="form-label">Full Name</label>
            <input v-model="form.full_name" type="text" class="form-input" required />
          </div>
          <div>
            <label class="form-label">Email</label>
            <input v-model="form.email" type="email" class="form-input" required />
          </div>
          <div>
            <label class="form-label">Phone</label>
            <input v-model="form.phone" type="tel" class="form-input" />
          </div>
          <div>
            <label class="form-label">Date of Birth</label>
            <input v-model="form.dob" type="date" class="form-input" />
          </div>
          <div>
            <label class="form-label">Sex</label>
            <select v-model="form.sex" class="form-input">
              <option>Male</option><option>Female</option><option>Other</option><option>Prefer not to say</option>
            </select>
          </div>
          <div>
            <label class="form-label">Nationality</label>
            <input v-model="form.nationality" type="text" class="form-input" />
          </div>
          <div>
            <label class="form-label">State</label>
            <input v-model="form.state" type="text" class="form-input" />
          </div>
          <div>
            <label class="form-label">Address</label>
            <input v-model="form.address" type="text" class="form-input" />
          </div>
        </div>

        <div class="px-6 py-5 border-t border-gray-100 bg-gray-50">
          <h2 class="font-bold text-gray-700">Education & Course</h2>
        </div>
        <div class="p-6 grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label class="form-label">Education Level</label>
            <input v-model="form.level" type="text" class="form-input" />
          </div>
          <div>
            <label class="form-label">Qualification</label>
            <input v-model="form.qualification" type="text" class="form-input" />
          </div>
          <div>
            <label class="form-label">Course</label>
            <input v-model="form.course" type="text" class="form-input" />
          </div>
          <div>
            <label class="form-label">Duration</label>
            <input v-model="form.duration" type="text" class="form-input" />
          </div>
          <div class="col-span-2">
            <label class="form-label">Goals</label>
            <textarea v-model="form.goals" class="form-input resize-none" rows="3"></textarea>
          </div>
          <div class="col-span-2">
            <label class="form-label">Prior Experience</label>
            <textarea v-model="form.experience" class="form-input resize-none" rows="3"></textarea>
          </div>
          <div>
            <label class="form-label">Info Source</label>
            <input v-model="form.info_source" type="text" class="form-input" />
          </div>
        </div>

        <div class="px-6 py-5 border-t border-gray-100 bg-gray-50 flex items-center gap-4">
          <button type="submit" :disabled="isSaving" class="btn-primary">
            <span v-if="isSaving"><i class="fas fa-spinner fa-spin mr-2"></i>Saving...</span>
            <span v-else><i class="fas fa-save mr-2"></i>Save Changes</span>
          </button>
          <NuxtLink :to="`/admin/registrations/${id}`" class="text-gray-500 hover:text-gray-700 font-medium text-sm">Cancel</NuxtLink>
        </div>
      </form>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
useHead({ title: 'Edit Registration | Novel Admin' })
definePageMeta({ layout: false })

const route = useRoute()
const id = route.params.id

const { data: reg, pending } = await useFetch<any>(`/api/admin/registrations/${id}`)
const form = reactive<Record<string, any>>({})

watch(reg, (val) => { if (val) Object.assign(form, val) }, { immediate: true })

const isSaving = ref(false)
const successMsg = ref('')
const errorMsg = ref('')

async function save() {
  isSaving.value = true
  successMsg.value = ''
  errorMsg.value = ''
  try {
    await $fetch(`/api/admin/registrations/${id}`, { method: 'PUT', body: form })
    successMsg.value = 'Registration updated successfully.'
  } catch (e: any) {
    errorMsg.value = e?.data?.statusMessage || 'Error saving changes.'
  } finally {
    isSaving.value = false
  }
}
</script>
