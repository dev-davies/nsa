<template>
  <NuxtLayout name="admin">
    <template #header>
      <h1 class="text-xl font-heading font-bold text-gray-800">Dashboard</h1>
    </template>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div v-for="stat in stats" :key="stat.label" class="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-center gap-4">
        <div class="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" :class="stat.bg">
          <i :class="stat.icon" class="text-white text-lg"></i>
        </div>
        <div>
          <div class="text-2xl font-heading font-black text-gray-800">{{ stat.value }}</div>
          <div class="text-xs text-gray-500 font-medium">{{ stat.label }}</div>
        </div>
      </div>
    </div>

    <!-- Registrations Table -->
    <div class="bg-white rounded-2xl border border-gray-100 shadow-sm mb-8">
      <div class="flex items-center justify-between px-6 py-4 border-b border-gray-100">
        <h2 class="font-heading font-bold text-gray-800">Registrations</h2>
        <div class="flex items-center gap-3">
          <input v-model="search" type="text" placeholder="Search..." class="form-input !py-2 !text-sm w-48" />
          <button
            type="button"
            @click="exportSelectedPdf"
            :disabled="!selectedRegistrationIds.length"
            class="flex items-center gap-2 px-4 py-2 bg-red-600 text-white text-sm font-semibold rounded-xl hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            :title="selectedRegistrationIds.length ? `Export ${selectedRegistrationIds.length} selected` : 'Select at least one registration to export'"
          >
            <i class="fas fa-file-pdf"></i> PDF ({{ selectedRegistrationIds.length || 0 }})
          </button>
          <a href="/api/admin/registrations/export/csv" class="flex items-center gap-2 px-4 py-2 bg-green-600 text-white text-sm font-semibold rounded-xl hover:bg-green-700 transition-colors">
            <i class="fas fa-download"></i> CSV
          </a>
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50 border-b border-gray-100">
            <tr>
              <th class="th w-10">
                <input
                  type="checkbox"
                  class="h-4 w-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500"
                  :checked="allVisibleSelected"
                  :indeterminate="someVisibleSelected && !allVisibleSelected"
                  @change="toggleSelectAllVisible"
                  :disabled="!filteredRegistrations.length"
                  title="Select all visible"
                />
              </th>
              <th class="th">ID</th>
              <th class="th">Name</th>
              <th class="th">Email</th>
              <th class="th">Phone</th>
              <th class="th">Course</th>
              <th class="th">Submitted</th>
              <th class="th">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="pending" class="text-center">
              <td colspan="8" class="py-10 text-gray-400"><i class="fas fa-spinner fa-spin mr-2"></i>Loading...</td>
            </tr>
            <tr v-else-if="!filteredRegistrations.length" class="text-center">
              <td colspan="8" class="py-10 text-gray-400">No registrations found.</td>
            </tr>
            <tr v-for="reg in filteredRegistrations" :key="reg.id" class="border-b border-gray-50 hover:bg-gray-50 transition-colors">
              <td class="td">
                <input
                  type="checkbox"
                  class="h-4 w-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500"
                  :checked="selectedRegistrationIds.includes(reg.id)"
                  @change="toggleRegistrationSelection(reg.id)"
                  :aria-label="`Select registration #${reg.id}`"
                />
              </td>
              <td class="td text-gray-500 text-sm">#{{ reg.id }}</td>
              <td class="td font-medium text-gray-800">{{ reg.full_name }}</td>
              <td class="td text-sm text-gray-600">{{ reg.email }}</td>
              <td class="td text-sm text-gray-600">{{ reg.phone }}</td>
              <td class="td"><span class="px-2 py-1 bg-brand-50 text-brand-700 text-xs font-semibold rounded-lg">{{ reg.course }}</span></td>
              <td class="td text-sm text-gray-500">{{ formatDate(reg.submitted_at) }}</td>
              <td class="td">
                <div class="flex items-center gap-2">
                  <NuxtLink :to="`/admin/registrations/${reg.id}`" class="p-1.5 text-brand-500 hover:bg-brand-50 rounded-lg transition-colors" title="View">
                    <i class="fas fa-eye text-sm"></i>
                  </NuxtLink>
                  <NuxtLink :to="`/admin/registrations/${reg.id}/edit`" class="p-1.5 text-amber-500 hover:bg-amber-50 rounded-lg transition-colors" title="Edit">
                    <i class="fas fa-edit text-sm"></i>
                  </NuxtLink>
                  <button @click="deleteReg(reg.id)" class="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
                    <i class="fas fa-trash text-sm"></i>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Messages Table -->
    <div class="bg-white rounded-2xl border border-gray-100 shadow-sm mb-8">
      <div class="px-6 py-4 border-b border-gray-100">
        <h2 class="font-heading font-bold text-gray-800">Contact Messages</h2>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50 border-b border-gray-100">
            <tr>
              <th class="th">From</th>
              <th class="th">Email</th>
              <th class="th">Subject</th>
              <th class="th">Date</th>
              <th class="th">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="msgPending" class="text-center">
              <td colspan="5" class="py-10 text-gray-400"><i class="fas fa-spinner fa-spin mr-2"></i>Loading...</td>
            </tr>
            <tr v-else-if="!messages.length" class="text-center">
              <td colspan="5" class="py-10 text-gray-400">No messages yet.</td>
            </tr>
            <tr v-for="msg in messages" :key="msg.id" class="border-b border-gray-50 hover:bg-gray-50">
              <td class="td font-medium text-gray-800">{{ msg.name }}</td>
              <td class="td text-sm text-gray-600">{{ msg.email }}</td>
              <td class="td text-sm text-gray-600 max-w-xs truncate">{{ msg.subject || '(No subject)' }}</td>
              <td class="td text-sm text-gray-500">{{ formatDate(msg.submitted_at) }}</td>
              <td class="td">
                <button @click="viewMessage(msg)" class="p-1.5 text-brand-500 hover:bg-brand-50 rounded-lg transition-colors" title="View Message">
                  <i class="fas fa-eye text-sm"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Admin Users Table (master only) -->
    <div v-if="sessionData?.role === 'master'" class="bg-white rounded-2xl border border-gray-100 shadow-sm">
      <div class="flex items-center justify-between px-6 py-4 border-b border-gray-100">
        <h2 class="font-heading font-bold text-gray-800">Admin Users</h2>
        <button @click="showCreateAdmin = !showCreateAdmin" class="flex items-center gap-2 px-4 py-2 bg-brand-500 text-white text-sm font-semibold rounded-xl hover:bg-brand-600 transition-colors">
          <i class="fas fa-plus"></i> Add Admin
        </button>
      </div>

      <!-- Create Admin Form -->
      <div v-if="showCreateAdmin" class="px-6 py-5 bg-gray-50 border-b border-gray-100">
        <h3 class="font-bold text-gray-700 mb-4 text-sm">Create New Admin</h3>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <input v-model="newAdmin.username" type="text" class="form-input !py-2 !text-sm" placeholder="Username" />
          <input v-model="newAdmin.email" type="email" class="form-input !py-2 !text-sm" placeholder="Email" />
          <input v-model="newAdmin.password" type="password" class="form-input !py-2 !text-sm" placeholder="Password" />
          <div class="flex gap-2">
            <select v-model="newAdmin.role" class="form-input !py-2 !text-sm flex-1">
              <option value="admin">Admin</option>
              <option value="master">Master</option>
            </select>
            <button @click="createAdmin" class="px-4 py-2 bg-brand-500 text-white text-sm font-bold rounded-xl hover:bg-brand-600 transition-colors">Create</button>
          </div>
        </div>
        <p v-if="adminMsg" class="text-sm mt-3" :class="adminMsg.includes('success') || adminMsg.includes('created') ? 'text-green-600' : 'text-red-600'">{{ adminMsg }}</p>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50 border-b border-gray-100">
            <tr>
              <th class="th">Username</th>
              <th class="th">Email</th>
              <th class="th">Role</th>
              <th class="th">Created</th>
              <th class="th">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="admin in admins" :key="admin.id" class="border-b border-gray-50 hover:bg-gray-50">
              <td class="td font-medium text-gray-800">{{ admin.username }}</td>
              <td class="td text-sm text-gray-600">{{ admin.email }}</td>
              <td class="td">
                <span class="px-2 py-1 text-xs font-bold rounded-lg" :class="admin.role === 'master' ? 'bg-amber-50 text-amber-700' : 'bg-gray-100 text-gray-600'">
                  {{ admin.role }}
                </span>
              </td>
              <td class="td text-sm text-gray-500">{{ formatDate(admin.created_at) }}</td>
              <td class="td">
                <button @click="deleteAdmin(admin.id)" class="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                  <i class="fas fa-trash text-sm"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Message View Modal -->
    <div v-if="showViewModal && selectedMessage" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div class="fixed inset-0 bg-gray-900/60 backdrop-blur-sm" @click="showViewModal = false"></div>
      <div class="bg-white rounded-3xl w-full max-w-2xl shadow-2xl relative z-10 overflow-hidden animate-in fade-in zoom-in duration-200">
        <div class="px-8 py-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <div>
            <h3 class="text-xl font-heading font-black text-gray-800">Message Details</h3>
            <p class="text-xs text-gray-500 font-medium mt-1">From {{ selectedMessage.name }} on {{ formatDate(selectedMessage.submitted_at) }}</p>
          </div>
          <button @click="showViewModal = false" class="w-10 h-10 rounded-xl flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-all">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="p-8">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div class="space-y-1">
              <span class="text-[10px] uppercase tracking-wider font-bold text-gray-400 block ml-1">Sender</span>
              <div class="p-4 bg-gray-50 rounded-2xl border border-gray-100 font-medium text-gray-800 flex items-center gap-3">
                <div class="w-8 h-8 rounded-lg bg-brand-100 text-brand-600 flex items-center justify-center flex-shrink-0">
                  <i class="fas fa-user text-xs"></i>
                </div>
                {{ selectedMessage.name }}
              </div>
            </div>
            <div class="space-y-1">
              <span class="text-[10px] uppercase tracking-wider font-bold text-gray-400 block ml-1">Email Address</span>
              <div class="p-4 bg-gray-50 rounded-2xl border border-gray-100 text-gray-600 flex items-center gap-3">
                <div class="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0">
                  <i class="fas fa-envelope text-xs"></i>
                </div>
                {{ selectedMessage.email }}
              </div>
            </div>
          </div>
          
          <div class="space-y-1 mb-8">
            <span class="text-[10px] uppercase tracking-wider font-bold text-gray-400 block ml-1">Subject</span>
            <div class="p-4 bg-gray-50 rounded-2xl border border-gray-100 font-bold text-gray-800">
              {{ selectedMessage.subject || '(No Subject)' }}
            </div>
          </div>

          <div class="space-y-1">
            <span class="text-[10px] uppercase tracking-wider font-bold text-gray-400 block ml-1">Message Body</span>
            <div class="p-6 bg-white rounded-2xl border border-gray-100 text-gray-700 leading-relaxed whitespace-pre-wrap whitespace-normal break-words max-h-60 overflow-y-auto custom-scrollbar">
              {{ selectedMessage.message }}
            </div>
          </div>
        </div>
        <div class="px-8 py-5 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
          <a :href="`https://mail.google.com/mail/?view=cm&fs=1&to=${selectedMessage.email}&su=Re: ${encodeURIComponent(selectedMessage.subject || '')}`" target="_blank" class="px-6 py-2.5 bg-brand-500 text-white font-bold rounded-xl hover:bg-brand-600 transition-all shadow-lg shadow-brand-500/20 flex items-center gap-2">
            <i class="fas fa-reply text-xs"></i>
            Reply via Gmail
          </a>
          <button @click="showViewModal = false" class="px-6 py-2.5 bg-white text-gray-700 border border-gray-200 font-bold rounded-xl hover:bg-gray-50 transition-all">Close</button>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
