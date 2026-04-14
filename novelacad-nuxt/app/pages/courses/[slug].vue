<template>
  <div v-if="course">
    <!-- Hero -->
    <section class="relative bg-gradient-to-br from-gray-900 to-brand-900 text-white py-32 overflow-hidden">
      <div class="absolute inset-0">
        <img :src="`/img/${course.img}`" :alt="course.name" class="w-full h-full object-cover opacity-20" />
      </div>
      <div class="relative max-w-4xl mx-auto px-6 text-center">
        <NuxtLink to="/courses" class="inline-flex items-center gap-2 text-brand-300 hover:text-white text-sm font-semibold mb-6 transition-colors">
          <i class="fas fa-arrow-left"></i> All Courses
        </NuxtLink>
        <span class="inline-block px-4 py-1.5 bg-brand-500/30 border border-brand-400/30 rounded-full text-brand-200 text-sm font-semibold mb-4">
          {{ course.duration }}
        </span>
        <h1 class="font-heading text-4xl lg:text-6xl font-black mb-4">{{ course.name }}</h1>
        <p class="text-xl text-gray-300 max-w-2xl mx-auto">{{ course.desc }}</p>
        <div class="mt-8">
          <NuxtLink to="/registration" class="btn-primary text-base">
            <i class="fas fa-graduation-cap"></i> Enroll in This Course
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Course Details -->
    <section class="py-20 bg-white">
      <div class="max-w-6xl mx-auto px-6 lg:px-10">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <!-- Main Content -->
          <div class="lg:col-span-2 prose prose-gray max-w-none">
            <h2 class="font-heading text-2xl font-bold text-gray-800 mb-6">About This Course</h2>
            <p class="text-gray-600 leading-relaxed mb-6">{{ course.about }}</p>

            <h3 class="font-heading text-xl font-bold text-gray-800 mb-4 mt-8">What You'll Learn</h3>
            <ul class="space-y-3">
              <li v-for="item in course.outcomes" :key="item" class="flex items-start gap-3">
                <i class="fas fa-check-circle text-brand-500 mt-0.5 flex-shrink-0"></i>
                <span class="text-gray-600">{{ item }}</span>
              </li>
            </ul>

            <h3 class="font-heading text-xl font-bold text-gray-800 mb-4 mt-8">Who Is This For?</h3>
            <p class="text-gray-600 leading-relaxed">{{ course.audience }}</p>
          </div>

          <!-- Sidebar -->
          <div class="space-y-4">
            <!-- Course Card -->
            <div class="bg-gray-50 rounded-2xl border border-gray-100 p-6 sticky top-24">
              <img :src="`/img/${course.img}`" :alt="course.name" class="w-full h-40 object-cover rounded-xl mb-5" />
              <div class="space-y-3 mb-6">
                <div class="flex items-center justify-between text-sm">
                  <span class="text-gray-500 flex items-center gap-2"><i class="fas fa-clock"></i> Duration</span>
                  <span class="font-semibold text-gray-800">{{ course.duration }}</span>
                </div>
                <div class="flex items-center justify-between text-sm">
                  <span class="text-gray-500 flex items-center gap-2"><i class="fas fa-signal"></i> Level</span>
                  <span class="font-semibold text-gray-800">All Levels</span>
                </div>
                <div class="flex items-center justify-between text-sm">
                  <span class="text-gray-500 flex items-center gap-2"><i class="fas fa-certificate"></i> Certificate</span>
                  <span class="font-semibold text-green-600">Included</span>
                </div>
                <div class="flex items-center justify-between text-sm">
                  <span class="text-gray-500 flex items-center gap-2"><i class="fas fa-language"></i> Language</span>
                  <span class="font-semibold text-gray-800">English</span>
                </div>
              </div>
              <NuxtLink to="/registration" class="btn-primary w-full justify-center">
                <i class="fas fa-graduation-cap"></i> Enroll Now
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Other Courses -->
    <section class="py-16 bg-gray-50">
      <div class="max-w-7xl mx-auto px-6 lg:px-10">
        <h2 class="font-heading text-2xl font-bold text-gray-800 mb-8">Other Courses You Might Like</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <NuxtLink
            v-for="c in otherCourses"
            :key="c.slug"
            :to="`/courses/${c.slug}`"
            class="card group"
          >
            <div class="relative overflow-hidden h-36">
              <img :src="`/img/${c.img}`" :alt="c.name" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div class="absolute inset-0 bg-gradient-to-t from-gray-900/70 to-transparent"></div>
            </div>
            <div class="p-4">
              <h3 class="font-heading font-bold text-gray-800 group-hover:text-brand-500 transition-colors text-sm">{{ c.name }}</h3>
            </div>
          </NuxtLink>
        </div>
      </div>
    </section>
  </div>

  <!-- 404 if course not found -->
  <div v-else class="min-h-screen flex items-center justify-center">
    <div class="text-center">
      <h1 class="text-4xl font-bold text-gray-800 mb-4">Course Not Found</h1>
      <NuxtLink to="/courses" class="btn-primary">View All Courses</NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const slug = route.params.slug as string

