<template>
  <NuxtLayout name="admin">
    <template #header>
      <div class="flex items-center gap-4">
        <NuxtLink to="/admin/dashboard" class="text-gray-400 hover:text-gray-600 transition-colors">
          <i class="fas fa-arrow-left"></i>
        </NuxtLink>
        <h1 class="text-xl font-heading font-bold text-gray-800">Registration #{{ reg?.id }}</h1>
      </div>
    </template>

    <div v-if="pending" class="flex items-center justify-center py-20 text-gray-400">
      <i class="fas fa-spinner fa-spin mr-3 text-2xl"></i> Loading...
    </div>

    <div v-else-if="reg" class="max-w-4xl">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Main Info -->
        <div class="lg:col-span-2 space-y-6">
          <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div class="px-6 py-4 border-b border-gray-100 bg-gray-50 flex items-center gap-2">
              <i class="fas fa-user text-brand-500"></i>
              <h2 class="font-bold text-gray-700">Personal Information</h2>
            </div>
            <div class="p-6 grid grid-cols-2 gap-4">
              <field label="Full Name" :value="reg.full_name" />
              <field label="Email" :value="reg.email" />
              <field label="Phone" :value="reg.phone" />
              <field label="Date of Birth" :value="reg.dob" />
              <field label="Sex" :value="reg.sex" />
              <field label="Nationality" :value="reg.nationality" />
              <field label="State" :value="reg.state" />
              <field label="Address" :value="reg.address" />
            </div>
          </div>
          <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div class="px-6 py-4 border-b border-gray-100 bg-gray-50 flex items-center gap-2">
              <i class="fas fa-graduation-cap text-green-500"></i>
              <h2 class="font-bold text-gray-700">Education & Course</h2>
            </div>
            <div class="p-6 grid grid-cols-2 gap-4">
              <field label="Education Level" :value="reg.level" />
              <field label="Qualification" :value="reg.qualification" />
              <field label="Course" :value="reg.course" />
              <field label="Duration" :value="reg.duration" />
              <div class="col-span-2">
                <field label="Goals" :value="reg.goals" />
              </div>
              <div class="col-span-2">
                <field label="Prior Experience" :value="reg.experience || 'None provided'" />
              </div>
              <field label="How They Heard" :value="reg.info_source" />
              <field label="Submitted At" :value="reg.submitted_at" />
            </div>
          </div>
        </div>

        <!-- Actions Sidebar -->
        <div class="space-y-4">
          <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h3 class="font-bold text-gray-700 mb-4">Actions</h3>
            <div class="space-y-3">
              <NuxtLink :to="`/admin/registrations/${reg.id}/edit`" class="flex items-center gap-3 w-full px-4 py-3 bg-amber-50 text-amber-700 font-semibold rounded-xl hover:bg-amber-100 transition-colors text-sm">
                <i class="fas fa-edit"></i> Edit Registration
              </NuxtLink>
              <a :href="`https://mail.google.com/mail/?view=cm&fs=1&to=${reg.email}`" target="_blank" class="flex items-center gap-3 w-full px-4 py-3 bg-brand-50 text-brand-700 font-semibold rounded-xl hover:bg-brand-100 transition-colors text-sm">
                <i class="fas fa-envelope"></i> Email Applicant (Gmail)
              </a>
              <button @click="deleteReg" class="flex items-center gap-3 w-full px-4 py-3 bg-red-50 text-red-700 font-semibold rounded-xl hover:bg-red-100 transition-colors text-sm">
                <i class="fas fa-trash"></i> Delete Registration
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="text-center py-20">
      <p class="text-gray-500">Registration not found.</p>
      <NuxtLink to="/admin/dashboard" class="btn-primary mt-4 inline-flex">Back to Dashboard</NuxtLink>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
useHead({ title: 'Registration Detail | Novel Admin' })
definePageMeta({ layout: false })

const route = useRoute()
const id = route.params.id

const { data: reg, pending } = await useFetch<any>(`/api/admin/registrations/${id}`)

async function deleteReg() {
  if (!confirm('Delete this registration? This cannot be undone.')) return
  await $fetch(`/api/admin/registrations/${id}`, { method: 'DELETE' })
  navigateTo('/admin/dashboard')
}
</script>

<!-- Inline sub-component for field display -->
<script lang="ts">
import { defineComponent, h } from 'vue'
const field = defineComponent({
  props: { label: String, value: String },
  render() {
    return h('div', [
      h('p', { class: 'text-xs font-bold text-gray-400 uppercase tracking-wider mb-0.5' }, this.label),
      h('p', { class: 'text-gray-800 font-medium text-sm' }, this.value || '—'),
    ])
  }
})
export default { components: { field } }
</script>