useHead({ title: 'Dashboard | Novel Admin' })
definePageMeta({ layout: false })

const search = ref('')

const { data: sessionData } = await useFetch<{ loggedIn: boolean; role: string; username: string }>('/api/admin/session')
const { data: registrations, pending, refresh: refreshRegs } = await useFetch<any[]>('/api/admin/registrations')
const { data: messages, pending: msgPending } = await useFetch<any[]>('/api/admin/messages', { default: () => [] })
const { data: admins, refresh: refreshAdmins } = await useFetch<any[]>('/api/admin/admins')

const selectedRegistrationIds = ref<number[]>([])

const filteredRegistrations = computed(() => {
  if (!registrations.value) return []
  const q = search.value.toLowerCase()
  if (!q) return registrations.value
  return registrations.value.filter(r =>
    [r.full_name, r.email, r.course, r.phone].some(v => String(v).toLowerCase().includes(q))
  )
})

const visibleRegistrationIds = computed(() => filteredRegistrations.value.map(r => r.id))

const allVisibleSelected = computed(() => {
  const ids = visibleRegistrationIds.value
  if (!ids.length) return false
  return ids.every(id => selectedRegistrationIds.value.includes(id))
})

const someVisibleSelected = computed(() => {
  const ids = visibleRegistrationIds.value
  if (!ids.length) return false
  return ids.some(id => selectedRegistrationIds.value.includes(id))
})

