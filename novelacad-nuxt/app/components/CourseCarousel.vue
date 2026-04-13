<template>
  <div class="course-carousel-wrapper" @mouseenter="startScroll" @mouseleave="stopScroll">
    <div class="course-carousel" ref="carouselRef">
      <div v-for="course in [...courses, ...courses]" :key="`${course.slug}-${Math.random()}`" class="course-card">
        <!-- Card Background & Overlay -->
        <div class="card-image">
          <img :src="`/img/${course.img}`" :alt="course.name" class="image" />
          <div class="overlay"></div>

          <!-- Duration Badge -->
          <div class="duration-badge">
            {{ course.duration }}
          </div>

          <!-- Course Text Content (slides up on hover) -->
          <div class="card-content">
            <h3 class="course-title">{{ course.name }}</h3>
            <p class="course-description">{{ course.desc }}</p>
          </div>

          <!-- View Course Button (slides up on hover) -->
          <NuxtLink :to="`/courses/${course.slug}`" class="view-button">
            <i class="fas fa-arrow-right"></i>
            View Course
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Course {
  slug: string
  name: string
  img: string
  desc: string
  duration: string
}

defineProps<{
  courses: Course[]
}>()

const carouselRef = ref<HTMLElement | null>(null)
let scrollAnimationId: number | null = null
let scrollAmount = 0
const scrollSpeed = 1.5 // pixels per frame

const startScroll = () => {
  if (scrollAnimationId !== null) return // Already scrolling

  const carousel = carouselRef.value
  if (!carousel) return

  const maxScroll = carousel.scrollWidth / 2

  const autoScroll = () => {
    scrollAmount += scrollSpeed
    carousel.scrollLeft = scrollAmount

    // Reset scroll position when reaching the end
    if (scrollAmount >= maxScroll) {
      scrollAmount = 0
    }

    scrollAnimationId = requestAnimationFrame(autoScroll)
  }

  autoScroll()
}

const stopScroll = () => {
  if (scrollAnimationId !== null) {
    cancelAnimationFrame(scrollAnimationId)
    scrollAnimationId = null
  }
}
</script>

<style scoped>
/* Hide scrollbar for cleaner look */
.course-carousel::-webkit-scrollbar {
  display: none;
}
.course-carousel {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.course-carousel-wrapper {
  width: 100%;
  overflow: hidden;
  margin-left: calc(-50vw + 50%);
  width: 100vw;
}

.course-carousel {
  display: flex;
  gap: 1.5rem;
  overflow-x: auto;
  padding: 1rem 0;
  scroll-behavior: auto;
  padding-left: 1.5rem;
  padding-right: 1.5rem;
}

.course-card {
  flex: 0 0 320px;
  height: 350px;
  border-radius: 0.75rem;
  overflow: hidden;
  cursor: pointer;
}

.card-image {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.card-image:hover .image {
  transform: scale(1.05);
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.8));
  z-index: 1;
}

.duration-badge {
  position: absolute;
  top: 1rem;
  left: 1rem;
  background: rgb(59, 130, 246);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-size: 0.75rem;
  font-weight: bold;
  z-index: 3;
}

.card-content {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 1.5rem;
  color: white;
  z-index: 2;
  transition: transform 0.3s ease;
}

.course-title {
  font-size: 1.125rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
  font-family: 'Heading Font', sans-serif;
}

.course-description {
  font-size: 0.875rem;
  line-height: 1.4;
  opacity: 0.9;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.view-button {
  position: absolute;
  bottom: -60px;
  left: 1.5rem;
  right: 1.5rem;
  background: rgb(59, 130, 246);
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  text-align: center;
  font-weight: 600;
  font-size: 0.875rem;
  text-decoration: none;
  z-index: 3;
  transition: bottom 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  white-space: nowrap;
}

.card-image:hover .view-button {
  bottom: 1.5rem;
}

.card-image:hover .card-content {
  transform: translateY(-60px);
}

.view-button:hover {
  background: rgb(37, 99, 235);
  text-decoration: none;
}

.view-button i {
  font-size: 0.75rem;
}
</style>
