<template>
  <div class="py-24 bg-gray-50">
    <div class="max-w-7xl mx-auto px-6 lg:px-10">
      <div class="text-center mb-16">
        <p class="section-subtitle mb-3">Our Courses</p>
        <h1 class="section-title">Explore All Courses</h1>
        <p class="mt-4 text-gray-500 max-w-2xl mx-auto">Choose from our range of industry-focused courses designed to make you job-ready in renewable energy, technology, and more.</p>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        <NuxtLink
          v-for="course in courses"
          :key="course.slug"
          :to="`/courses/${course.slug}`"
          class="card group"
        >
          <div class="relative overflow-hidden h-52">
            <img :src="`/img/${course.img}`" :alt="course.name" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            <div class="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent"></div>
            <div class="absolute bottom-3 left-3">
              <span class="px-2 py-1 bg-brand-500 text-white text-xs font-bold rounded-lg">{{ course.duration }}</span>
            </div>
          </div>
          <div class="p-6">
            <h2 class="font-heading font-bold text-lg text-gray-800 mb-2 group-hover:text-brand-500 transition-colors">{{ course.name }}</h2>
            <p class="text-sm text-gray-500 mb-5">{{ course.desc }}</p>
            <div class="flex items-center justify-between">
              <span class="text-brand-500 text-sm font-semibold flex items-center gap-1">
                View Details <i class="fas fa-arrow-right text-xs group-hover:translate-x-1 transition-transform"></i>
              </span>
              <button @click.prevent="navigateTo('/registration')" class="px-3 py-1.5 bg-brand-50 text-brand-600 text-xs font-bold rounded-lg hover:bg-brand-500 hover:text-white transition-colors">
                Enroll
              </button>
            </div>
          </div>
        </NuxtLink>
      </div>

      <div class="mt-16 bg-gradient-to-r from-brand-500 to-brand-700 rounded-3xl p-10 text-center text-white">
        <h2 class="font-heading text-3xl font-bold mb-3">Ready to Start Your Journey?</h2>
        <p class="text-brand-100 mb-6 max-w-xl mx-auto">Join over 1,100 graduates who launched their careers with Novel Academy. Applications are open year-round.</p>
        <NuxtLink to="/registration" class="inline-flex items-center gap-2 px-8 py-4 bg-white text-brand-600 font-bold rounded-full hover:bg-brand-50 transition-all shadow-xl">
          <i class="fas fa-graduation-cap"></i> Register Now
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
useHead({ title: 'Courses | Novel Academy' })

const courses = [
  { slug: 'solar-design-installation', name: 'Solar Design & Installation', img: 'solar install.png', desc: 'Master solar system design and installation with hands-on, industry-ready training.', duration: '3-12 Months' },
  { slug: 'solarpreneurship', name: 'Solarpreneurship', img: 'solarprenuer.png', desc: 'Learn how to start, manage, and scale a profitable solar energy business.', duration: '3-12 Months' },
  { slug: 'repair-maintenance', name: 'Repair & Maintenance', img: 'repair.png', desc: 'Gain practical skills to diagnose, repair, and maintain solar power systems.', duration: '3-12 Months' },
  { slug: 'hse-management', name: 'HSE Management', img: 'hse.png', desc: 'Train in essential Health, Safety, and Environment standards for safe project operations.', duration: '3-12 Months' },
  { slug: 'research-automation', name: 'Research & Automation', img: 'robotics.png', desc: 'Learn to automate processes and conduct data-driven research using modern technological tools.', duration: '3-12 Months' },
  { slug: 'web-development', name: 'Web Development', img: 'webdev.png', desc: 'Design and build modern, responsive websites using industry-standard tools.', duration: '3-12 Months' },
  { slug: 'app-development', name: 'App Development', img: 'app-dev.png', desc: 'Build beautiful, fast mobile apps using Flutter and Dart with hands-on projects.', duration: '3-12 Months' },
  { slug: 'digital-marketing', name: 'Digital Marketing', img: 'digital.png', desc: 'Learn result-driven digital marketing skills to grow brands and businesses online.', duration: '3-12 Months' },
]
</script>
