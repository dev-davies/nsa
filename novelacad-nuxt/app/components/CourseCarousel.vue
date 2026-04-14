<template>
  <div class="relative full-bleed">
    <!-- Controls -->
    <button
      type="button"
      class="hidden lg:flex absolute left-2 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white shadow-lg border border-gray-200 items-center justify-center text-gray-700 hover:bg-gray-50"
      @click="scrollBy(-1)"
      aria-label="Scroll left"
    >
      <i class="fas fa-chevron-left text-sm"></i>
    </button>
    <button
      type="button"
      class="hidden lg:flex absolute right-2 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white shadow-lg border border-gray-200 items-center justify-center text-gray-700 hover:bg-gray-50"
      @click="scrollBy(1)"
      aria-label="Scroll right"
    >
      <i class="fas fa-chevron-right text-sm"></i>
    </button>

    <!-- Track -->
    <div
      ref="track"
      class="flex gap-6 overflow-x-auto px-6 lg:px-10 pb-3 -mb-3 scroll-smooth snap-x snap-mandatory no-scrollbar"
      @mouseenter="startHoverScroll"
      @mouseleave="stopHoverScroll"
      @mousemove="updateHoverDirection"
      @scroll.passive="wrapIfNeeded"
    >
      <NuxtLink
        v-for="(course, idx) in loopedCourses"
        :key="`${course.slug}-${idx}`"
        :to="`/courses/${course.slug}`"
        class="snap-start shrink-0 w-[280px] sm:w-[320px] lg:w-[360px] group rounded-2xl overflow-hidden bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
      >
        <div class="relative h-52 overflow-hidden">
          <img
            :src="`/img/${course.img}`"
            :alt="course.name"
            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div class="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-gray-900/30 to-transparent"></div>
          <div class="absolute bottom-3 left-3">
            <span class="px-2 py-1 bg-brand-500 text-white text-xs font-bold rounded-lg">
              {{ course.duration }}
            </span>
          </div>
        </div>
        <div class="p-6">
          <h3 class="font-heading font-bold text-lg text-gray-800 mb-2 group-hover:text-brand-500 transition-colors">
            {{ course.name }}
          </h3>
          <p class="text-sm text-gray-500 line-clamp-3 mb-5">
            {{ course.desc }}
          </p>
          <div class="flex items-center justify-between">
            <span class="text-brand-500 text-sm font-semibold flex items-center gap-1">
              View Details <i class="fas fa-arrow-right text-xs group-hover:translate-x-1 transition-transform"></i>
            </span>
            <button
              type="button"
              class="px-3 py-1.5 bg-brand-50 text-brand-600 text-xs font-bold rounded-lg hover:bg-brand-500 hover:text-white transition-colors"
              @click.prevent="navigateTo('/registration')"
            >
              Enroll
            </button>
          </div>
        </div>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
type Course = {
  slug: string
  name: string
  img: string
  desc: string
  duration: string
}

const props = defineProps<{
  courses: Course[]
}>()

const loopedCourses = computed(() => {
  // Triplicate so we can keep the scroll position in the middle copy.
  return [...props.courses, ...props.courses, ...props.courses]
})

const track = ref<HTMLElement | null>(null)
let rafId: number | null = null
let hoverDir = 0 // -1..1
let hoverSpeed = 0 // px per frame
let setWidth = 0

function measureSetWidth() {
  const el = track.value
  if (!el) return
  // With 3 copies, each "set" is 1/3 of the total scrollWidth.
  setWidth = el.scrollWidth / 3
}

function initInfinitePosition() {
  const el = track.value
  if (!el) return
  measureSetWidth()
  if (!setWidth || !Number.isFinite(setWidth)) return
  // Start at the beginning of the middle copy.
  el.scrollLeft = setWidth
}

function wrapIfNeeded() {
  const el = track.value
  if (!el || !setWidth) return

  // Keep the scrollLeft within the middle copy for a seamless loop.
  if (el.scrollLeft < setWidth * 0.25) {
    el.scrollLeft += setWidth
  } else if (el.scrollLeft > setWidth * 1.75) {
    el.scrollLeft -= setWidth
  }
}

onMounted(async () => {
  await nextTick()
  initInfinitePosition()
  if (process.client) window.addEventListener('resize', initInfinitePosition, { passive: true })
})

onBeforeUnmount(() => {
  stopHoverScroll()
  if (process.client) window.removeEventListener('resize', initInfinitePosition as any)
})

function startHoverScroll() {
  const el = track.value
  if (!el || rafId !== null) return
  if (!setWidth) measureSetWidth()

  const step = () => {
    if (!track.value) return
    const t = track.value
    if (hoverDir !== 0) {
      t.scrollLeft += hoverDir * hoverSpeed
    }
    wrapIfNeeded()

    rafId = requestAnimationFrame(step)
  }

  // default: drift right slowly until we get a mousemove
  hoverDir = hoverDir || 1
  hoverSpeed = hoverSpeed || 2.0
  rafId = requestAnimationFrame(step)
}

function stopHoverScroll() {
  if (rafId === null) return
  cancelAnimationFrame(rafId)
  rafId = null
  hoverDir = 0
  hoverSpeed = 0
}

function updateHoverDirection(e: MouseEvent) {
  const el = track.value
  if (!el) return

  const rect = el.getBoundingClientRect()
  const x = (e.clientX - rect.left) / rect.width // 0..1

  // map to -1..1 (left = -1, right = +1) with deadzone near center
  const centered = (x - 0.5) * 2
  const deadZone = 0.15
  const abs = Math.abs(centered)

  if (abs < deadZone) {
    hoverDir = 0
    hoverSpeed = 0
    return
  }

  hoverDir = centered < 0 ? -1 : 1
  // speed ramps up as you move toward the edges
  const strength = Math.min(1, (abs - deadZone) / (1 - deadZone))
  hoverSpeed = 1.5 + strength * 5.0
}

function scrollBy(direction: -1 | 1) {
  const el = track.value
  if (!el) return
  if (!setWidth) measureSetWidth()

  // Scroll roughly one card at a time.
  const card = el.querySelector<HTMLElement>('a')
  const step = (card?.offsetWidth ?? 320) + 24
  el.scrollBy({ left: direction * step, behavior: 'smooth' })

  // After the smooth scroll settles a bit, snap back into the middle copy if needed.
  setTimeout(() => wrapIfNeeded(), 250)
}
</script>

<style scoped>
.full-bleed {
  width: 100vw;
  margin-left: calc(50% - 50vw);
  margin-right: calc(50% - 50vw);
}

.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>

