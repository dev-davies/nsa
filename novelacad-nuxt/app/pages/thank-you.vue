<template>
  <div class="min-h-screen bg-gradient-to-br from-brand-500 to-brand-800 flex items-center justify-center px-6 py-24">
    <div class="max-w-lg w-full text-center text-white">
      <div class="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-8 backdrop-blur-sm">
        <i class="fas fa-check-circle text-5xl text-white"></i>
      </div>
      <h1 class="font-heading text-4xl font-black mb-4">Application Received!</h1>
      <p class="text-brand-100 text-lg mb-2">Thank you for applying to Novel Academy.</p>
      <p class="text-brand-200 mb-10">Our admissions team will review your application and reach out to you shortly with the next steps.</p>

      <div class="bg-white/10 backdrop-blur rounded-2xl p-6 border border-white/20 mb-8 text-left">
        <h3 class="font-bold text-lg mb-3 text-center">What Happens Next?</h3>
        <ul class="space-y-3">
          <li class="flex items-start gap-3 text-sm">
            <span class="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-xs mt-0.5">1</span>
            <span>We'll review your application within 2–3 business days</span>
          </li>
          <li class="flex items-start gap-3 text-sm">
            <span class="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-xs mt-0.5">2</span>
            <span>You'll receive a confirmation email with your registration details</span>
          </li>
          <li class="flex items-start gap-3 text-sm">
            <span class="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-xs mt-0.5">3</span>
            <span>Our team will contact you to guide you through the enrollment process</span>
          </li>
        </ul>
      </div>

      <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <NuxtLink to="/" class="inline-flex items-center gap-2 px-6 py-3 bg-white text-brand-600 font-bold rounded-full hover:bg-brand-50 transition-all shadow-lg">
          <i class="fas fa-home"></i> Back to Home
        </NuxtLink>
        <NuxtLink to="/courses" class="inline-flex items-center gap-2 px-6 py-3 border-2 border-white text-white font-bold rounded-full hover:bg-white/10 transition-all">
          <i class="fas fa-book"></i> Explore Courses
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
useHead({ title: 'Application Received | Novel Academy' })
definePageMeta({ layout: false })  // Full-screen page, no nav/footer
</script>
