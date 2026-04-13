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

    <div v-else-if="reg" class="max-w-4xl" id="registration-content">
      <!-- PDF Header (Visible only in PDF/Print) -->
      <div class="print-only items-center justify-between mb-10 pb-6 border-b-2 border-brand-500">
        <div class="flex items-center gap-4">
          <img src="/img/novel_logo-removebg-preview.png" class="h-16 w-auto" alt="Logo" />
          <div>
            <h1 class="text-2xl font-heading font-black text-gray-900 leading-tight">Novel Academy</h1>
            <p class="text-brand-600 font-bold tracking-widest uppercase text-[10px]">Official Registration Record</p>
          </div>
        </div>
        <div class="text-right">
          <p class="text-xs font-bold text-gray-400 uppercase tracking-widest">Document ID</p>
          <p class="text-lg font-heading font-black text-gray-800">#{{ reg.id }}-{{ new Date().getFullYear() }}</p>
        </div>
      </div>

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
              
              <div class="pt-2 border-t border-gray-100 mt-2 space-y-3">
                <button @click="exportToCSV" class="flex items-center gap-3 w-full px-4 py-3 bg-green-50 text-green-700 font-semibold rounded-xl hover:bg-green-100 transition-colors text-sm">
                  <i class="fas fa-file-csv"></i> Download CSV
                </button>
                <button @click="exportToPDF" class="flex items-center gap-3 w-full px-4 py-3 bg-red-50 text-red-700 font-semibold rounded-xl hover:bg-red-100 transition-colors text-sm">
                  <i class="fas fa-file-pdf"></i> Print to PDF
                </button>
              </div>

              <button @click="deleteReg" class="flex items-center gap-3 w-full px-4 py-3 bg-gray-50 text-gray-500 font-semibold rounded-xl hover:bg-gray-100 transition-colors text-sm mt-4">
                <i class="fas fa-trash"></i> Delete Registration
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- PDF Footer (Visible only in PDF/Print) -->
      <div class="print-only items-center justify-between mt-12 pt-6 border-t border-gray-100 italic text-gray-400 text-[10px]">
        <div>
          Generated on {{ new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) }}
        </div>
        <div>
          novel-academy.com
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

import Papa from 'papaparse'

function exportToCSV() {
  if (!reg.value) return
  
  // Create a flat object with readable headers
  const data = [{
    'Registration ID': reg.value.id,
    'Full Name': reg.value.full_name,
    'Email': reg.value.email,
    'Phone': reg.value.phone,
    'DOB': reg.value.dob,
    'Address': reg.value.address,
    'Sex': reg.value.sex,
    'Nationality': reg.value.nationality,
    'State': reg.value.state,
    'Education Level': reg.value.level,
    'Qualification': reg.value.qualification,
    'Course': reg.value.course,
    'Duration': reg.value.duration,
    'Goals': reg.value.goals,
    'Experience': reg.value.experience,
    'Info Source': reg.value.info_source,
    'Submitted At': reg.value.submitted_at
  }]

  try {
    const csv = Papa.unparse(data)
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const fileName = `Registration_${reg.value.id}_${reg.value.full_name.replace(/\s+/g, '_')}.csv`
    
    link.href = URL.createObjectURL(blob)
    link.setAttribute('download', fileName)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  } catch (err) {
    console.error('CSV Export Error:', err)
  }
}

async function exportToPDF() {
  if (!reg.value) return
  
  // Dynamic import to avoid SSR issues
  const html2pdf = (await import('html2pdf.js')).default
  const element = document.getElementById('registration-content')
  
  const opt = {
    margin: 10,
    filename: `Registration_${reg.value.id}_${reg.value.full_name.replace(/\s+/g, '_')}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true, letterRendering: true },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
  }

  html2pdf().set(opt).from(element).save()
}
</script>

<style scoped>
.print-only {
  display: none !important;
}

@media print {
  .print-only {
    display: flex !important;
  }
  
  /* Hide UI elements */
  .lg\:col-span-1, 
  nav, 
  header, 
  .flex.items-center.gap-4 { 
    display: none !important; 
  }
  
  /* Expand main content */
  .max-w-4xl {
    max-width: 100% !important;
    width: 100% !important;
    margin: 0 !important;
    padding: 0 !important;
  }
  
  .lg\:col-span-2 {
    grid-column: span 3 / span 3 !important;
  }

  body {
    background: white !important;
  }
  
  /* Ensure backgrounds are kept */
  * {
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }
}
</style>

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
