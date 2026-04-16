<template>
  <div>
    <!-- Hero Section -->
    <section class="relative bg-gradient-to-br from-blue-600 via-blue-500 to-blue-700 text-white overflow-hidden min-h-[85vh] flex items-center"
      :style="{ backgroundImage: 'url(/img/bannerhere.png)', backgroundSize: 'cover', backgroundPosition: 'center' }">
      <!-- Dark overlay to improve text visibility -->
      <div class="absolute inset-0 bg-black/40"></div>

      <!-- Overlay top decoration -->
      <div class="absolute top-0 left-0 right-0 w-full h-auto z-10">
        <img src="/img/overlay-top.png" alt="" class="w-full h-auto" />
      </div>

      <div class="relative z-20 max-w-7xl mx-auto px-6 lg:px-10 py-24 text-center">
        <span class="inline-block px-4 py-1.5 bg-brand-500/30 border border-brand-300/50 rounded-full text-white text-sm font-semibold mb-6 backdrop-blur-sm shadow-lg">
          🌱 Est. 2015 · Over 1,100 Graduates
        </span>
        <h1 class="font-heading text-5xl lg:text-7xl font-black mb-6 leading-tight drop-shadow-2xl">
          Welcome to<br>
          <span class="text-white drop-shadow-2xl min-h-[1.2em]">{{ typedText }}<span v-if="isTyping" class="animate-pulse">|</span></span>
        </h1>
        <p class="text-xl lg:text-2xl text-white mb-8 max-w-3xl mx-auto leading-relaxed drop-shadow-lg font-medium">
          Start your journey toward a cleaner and brighter future. World-class training in Solar Energy, AI, and Technology.
        </p>

        <!-- Course quick select -->
        <div class="max-w-lg mx-auto flex gap-2 mb-10">
          <select
            v-model="selectedCourse"
            class="flex-1 px-4 py-3.5 rounded-xl bg-white/20 backdrop-blur border border-white/40 text-white focus:outline-none focus:border-white/80 appearance-none cursor-pointer font-medium shadow-lg"
          >
            <option value="" disabled class="text-gray-800">Select a course...</option>
            <option v-for="c in courses" :key="c.slug" :value="c.slug" class="text-gray-800">{{ c.name }}</option>
          </select>
          <button
            @click="goToCourse"
            class="px-6 py-3.5 bg-brand-500 hover:bg-brand-600 text-white rounded-xl font-bold transition-all active:scale-95 shadow-lg"
          >
            Go <i class="fas fa-arrow-right ml-1"></i>
          </button>
        </div>

        <div class="flex flex-wrap justify-center gap-4">
          <NuxtLink to="/registration" class="btn-primary text-base shadow-lg">
            <i class="fas fa-graduation-cap"></i> Enroll Now
          </NuxtLink>
          <a href="#about" @click.prevent="scrollTo('about')" class="btn-outline border-white text-white hover:bg-white/20 text-base shadow-lg">
            Learn More <i class="fas fa-chevron-down"></i>
          </a>
        </div>
      </div>

      <!-- Wave divider with overlay -->
      <div class="absolute bottom-0 left-0 right-0 w-full h-auto z-10">
        <img src="/img/overlay-bottom.png" alt="" class="w-full h-auto" />
      </div>
    </section>

    <!-- Stats Bar -->
    <section class="py-0 shadow-sm" ref="statsSection">
      <div class="max-w-full mx-auto px-0 grid grid-cols-2 lg:grid-cols-4 gap-0 text-center">
        <div v-for="(stat, idx) in stats" :key="stat.label" :class="stat.bgClass" class="px-6 lg:px-8 py-12 lg:py-16 flex flex-col items-center justify-center">
          <div class="text-5xl lg:text-6xl font-heading font-black mb-3 text-white">
            <span v-if="idx === 0">{{ animatedValues[idx] }}</span>
            <span v-else-if="idx === 1">{{ animatedValues[idx] }}+</span>
            <span v-else-if="idx === 2">{{ animatedValues[idx] }}+</span>
            <span v-else-if="idx === 3">{{ animatedValues[idx] }}+</span>
          </div>
          <div class="text-sm lg:text-base font-bold uppercase tracking-wider text-white">{{ stat.label }}</div>
        </div>
      </div>
    </section>

    <!-- About Section -->
    <section id="about" class="py-24 bg-white">
      <div class="max-w-7xl mx-auto px-6 lg:px-10">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div class="relative">
            <div class="rounded-3xl overflow-hidden shadow-2xl">
              <img src="/img/academy building.png" alt="Novel Academy Building" class="w-full h-[500px] object-cover" />
            </div>
            <div class="absolute -bottom-6 -right-6 bg-brand-500 text-white rounded-2xl p-6 shadow-xl">
              <div class="text-4xl font-black font-heading">10+</div>
              <div class="text-sm font-semibold">Years of Excellence</div>
            </div>
          </div>
          <div class="animate-slide-up">
            <p class="section-subtitle mb-3">About Us</p>
            <h2 class="section-title mb-6">Your Best Choice For Renewable Energy & Technology Education</h2>
            <p class="text-gray-600 leading-relaxed mb-4">
              <strong>NOVEL ACADEMY</strong> was established in September 2015. We are a leading institution committed to providing
              high-quality training in solar energy and modern renewable technologies. With over 1,000 graduates, our academy
              has played a major role in shaping skilled professionals across the renewable energy sector.
            </p>
            <p class="text-gray-600 leading-relaxed mb-8">
              We combine strong theoretical knowledge with hands-on training to ensure our students become competent,
              innovative, and industry-ready — in a fully equipped environment that includes a modern library, practical
              laboratory, service centre, and field training facilities.
            </p>

            <div class="grid grid-cols-2 gap-4 mb-8">
              <div class="bg-gray-50 rounded-xl p-4 border-l-4 border-brand-500">
                <h4 class="font-bold text-gray-800 mb-1">Our Mission</h4>
                <p class="text-sm text-gray-600">To inspire the next generation of solar energy leaders through accessible, high-quality education.</p>
              </div>
              <div class="bg-gray-50 rounded-xl p-4 border-l-4 border-accent">
                <h4 class="font-bold text-gray-800 mb-1">Our Vision</h4>
                <p class="text-sm text-gray-600">To promote world-class innovation driven by modern technology and entrepreneurial practices.</p>
              </div>
            </div>

            <a href="/docs/Novelsolar Introduction.pdf" download="Novel Academy" class="btn-primary">
              <i class="fas fa-download"></i> Download Brochure
            </a>
          </div>
        </div>
      </div>
    </section>

    <!-- Why Choose Us -->
    <section class="py-24 bg-gray-900 text-white relative overflow-hidden">
      <div class="absolute inset-0 opacity-5" style="background-image: radial-gradient(circle at 2px 2px, white 1px, transparent 0); background-size: 40px 40px;"></div>
      <div class="relative max-w-7xl mx-auto px-6 lg:px-10">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <p class="text-brand-400 font-semibold uppercase tracking-widest text-sm mb-3">Why Choose Us?</p>
            <h2 class="font-heading text-4xl font-bold mb-6">Why You Should Start Learning With Us?</h2>
            <p class="text-gray-400 mb-10 leading-relaxed">
              At Novel Academy, we are committed to giving you the best learning experience in renewable energy.
              Our programs are built to help you gain real skills, practical knowledge, and a recognised qualification
              that opens doors in the industry.
            </p>

            <div class="space-y-8">
              <div v-for="feature in features" :key="feature.title" class="flex gap-5">
                <div class="flex-shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center text-white" :class="feature.bg">
                  <i :class="feature.icon" class="text-xl"></i>
                </div>
                <div>
                  <h4 class="font-heading font-bold text-lg mb-1">{{ feature.title }}</h4>
                  <p class="text-gray-400 text-sm leading-relaxed">{{ feature.desc }}</p>
                </div>
              </div>
            </div>
          </div>
          <div class="rounded-3xl overflow-hidden shadow-2xl">
            <img src="/img/why choose us.png" alt="Why Choose Novel Academy" class="w-full h-[500px] object-cover" />
          </div>
        </div>
      </div>
    </section>

    <!-- Courses Preview Carousel -->
    <section id="courses" class="py-24 bg-gray-50">
      <div class="max-w-7xl mx-auto px-6 lg:px-10">
        <div class="text-center mb-12">
          <p class="section-subtitle mb-3">Our Courses</p>
          <h2 class="section-title">Checkout Our Courses</h2>
        </div>

        <CourseCarousel :courses="courses" />

        <div class="text-center mt-10">
          <NuxtLink to="/courses" class="btn-outline">View All Courses</NuxtLink>
        </div>
      </div>
    </section>

    <!-- Contact Section -->
    <section id="contact" class="py-24 bg-white">
      <div class="max-w-7xl mx-auto px-6 lg:px-10">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <!-- Contact Info -->
          <div>
            <p class="section-subtitle mb-3">Contact Us</p>
            <h2 class="section-title mb-8">Get In Touch With Us</h2>
            <div class="space-y-6">
              <div v-for="info in contactInfo" :key="info.label" class="flex gap-5 items-start">
                <div class="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" :class="info.bg">
                  <i :class="info.icon" class="text-white text-lg"></i>
                </div>
                <div>
                  <h4 class="font-bold text-gray-800 mb-0.5">{{ info.label }}</h4>
                  <p class="text-gray-600 text-sm" v-html="info.value"></p>
                </div>
              </div>
            </div>
          </div>

          <!-- Contact Form -->
          <div class="bg-gray-50 rounded-3xl p-8 border border-gray-100">
            <h3 class="font-heading font-bold text-xl text-gray-800 mb-6">Send Us A Message</h3>

            <div v-if="successMsg" class="mb-5 p-4 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm font-semibold flex items-center gap-2">
              <i class="fas fa-check-circle"></i> {{ successMsg }}
            </div>
            <div v-if="errorMsg" class="mb-5 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm font-semibold flex items-center gap-2">
              <i class="fas fa-exclamation-circle"></i> {{ errorMsg }}
            </div>

            <form @submit.prevent="submitContact" class="space-y-4">
              <!-- Anti-bot honeypots -->
              <input type="text" name="website" style="position:absolute;left:-9999px;opacity:0;pointer-events:none" v-model="honeypot1" autocomplete="off" />
              <input type="text" name="email_confirm" style="position:absolute;left:-9999px;opacity:0;pointer-events:none" v-model="honeypot2" autocomplete="off" />

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label class="form-label">Your Name *</label>
                  <input v-model="form.name" type="text" class="form-input" placeholder="John Doe" required />
                </div>
                <div>
                  <label class="form-label">Email Address *</label>
                  <input v-model="form.email" type="email" class="form-input" placeholder="john@example.com" required />
                </div>
              </div>
              <div>
                <label class="form-label">Subject</label>
                <input v-model="form.subject" type="text" class="form-input" placeholder="What's this about?" />
              </div>
              <div>
                <label class="form-label">Message *</label>
                <textarea v-model="form.message" class="form-input resize-none" rows="5" placeholder="Your message..." required></textarea>
              </div>
              <button type="submit" :disabled="isSubmitting" class="btn-primary w-full justify-center">
                <span v-if="isSubmitting"><i class="fas fa-spinner fa-spin mr-2"></i>Sending...</span>
                <span v-else><i class="fas fa-paper-plane mr-2"></i>Send Message</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