function toggleRegistrationSelection(id: number) {
  const cur = selectedRegistrationIds.value
  if (cur.includes(id)) {
    selectedRegistrationIds.value = cur.filter(x => x !== id)
  } else {
    selectedRegistrationIds.value = [...cur, id]
  }
}

function toggleSelectAllVisible() {
  const visibleIds = visibleRegistrationIds.value
  if (!visibleIds.length) return

  if (allVisibleSelected.value) {
    // unselect visible
    selectedRegistrationIds.value = selectedRegistrationIds.value.filter(id => !visibleIds.includes(id))
    return
  }

  // select visible (merge unique)
  const next = new Set(selectedRegistrationIds.value)
  for (const id of visibleIds) next.add(id)
  selectedRegistrationIds.value = Array.from(next)
}

function exportSelectedPdf() {
  if (!selectedRegistrationIds.value.length) {
    alert('Select at least one registration to export.')
    return
  }

  const ids = selectedRegistrationIds.value.join(',')
  const url = `/api/admin/registrations/export/pdf?export_type=selected&selected_ids=${encodeURIComponent(ids)}`
  if (process.client) {
    window.location.href = url
  }
}

const stats = computed(() => [
  { label: 'Total Registrations', value: registrations.value?.length ?? 0, icon: 'fas fa-user-graduate', bg: 'bg-brand-500' },
  { label: 'Contact Messages', value: messages.value?.length ?? 0, icon: 'fas fa-envelope', bg: 'bg-green-600' },
  { label: 'Admin Users', value: admins.value?.length ?? 0, icon: 'fas fa-shield-alt', bg: 'bg-amber-500' },
  { label: 'Active Courses', value: 7, icon: 'fas fa-book', bg: 'bg-purple-600' },
])

