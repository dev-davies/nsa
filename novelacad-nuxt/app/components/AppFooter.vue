<template>
  <footer class="bg-gray-900 text-gray-400 mt-20 relative">
    <!-- Overlay Top with Jagged Edges -->
    <img src="/img/overlay-top.png" alt="overlay" class="w-full h-auto block" />

    <div class="max-w-7xl mx-auto px-6 lg:px-10 pt-16 pb-10">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
        <!-- Brand -->
        <div>
          <NuxtLink to="/" class="flex items-center gap-2 mb-4">
            <i class="fas fa-book-reader text-brand-400 text-2xl"></i>
            <span class="text-white font-heading font-bold text-xl">Novel Academy</span>
          </NuxtLink>
          <p class="text-sm leading-relaxed mb-6">Where innovation meets sustainability!</p>
          <div class="space-y-2 text-sm">
            <p><i class="fas fa-map-marker-alt mr-2 text-brand-400"></i>76, Adekunle Fajuyi Road, Ibadan, Oyo State</p>
            <p><i class="fas fa-phone-alt mr-2 text-brand-400"></i>+234 811 369 5917</p>
            <p><i class="fas fa-envelope mr-2 text-brand-400"></i>info@novel-academy.com</p>
          </div>
          <div class="flex gap-4 mt-6">
            <a href="#" class="text-gray-500 hover:text-brand-400 transition-colors text-xl"><i class="fab fa-twitter"></i></a>
            <a href="#" class="text-gray-500 hover:text-brand-400 transition-colors text-xl"><i class="fab fa-facebook-f"></i></a>
            <a href="#" class="text-gray-500 hover:text-brand-400 transition-colors text-xl"><i class="fab fa-linkedin-in"></i></a>
            <a href="#" class="text-gray-500 hover:text-brand-400 transition-colors text-xl"><i class="fab fa-instagram"></i></a>
          </div>
        </div>

        <!-- Courses -->
        <div>
          <h3 class="text-white font-heading font-bold text-lg mb-5">Our Courses</h3>
          <ul class="space-y-2 text-sm">
            <li v-for="course in courses" :key="course.slug">
              <NuxtLink :to="`/courses/${course.slug}`" class="hover:text-brand-400 transition-colors flex items-center gap-2">
                <i class="fas fa-angle-right text-brand-500"></i>{{ course.name }}
              </NuxtLink>
            </li>
          </ul>
        </div>

        <!-- Quick Links -->
        <div>
          <h3 class="text-white font-heading font-bold text-lg mb-5">Quick Links</h3>
          <ul class="space-y-2 text-sm">
            <li><NuxtLink to="/registration" class="hover:text-brand-400 transition-colors flex items-center gap-2"><i class="fas fa-angle-right text-brand-500"></i>Registration</NuxtLink></li>
            <li><a href="/#about" class="hover:text-brand-400 transition-colors flex items-center gap-2"><i class="fas fa-angle-right text-brand-500"></i>About Us</a></li>
            <li><NuxtLink to="/courses" class="hover:text-brand-400 transition-colors flex items-center gap-2"><i class="fas fa-angle-right text-brand-500"></i>Courses</NuxtLink></li>
            <li><a href="/#contact" class="hover:text-brand-400 transition-colors flex items-center gap-2"><i class="fas fa-angle-right text-brand-500"></i>Contact</a></li>
            <li><NuxtLink to="/admin/login" class="hover:text-brand-400 transition-colors flex items-center gap-2"><i class="fas fa-angle-right text-brand-500"></i>Admin Login</NuxtLink></li>
          </ul>
        </div>
      </div>

      <div class="border-t border-gray-800 pt-6 flex flex-col sm:flex-row items-center justify-between text-sm gap-2">
        <p>&copy; {{ year }} <NuxtLink to="/" class="text-white hover:text-brand-400 transition-colors">Novel Academy</NuxtLink>. All Rights Reserved.</p>
        <p class="text-gray-700 hover:text-gray-500 transition-colors cursor-default">Designed by Davies</p>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
const year = new Date().getFullYear()

const courses = [
  { slug: 'solar-design-installation', name: 'Solar Design & Installation' },
  { slug: 'solarpreneurship', name: 'Solarpreneurship' },
  { slug: 'repair-maintenance', name: 'Repair & Maintenance' },
  { slug: 'hse-management', name: 'HSE Management' },
  { slug: 'ai-robotics', name: 'AI & Robotics' },
  { slug: 'web-development', name: 'Web Development' },
  { slug: 'digital-marketing', name: 'Digital Marketing' },
]
</script>