useHead({ title: 'Novel Academy - Where Innovation Meets Sustainability' })

const selectedCourse = ref('')
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

const stats = [
  { value: 8, label: 'Available Courses', bgClass: 'bg-green-500' },
  { value: 10, label: 'Years of Excellence', bgClass: 'bg-blue-600' },
  { value: 20, label: 'Skilled Instructors', bgClass: 'bg-red-500' },
  { value: 1100, label: 'Happy Students', bgClass: 'bg-yellow-400' },
]

const features = [
  { icon: 'fas fa-flask', bg: 'bg-amber-500', title: 'Standard Training Facilities', desc: 'Train in a modern, well-equipped environment with practical labs, a full service centre, fieldwork spaces, and a stocked product showroom.' },
  { icon: 'fas fa-graduation-cap', bg: 'bg-brand-500', title: 'Skilled Instructors', desc: 'Learn from experienced professionals who combine industry expertise with practical teaching, guiding you step-by-step.' },
  { icon: 'fas fa-certificate', bg: 'bg-gray-600', title: 'Nationally Recognised Certificate', desc: 'Graduate with a certificate approved by the Ministry of Education, giving you credibility and a strong advantage in the industry nationwide.' },
]

const contactInfo = [
  { icon: 'fas fa-map-marker-alt', bg: 'bg-brand-500', label: 'Our Location', value: '76, Adekunle Fajuyi Road Ibadan.<br>Opposite Gate 3, Adamasingba Stadium, Oyo State' },
  { icon: 'fas fa-phone-alt', bg: 'bg-green-600', label: 'Call Us', value: '+234 811 369 5917' },
  { icon: 'fas fa-envelope', bg: 'bg-amber-500', label: 'Email Us', value: 'info@novel-techtraining.com' },
]

