<template>
  <footer class="relative bg-[#0b0f2b] text-gray-200">
    <!-- jagged edge -->
    <div class="absolute top-0 left-0 right-0 w-full h-auto -translate-y-[1px]">
      <img src="/img/overlay-top.png" alt="" class="w-full h-auto" />
    </div>

    <div class="max-w-7xl mx-auto px-6 lg:px-10 pt-24 pb-12">
      <div class="flex flex-col items-center justify-center gap-2 mb-12 text-center">
        <div class="flex items-center gap-3">
          <img src="/img/novel_logo-removebg-preview.png" alt="Novel Academy" class="h-14 w-auto object-contain" />
          <span class="font-heading font-black text-white tracking-wide">NOVEL ACADEMY</span>
        </div>
        <p class="text-xs text-gray-400">Where innovation meets sustainability!</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-10">
        <!-- Get in touch -->
        <div>
          <h3 class="text-white font-bold mb-5">Get In Touch</h3>
          <ul class="space-y-3 text-sm text-gray-300">
            <li class="flex gap-3">
              <i class="fas fa-map-marker-alt text-gray-300 mt-1"></i>
              <span>76, Adekunle Fajuyi Road Ibadan. Opposite Gate 3, Adamasingba Stadium, Ibadan Oyo State</span>
            </li>
            <li class="flex gap-3 items-center">
              <i class="fas fa-phone-alt text-gray-300"></i>
              <a class="hover:text-white" href="tel:+2348113695917">+2348113695917</a>
            </li>
            <li class="flex gap-3 items-start">
              <i class="fas fa-envelope text-gray-300 mt-1"></i>
              <span>
                <a class="hover:text-white" href="mailto:novelsolaracademy@gmail.com">novelsolaracademy@gmail.com</a>
                <span class="text-gray-500 mx-1">|</span>
                <a class="hover:text-white" href="mailto:info@novel-academy.com">info@novel-academy.com</a>
              </span>
            </li>
          </ul>

          <div class="mt-6 flex items-center gap-4 text-lg">
            <a href="#" class="hover:text-white" aria-label="Twitter"><i class="fab fa-twitter"></i></a>
            <a href="#" class="hover:text-white" aria-label="Facebook"><i class="fab fa-facebook-f"></i></a>
            <a href="#" class="hover:text-white" aria-label="LinkedIn"><i class="fab fa-linkedin-in"></i></a>
            <a href="#" class="hover:text-white" aria-label="Instagram"><i class="fab fa-instagram"></i></a>
          </div>
        </div>

        <!-- Courses -->
        <div>
          <h3 class="text-white font-bold mb-5">Our Courses</h3>
          <ul class="space-y-2 text-sm text-gray-300">
            <li><span class="text-gray-400">›</span> Solar Design and Installation</li>
            <li><span class="text-gray-400">›</span> Solarpreneurship and Business Management</li>
            <li><span class="text-gray-400">›</span> Repair and maintenance</li>
            <li><span class="text-gray-400">›</span> HSE (Health, Safety, and Environment) Management</li>
            <li><span class="text-gray-400">›</span> Practical Artificial intelligence and Robotics</li>
            <li><span class="text-gray-400">›</span> Digital Marketing</li>
            <li><span class="text-gray-400">›</span> Web design &amp; development</li>
          </ul>
        </div>

        <!-- Quick links -->
        <div>
          <h3 class="text-white font-bold mb-5">Quick Links</h3>
          <ul class="space-y-2 text-sm text-gray-300">
            <li>
              <NuxtLink to="/registration" class="hover:text-white">
                <span class="text-gray-400">›</span> Registration
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="/#about" class="hover:text-white">
                <span class="text-gray-400">›</span> About Us
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="/courses" class="hover:text-white">
                <span class="text-gray-400">›</span> Courses
              </NuxtLink>
            </li>
            <li>
              <a href="/#contact" class="hover:text-white">
                <span class="text-gray-400">›</span> Contact
              </a>
            </li>
            <li>
              <NuxtLink to="/admin/login" class="hover:text-white">
                <span class="text-gray-400">›</span> Admin Login
              </NuxtLink>
            </li>
          </ul>
        </div>
      </div>

      <div class="mt-12 pt-6 border-t border-white/10 text-center text-xs text-gray-400">
        Copyright © {{ new Date().getFullYear() }} Novel Academy, All Rights Reserved.
      </div>
    </div>
  </footer>
</template>

