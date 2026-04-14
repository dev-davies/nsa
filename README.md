# Novel Academy

> Where Innovation Meets Sustainability!

Novel Academy is a modern course registration and management platform providing world-class training in Solar Energy, AI & Robotics, Web Development, and more. Originally migrated from a Flask-based prototype, the application is now a high-performance **Nuxt 3** site powered by **Turso (libSQL)** cloud database.

## ✨ Features

### Public-Facing
- 🎓 **diverse Course Offerings**: Solar Design & Installation, Solarpreneurship, AI & Robotics, Web Development, Digital Marketing, and HSE Management.
- 📝 **Dynamic Registration**: A responsive, multi-step registration workflow built with Vue 3.
- 📱 **Modern UI**: Full responsive design utilizing **Tailwind CSS** for a premium aesthetic.
- 🛡️ **Anti-Bot Protection**: Built-in verification to ensure high-quality application data.
- 💬 **Integrated Contact Form**: Direct communication channel for prospective students.

### Admin Dashboard
- 🔐 **Secure Session Auth**: Role-based access control (Master/Admin) for management operations.
- 📊 **Unified Dashboard**: View and manage course registrations and student inquiries in real-time.
- 📥 **Data Portability**: Full support for exporting registration data to **PDF** and **CSV** formats.
- 👥 **User Management**: Master admins can create and manage additional administrative accounts.

## 🔧 Technology Stack

- **Framework**: [Nuxt 3](https://nuxt.com/) (Vue 3, Nitro)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Database**: [Turso](https://turso.tech/) (libSQL cloud database)
- **Deployment**: Optimized for Vercel or any Nitro-compatible server.
- **Email**: NodeMailer integration for automated application notifications.

## 🚀 Getting Started .

### Prerequisites
- [Node.js](https://nodejs.org/) (v18.0 or higher)
- [npm](https://www.npmjs.com/)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/dev-davies/nsa.git
   cd nsa/novelacad-nuxt
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   Create a `.env` file in the `novelacad-nuxt` directory:
   ```env
   # Database
   DATABASE_URL=libsql://your-db-url.turso.io
   DATABASE_TOKEN=your-auth-token 

   # App
   SESSION_SECRET=your-random-secret
   
  

4. **Run Locally**
   ```bash
   npm run dev
   ```
   The site will be available at `http://localhost:3000`.

## 🏗️ Project Structure

```
novelacad/
└── novelacad-nuxt/
    ├── app/               # Vue Components and Pages
    ├── public/            # Static Assets
    ├── server/
    │   ├── api/           # API Routes (Nuxt Server Hooks)
    │   └── utils/         # Database and Mailer utilities
    ├── nuxt.config.ts     # Main application configuration
    └── tailwind.config.ts # Design system configuration
```

## 📄 License

Proprietary - Novel Academy © 2026

---
**Built with ❤️ for Novel Academy - Empowering the next generation of innovators.**