function goToCourse() {
  if (selectedCourse.value) navigateTo(`/courses/${selectedCourse.value}`)
}

function scrollTo(id: string) {
  const el = document.getElementById(id)
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

// Contact form
const form = reactive({ name: '', email: '', subject: '', message: '' })
const honeypot1 = ref('')
const honeypot2 = ref('')
const formStartTime = ref(Date.now() / 1000)
const isSubmitting = ref(false)
const successMsg = ref('')
const errorMsg = ref('')

// Typing effect
const typingPhrases = [
  'Sustainability!',
  'Innovation!',
  'The Future of Energy!',
  'NOVEL ACADEMY'
]

const typedText = ref('')
const currentPhraseIndex = ref(0)
const isTyping = ref(true)
const charIndex = ref(0)
const isDeleting = ref(false)

const typeSpeed = 100 // ms per character
const deleteSpeed = 50 // ms per character
const pauseTime = 2000 // ms pause between phrases

// Stats counter animation
const animatedValues = ref([0, 0, 0, 0])
const statsSection = ref<HTMLElement | null>(null)
let isAnimating = false
let animationFrameId: number | null = null

onMounted(() => {
  const typeNextChar = () => {
    const currentPhrase = typingPhrases[currentPhraseIndex.value]
    
    if (!isDeleting.value) {
      // Typing phase
      if (charIndex.value < currentPhrase.length) {
        typedText.value += currentPhrase[charIndex.value]
        charIndex.value++
        setTimeout(typeNextChar, typeSpeed)
      } else {
        // Start deleting after pause
        isTyping.value = false
        setTimeout(() => {
          isDeleting.value = true
          isTyping.value = true
          setTimeout(typeNextChar, deleteSpeed)
        }, pauseTime)
      }
    } else {
      // Deleting phase
      if (charIndex.value > 0) {
        typedText.value = typedText.value.slice(0, -1)
        charIndex.value--
        setTimeout(typeNextChar, deleteSpeed)
      } else {
        // Move to next phrase
        isDeleting.value = false
        currentPhraseIndex.value = (currentPhraseIndex.value + 1) % typingPhrases.length
        isTyping.value = true
        setTimeout(typeNextChar, typeSpeed)
      }
    }
  }
  
  typeNextChar()

  // Setup Intersection Observer for stats animation
  const observerOptions = {
    threshold: 0.3,
    rootMargin: '0px',
  }

  const observerCallback = (entries: IntersectionObserverEntry[]) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && !isAnimating) {
        // Animate the stats counters
        animateCounters()
      }
    })
  }

  const observer = new IntersectionObserver(observerCallback, observerOptions)

  if (statsSection.value) {
    observer.observe(statsSection.value)
  }

  // Animation function
  const animateCounters = () => {
    // Cancel any running animation
    if (animationFrameId !== null) {
      cancelAnimationFrame(animationFrameId)
    }

    isAnimating = true
    const animationDuration = 2000 // 2 seconds
    const startTime = Date.now()

    const updateCounters = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / animationDuration, 1)

      stats.forEach((stat, idx) => {
        animatedValues.value[idx] = Math.floor(stat.value * progress)
      })

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(updateCounters)
      } else {
        isAnimating = false
        animationFrameId = null
      }
    }

    updateCounters()
  }
})

async function submitContact() {
  isSubmitting.value = true
  successMsg.value = ''
  errorMsg.value = ''
  try {
    await $fetch('/api/contact', {
      method: 'POST',
      body: {
        ...form,
        website: honeypot1.value,
        email_confirm: honeypot2.value,
        _form_start_time: formStartTime.value,
      }
    })
    successMsg.value = 'Your message has been sent successfully!'
    Object.assign(form, { name: '', email: '', subject: '', message: '' })
    formStartTime.value = Date.now() / 1000
  } catch (e: any) {
    errorMsg.value = e?.data?.message || 'An error occurred. Please try again.'
  } finally {
    isSubmitting.value = false
  }
}
</script>
