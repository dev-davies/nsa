<template>
  <div class="py-16 bg-gray-50 min-h-screen">
    <div class="max-w-3xl mx-auto px-6">
      <!-- Header -->
      <div class="text-center mb-10">
        <span class="inline-flex items-center gap-2 px-4 py-1.5 bg-brand-50 text-brand-600 rounded-full text-sm font-semibold mb-4">
          <i class="fas fa-user-check"></i> Student Registration
        </span>
        <h1 class="section-title mb-3">Register for a Course</h1>
        <p class="text-gray-500">Join Novel Academy and start your journey towards a cleaner future</p>
      </div>

      <!-- Alerts -->
      <div v-if="successMsg" class="mb-6 p-4 bg-green-50 border border-green-200 rounded-2xl text-green-700 flex items-start gap-3">
        <i class="fas fa-check-circle text-green-500 mt-0.5 text-lg flex-shrink-0"></i>
        <div>
          <p class="font-bold">Application Submitted!</p>
          <p class="text-sm mt-0.5">{{ successMsg }}</p>
        </div>
      </div>
      <div v-if="errorMsg" class="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl text-red-700 flex items-start gap-3">
        <i class="fas fa-exclamation-circle text-red-500 mt-0.5 text-lg flex-shrink-0"></i>
        <div>
          <p class="font-bold">Submission Error</p>
          <p class="text-sm mt-0.5">{{ errorMsg }}</p>
        </div>
      </div>

      <form @submit.prevent="submitRegistration" class="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <!-- Honeypots -->
        <input type="text" v-model="honeypot1" style="position:absolute;left:-9999px;opacity:0;pointer-events:none" autocomplete="off" />
        <input type="text" v-model="honeypot2" style="position:absolute;left:-9999px;opacity:0;pointer-events:none" autocomplete="off" />

        <!-- Section: Personal Info -->
        <div class="px-8 py-6 border-b border-gray-100">
          <h2 class="flex items-center gap-2 font-heading font-bold text-gray-800 mb-6">
            <span class="w-8 h-8 bg-brand-500 text-white rounded-lg flex items-center justify-center text-sm"><i class="fas fa-user"></i></span>
            Personal Information
          </h2>
          <div class="space-y-5">
            <div>
              <label class="form-label">Full Name *</label>
              <input v-model="form.fullName" type="text" class="form-input" placeholder="Enter your full name" required />
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="form-label">Email Address *</label>
                <input v-model="form.email" type="email" class="form-input" placeholder="your.email@example.com" required />
              </div>
              <div>
                <label class="form-label">Date of Birth *</label>
                <input v-model="form.dob" type="date" class="form-input" required />
              </div>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="form-label">Phone Number *</label>
                <input v-model="form.phoneNumber" type="tel" class="form-input" placeholder="+234 812 345 6789" required />
              </div>
              <div>
                <label class="form-label">Sex *</label>
                <select v-model="form.sex" class="form-input" required>
                  <option value="">-- Select --</option>
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                  <option>Prefer not to say</option>
                </select>
              </div>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="form-label">Nationality *</label>
                <input v-model="form.nationality" type="text" class="form-input" placeholder="e.g. Nigerian" required />
              </div>
              <div>
                <label class="form-label">State/Province *</label>
                <input v-model="form.state" type="text" class="form-input" placeholder="e.g. Oyo State" required />
              </div>
            </div>
            <div>
              <label class="form-label">Home Address</label>
              <input v-model="form.address" type="text" class="form-input" placeholder="Enter your residential address" />
            </div>
          </div>
        </div>

        <!-- Section: Education -->
        <div class="px-8 py-6 border-b border-gray-100">
          <h2 class="flex items-center gap-2 font-heading font-bold text-gray-800 mb-6">
            <span class="w-8 h-8 bg-green-600 text-white rounded-lg flex items-center justify-center text-sm"><i class="fas fa-graduation-cap"></i></span>
            Educational Background
          </h2>
          <div class="space-y-5">
            <div>
              <label class="form-label">Previous Educational Level *</label>
              <select v-model="form.educationLevel" class="form-input" required>
                <option value="">-- Select --</option>
                <option>Primary School</option>
                <option>Secondary School</option>
                <option>High School</option>
                <option>National Diploma (ND)</option>
                <option>Higher National Diploma (HND)</option>
                <option>Bachelor's Degree</option>
                <option>Master's Degree</option>
                <option>Other</option>
              </select>
            </div>
            <div>
              <label class="form-label">Qualification/Certificate *</label>
              <input v-model="form.qualification" type="text" class="form-input" placeholder="e.g., WASSCE, NECO, O'Level" required />
            </div>
          </div>
        </div>

        <!-- Section: Course -->
        <div class="px-8 py-6 border-b border-gray-100">
          <h2 class="flex items-center gap-2 font-heading font-bold text-gray-800 mb-6">
            <span class="w-8 h-8 bg-amber-500 text-white rounded-lg flex items-center justify-center text-sm"><i class="fas fa-book"></i></span>
            Course Information
          </h2>
          <div class="space-y-5">
            <div>
              <label class="form-label">Select Course *</label>
              <select v-model="form.course" class="form-input" required>
                <option value="">-- Select a Course --</option>
                <option>Solar Design and Installation</option>
                <option>Solarpreneurship and Business Management</option>
                <option>Repair and Maintenance</option>
                <option>HSE (Health, Safety, and Environment) Management</option>
                <option>Artificial Intelligence and Robotics</option>
                <option>Web Design and Development</option>
                <option>App Development</option>
                <option>Digital Marketing</option>
              </select>
            </div>

            <div>
              <label class="form-label">Program Duration *</label>
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-1">
                <label
                  v-for="d in durations"
                  :key="d.value"
                  class="relative flex items-center gap-3 p-4 border-2 rounded-xl cursor-pointer transition-all"
                  :class="form.duration === d.value ? 'border-brand-500 bg-brand-50' : 'border-gray-200 hover:border-gray-300'"
                >
                  <input type="radio" v-model="form.duration" :value="d.value" class="sr-only" required />
                  <div class="w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0" :class="form.duration === d.value ? 'border-brand-500 bg-brand-500' : 'border-gray-300'">
                    <div v-if="form.duration === d.value" class="w-2 h-2 rounded-full bg-white"></div>
                  </div>
                  <span class="text-sm font-medium text-gray-700">{{ d.label }}</span>
                </label>
              </div>
            </div>

            <div>
              <label class="form-label">Your Goals for the Course *</label>
              <textarea v-model="form.courseGoals" class="form-input resize-none" rows="4" placeholder="Tell us what you hope to achieve from this course..." required></textarea>
            </div>
          </div>
        </div>

        <!-- Section: Additional Info -->
        <div class="px-8 py-6 border-b border-gray-100">
          <h2 class="flex items-center gap-2 font-heading font-bold text-gray-800 mb-6">
            <span class="w-8 h-8 bg-purple-600 text-white rounded-lg flex items-center justify-center text-sm"><i class="fas fa-info-circle"></i></span>
            Additional Information
          </h2>
          <div class="space-y-5">
            <div>
              <label class="form-label">Prior Experience (if any)</label>
              <textarea v-model="form.experience" class="form-input resize-none" rows="3" placeholder="Tell us about any relevant experience you have..."></textarea>
            </div>
            <div>
              <label class="form-label">How did you hear about us? *</label>
              <select v-model="form.infoSource" class="form-input" required>
                <option value="">-- Select --</option>
                <option value="Social Media">Social Media (Facebook, Twitter, Instagram etc.)</option>
                <option value="Friend/Family">Friend or Family</option>
                <option value="Advertisement">Advertisement</option>
                <option value="Internet Search">Internet Search (Google, Bing etc.)</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Submit -->
        <div class="px-8 py-6 bg-gray-50">
          <label class="flex items-start gap-3 mb-6 cursor-pointer">
            <input v-model="form.terms" type="checkbox" required class="mt-0.5 w-4 h-4 text-brand-500 rounded" />
            <span class="text-sm text-gray-600">I agree to the Terms and Conditions and Privacy Policy <span class="text-red-500">*</span></span>
          </label>
          <div class="flex gap-4">
            <button type="submit" :disabled="isSubmitting" class="btn-primary flex-1 justify-center">
              <span v-if="isSubmitting"><i class="fas fa-spinner fa-spin mr-2"></i>Submitting...</span>
              <span v-else><i class="fas fa-paper-plane mr-2"></i>Submit Registration</span>
            </button>
            <button type="reset" @click="resetForm" class="px-6 py-3 border-2 border-gray-200 text-gray-600 rounded-full font-semibold hover:border-gray-300 transition-colors">
              Clear
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
useHead({ title: 'Register | Novel Academy' })