const allCourses = [
  { slug: 'solar-design-installation', name: 'Solar Design & Installation', img: 'solar install.png', duration: '3-6 Months',
    desc: 'Master solar system design and installation with hands-on, industry-ready training.',
    about: 'This comprehensive course covers everything you need to know about solar photovoltaic system design, sizing, and installation. You will work with real equipment in our hands-on practical labs, learning how to assess sites, design systems, and install panels safely and efficiently.',
    outcomes: [
      'Design and size solar PV systems for residential and commercial applications',
      'Safely install solar panels, inverters, and battery storage systems',
      'Understand electrical wiring and connection standards',
      'Perform quality checks and system commissioning',
      'Troubleshoot and maintain installed solar systems',
    ],
    audience: 'This course is ideal for electricians, engineers, technicians, and anyone interested in entering the solar energy industry. No prior solar experience required.' },
  { slug: 'solarpreneurship', name: 'Solarpreneurship', img: 'solarprenuer.png', duration: '3-6 Months',
    desc: 'Learn how to start, manage, and scale a profitable solar energy business.',
    about: 'Solarpreneurship is designed for aspiring entrepreneurs who want to build and grow their own solar energy business. This course covers business strategy, financial planning, customer acquisition, and the technical knowledge needed to confidently pitch and deliver solar solutions.',
    outcomes: [
      'Develop a solid business plan for a solar energy venture',
      'Understand solar market dynamics and customer needs',
      'Price and quote solar projects profitably',
      'Manage projects, teams, and suppliers effectively',
      'Market your solar business and build a client base',
    ],
    audience: 'Suitable for entrepreneurs, business students, and professionals who want to enter the growing solar market as business owners or consultants.' },
  { slug: 'repair-maintenance', name: 'Repair & Maintenance', img: 'repair.png', duration: '3-6 Months',
    desc: 'Gain practical skills to diagnose, repair, and maintain solar power systems.',
    about: 'This course focuses on the technical skills needed to keep solar systems running at peak performance. You will learn to diagnose faults, repair damaged components, and perform preventive maintenance on all types of solar installations.',
    outcomes: [
      'Diagnose common solar system faults and failures',
      'Safely repair and replace solar panels, inverters, and batteries',
      'Use testing and diagnostic equipment',
      'Implement preventive maintenance schedules',
      'Document and report maintenance activities',
    ],
    audience: 'Ideal for technicians, electricians, and solar installers who want to specialise in after-sales service and maintenance.' },
  { slug: 'hse-management', name: 'HSE Management', img: 'hse.png', duration: '3-6 Months',
    desc: 'Train in essential Health, Safety, and Environment standards for safe project operations.',
    about: 'This course provides comprehensive training in Health, Safety, and Environment (HSE) management principles specifically relevant to solar and renewable energy projects. You will learn to identify hazards, manage risks, and ensure compliance with industry safety standards.',
    outcomes: [
      'Conduct site hazard identification and risk assessments',
      'Develop and implement HSE management plans',
      'Understand Nigerian and international safety regulations',
      'Manage emergency response procedures',
      'Lead safety inductions and team briefings',
    ],
    audience: 'Suitable for project managers, site supervisors, safety officers, and anyone working on renewable energy construction projects.' },
  { slug: 'ai-robotics', name: 'Practical AI & Robotics', img: 'robotics.png', duration: '6-24 Months',
    desc: 'Build real AI and robotics solutions through practical, beginner-friendly projects.',
    about: 'This hands-on course introduces you to Artificial Intelligence and Robotics through real-world projects. You will learn programming fundamentals, machine learning concepts, and how to build and program physical robotic systems.',
    outcomes: [
      'Understand core AI and machine learning concepts',
      'Program robots using industry-standard tools',
      'Build and test robotic prototypes',
      'Apply AI to solve real-world automation problems',
      'Present and demonstrate working AI/robotics projects',
    ],
    audience: 'Open to beginners with or without a technical background. Ideal for students, engineers, and tech enthusiasts curious about AI and robotics.' },
  { slug: 'app-development', name: 'App Development', img: 'app-dev.png', duration: '6-24 Months',
    desc: 'Build beautiful, fast mobile apps using Flutter and Dart with hands-on projects.',
    about: 'This comprehensive course teaches you mobile app development using Flutter and Dart, two of the fastest-growing technologies for cross-platform app creation. You will learn from basic principles to building real, production-ready applications that work on both iOS and Android from a single codebase.',
    outcomes: [
      'Master Dart programming language and Flutter framework fundamentals',
      'Build responsive, beautiful user interfaces for mobile apps',
      'Implement state management and app architecture best practices',
      'Integrate APIs and work with backend services',
      'Deploy and publish apps to Apple App Store and Google Play Store',
      'Build a portfolio of working mobile applications',
    ],
    audience: 'Perfect for aspiring mobile developers, software engineers, and anyone interested in creating cross-platform apps. No prior app development experience required.' },
  { slug: 'digital-marketing', name: 'Digital Marketing', img: 'digital.png', duration: '6-24 Months',
    desc: 'Learn result-driven digital marketing skills to grow brands and businesses online.',
    about: 'Learn to market businesses and products effectively in the digital world. This course covers social media marketing, SEO, email marketing, paid advertising, and analytics — giving you a comprehensive toolkit to generate leads and drive sales online.',
    outcomes: [
      'Create and manage social media marketing campaigns',
      'Optimise websites for search engines (SEO)',
      'Run cost-effective paid advertising campaigns',
      'Build and manage email marketing lists',
      'Measure and report on marketing performance',
    ],
    audience: 'Ideal for business owners, marketers, and anyone who wants to grow a brand or start a marketing career in the digital space.' },
]

const course = computed(() => allCourses.find(c => c.slug === slug))
const otherCourses = computed(() => allCourses.filter(c => c.slug !== slug).slice(0, 3))

useHead(() => ({
  title: course.value ? `${course.value.name} | Novel Academy` : 'Course Not Found',
}))
</script>
