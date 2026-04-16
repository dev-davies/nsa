// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  modules: ['@nuxtjs/tailwindcss'],

  css: ['~/assets/css/main.css'],

  runtimeConfig: {
    // Private — server only
    sessionSecret: process.env.SESSION_SECRET || 'dev-secret-change-in-production',
    dbPath: process.env.DB_PATH,
    tursoUrl: process.env.DATABASE_URL,
    tursoToken: process.env.DATABASE_TOKEN,
    siteUrl: process.env.SITE_URL || 'https://novel-academy.com',
    mailHost: process.env.MAIL_SERVER || 'smtp.gmail.com',
    mailPort: process.env.MAIL_PORT || '587',
    mailUser: process.env.MAIL_USERNAME || '',
    mailPass: process.env.MAIL_PASSWORD || '',
    mailFrom: process.env.MAIL_DEFAULT_SENDER || '',
    // Public — exposed to client
    public: {
      siteName: 'Novel Academy',
    },
  },

  nitro: {
    // libSQL works out of the box with standard Nitro settings
  },

  app: {
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      title: 'Novel Academy - Where Innovation Meets Sustainability',
      meta: [
        { name: 'description', content: 'Novel Academy offers world-class training in Solar Energy, AI, Robotics, Web Development, Digital Marketing, and more.' },
        { name: 'keywords', content: 'Solar Academy, Solar Training, Novel Academy, HSE, AI Robotics, Web Development' },
      ],
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Outfit:wght@400;500;600;700;800&display=swap' },
        { rel: 'stylesheet', href: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css' },
      ],
    },
  },
})

