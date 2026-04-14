<template>
  <footer class="bg-gray-900 text-gray-200">
    <div class="max-w-7xl mx-auto px-6 lg:px-10 py-14">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-10">
        <div class="md:col-span-2">
          <div class="flex items-center gap-2 mb-3">
            <i class="fas fa-book-reader text-brand-400 text-xl"></i>
            <span class="font-heading font-extrabold text-white">Novel Academy</span>
          </div>
          <p class="text-sm text-gray-300 max-w-xl leading-relaxed">
            Where innovation meets sustainability. World-class training in Solar Energy, AI & Robotics, Web Development, Digital Marketing, and more.
          </p>

          <div class="mt-6 flex flex-wrap gap-3">
            <NuxtLink to="/registration" class="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-500 text-white font-bold hover:bg-brand-600 transition-colors text-sm">
              <i class="fas fa-graduation-cap"></i> Apply Now
            </NuxtLink>
            <NuxtLink to="/courses" class="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-white/15 text-white font-bold hover:bg-white/10 transition-colors text-sm">
              <i class="fas fa-book"></i> Browse Courses
            </NuxtLink>
          </div>
        </div>

        <div>
          <h3 class="text-white font-bold mb-4">Quick Links</h3>
          <ul class="space-y-2 text-sm">
            <li><NuxtLink to="/" class="hover:text-white">Home</NuxtLink></li>
            <li><NuxtLink to="/courses" class="hover:text-white">Courses</NuxtLink></li>
            <li><NuxtLink to="/registration" class="hover:text-white">Registration</NuxtLink></li>
            <li><NuxtLink to="/admin/login" class="hover:text-white">Admin</NuxtLink></li>
          </ul>
        </div>

        <div>
          <h3 class="text-white font-bold mb-4">Contact</h3>
          <ul class="space-y-3 text-sm text-gray-300">
            <li class="flex gap-3">
              <i class="fas fa-map-marker-alt text-brand-400 mt-1"></i>
              <span>76, Adekunle Fajuyi Road Ibadan. Opposite Gate 3, Adamasingba Stadium, Oyo State</span>
            </li>
            <li class="flex gap-3">
              <i class="fas fa-phone-alt text-brand-400 mt-1"></i>
              <a class="hover:text-white" href="tel:+2348113695917">+234 811 369 5917</a>
            </li>
            <li class="flex gap-3">
              <i class="fas fa-envelope text-brand-400 mt-1"></i>
              <a class="hover:text-white" href="mailto:info@novel-academy.com">info@novel-academy.com</a>
            </li>
          </ul>
        </div>
      </div>

      <div class="mt-10 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-gray-400">
        <div>© {{ new Date().getFullYear() }} Novel Academy. All rights reserved.</div>
        <div class="flex items-center gap-4">
          <a href="/#contact" class="hover:text-gray-200">Support</a>
          <a href="/courses" class="hover:text-gray-200">Courses</a>
        </div>
      </div>
    </div>
  </footer>
</template>