const form = reactive({
  fullName: '', email: '', dob: '', phoneNumber: '', sex: '',
  nationality: '', state: '', address: '', educationLevel: '',
  qualification: '', course: '', duration: '', courseGoals: '',
  experience: '', infoSource: '', terms: false,
})

const durations = [
  { value: '6 Month Certificate Course', label: '6 Month Certificate' },
  { value: '1 Year Associate Diploma', label: '1 Year Diploma' },
  { value: '2 Year Diploma', label: '2 Year Diploma' },
]

const honeypot1 = ref('')
const honeypot2 = ref('')
const formStartTime = ref(Date.now() / 1000)
const isSubmitting = ref(false)
const successMsg = ref('')
const errorMsg = ref('')

function resetForm() {
  Object.assign(form, { fullName: '', email: '', dob: '', phoneNumber: '', sex: '', nationality: '', state: '', address: '', educationLevel: '', qualification: '', course: '', duration: '', courseGoals: '', experience: '', infoSource: '', terms: false })
  honeypot1.value = ''
  honeypot2.value = ''
  formStartTime.value = Date.now() / 1000
  successMsg.value = ''
  errorMsg.value = ''
}

async function submitRegistration() {
  isSubmitting.value = true
  successMsg.value = ''
  errorMsg.value = ''
  try {
    await $fetch('/api/register', {
      method: 'POST',
      body: {
        ...form,
        website: honeypot1.value,
        email_confirm: honeypot2.value,
        _form_start_time: formStartTime.value,
      }
    })
    successMsg.value = 'Your application has been received! We\'ll be in touch soon.'
    resetForm()
    window.scrollTo({ top: 0, behavior: 'smooth' })
  } catch (e: any) {
    errorMsg.value = e?.data?.statusMessage || e?.data?.message || 'An error occurred. Please try again.'
  } finally {
    isSubmitting.value = false
  }
}
</script>