function formatDate(d: string) {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}

async function deleteReg(id: number) {
  if (!confirm(`Delete registration #${id}?`)) return
  await $fetch(`/api/admin/registrations/${id}`, { method: 'DELETE' })
  await refreshRegs()
  selectedRegistrationIds.value = selectedRegistrationIds.value.filter(x => x !== id)
}

// Admin management
const showCreateAdmin = ref(false)
const adminMsg = ref('')
const newAdmin = reactive({ username: '', email: '', password: '', role: 'admin' })

async function createAdmin() {
  adminMsg.value = ''
  try {
    const res = await $fetch<{ message: string }>('/api/admin/admins/create', { method: 'POST', body: { ...newAdmin } })
    adminMsg.value = res.message
    Object.assign(newAdmin, { username: '', email: '', password: '', role: 'admin' })
    await refreshAdmins()
  } catch (e: any) {
    adminMsg.value = e?.data?.statusMessage || 'Error creating admin.'
  }
}

async function deleteAdmin(id: number) {
  if (!confirm('Delete this admin user?')) return
  try {
    await $fetch(`/api/admin/admins/${id}`, { method: 'DELETE' })
    await refreshAdmins()
  } catch (e: any) {
    alert(e?.data?.statusMessage || 'Error deleting admin.')
  }
}

// Message Modal
const showViewModal = ref(false)
const selectedMessage = ref<any>(null)

function viewMessage(msg: any) {
  selectedMessage.value = msg
  showViewModal.value = true
}
</script>

<style scoped>
.th { @apply px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider; }
.td { @apply px-4 py-3; }
</style>
