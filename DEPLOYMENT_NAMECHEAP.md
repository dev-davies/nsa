# Deploying to Namecheap (novel-techtraining.com)

Deploy your Novel Academy Nuxt/Nitro application to your main domain.

## Architecture Overview

```
Front-end:  Nuxt 4 (Vue.js) - SSR rendered
Back-end:   Nitro Server (Node.js) - API endpoints
Database:   SQLite (better-sqlite3)
Domain:     novel-techtraining.com (cPanel/Node.js)
```

---

## Step 1: Prepare Your Files (Local)

### Option A: Fresh Deploy from GitHub

```bash
git clone https://github.com/novelacadhost-sketch/novelacad.git
cd novelacad/novelacad-nuxt

# Install dependencies
npm install

# Build for production
npm run build

# Create deployment package
zip -r ../novelacad-prod.zip . -x "node_modules/*" ".nuxt/*" ".git/*"
```

### Option B: From Existing Files

Ensure you have:
- ✅ `novelacad-nuxt/` directory with all source code
- ✅ `novelacad-nuxt/package.json`
- ✅ `novelacad-nuxt/nuxt.config.ts`
- ✅ `novelacad-nuxt/server/` directory
- ✅ `schema.sql` for database initialization

---

## Step 2: Upload to Namecheap

### Option A: Using cPanel File Manager

1. **Log in to cPanel**
2. **File Manager** → Navigate to home directory
3. **Create New Folder**: `novelacad_prod`
   > **Important**: Do NOT upload into `public_html` or `novel-techtraining.com` folder. The application code should live outside the public web root for security.

4. **Enter the folder** → **Upload**
5. Upload `novelacad-prod.zip` (or individual files)
6. **Extract** the zip file
7. Delete the zip after extraction

### Option B: Using FTP

```bash
# From local machine
ftp ftp.novel-techtraining.com
username: your-cpanel-username
password: your-cpanel-password

# Navigate to home directory
cd
mkdir novelacad_prod
cd novelacad_prod

# Upload files
mput novelacad-nuxt/* 
```

---

## Step 3: Configure Node.js in cPanel

### Instead of Python App

Since Nuxt requires Node.js (not Python), we'll use **Node.js App Manager** or **Setup Node.js App** (if available):

1. **cPanel → Node.js App Manager** (or **Setup Node.js App**)
2. **Create Application**:
   - **App Mode**: Production
   - **Node.js Version**: 18.x or higher
   - **Application Root**: `/novelacad_prod` (the folder you just created)
   - **Application URL**: `novel-techtraining.com` (or leave blank for root)
   - **Startup File**: `server/index.mjs` or `dist/server/index.mjs` (depending on build output)
   - **Application Entry Point**: (usually auto-detected)

3. Click **Create**

> **Note**: If Node.js App Manager is not available, contact Namecheap support to enable Node.js hosting on your plan.

---

## Step 4: Install Dependencies & Build

### In cPanel Terminal

1. **cPanel → Terminal** (or SSH)
2. Navigate to your directory:

```bash
cd ~/novelacad_prod

# Install production dependencies only
npm install --production

# Or build inside the directory if `dist` doesn't exist
npm install                 # Install all dependencies
npm run build              # Build the application

# Verify the dist folder was created
ls -la dist/
```

---

## Step 5: Environment Variables

### Set Environment Variables in cPanel

1. **cPanel → Node.js App Manager**
2. **Select your novelacad_prod application**
3. **Environment Variables** section, add:

```
SESSION_SECRET        = your-very-long-random-secret-key
NODE_ENV              = production
DB_PATH               = ./database.db
MAIL_SERVER           = smtp.gmail.com
MAIL_PORT             = 587
MAIL_USERNAME         = your-email@gmail.com
MAIL_PASSWORD         = your-app-password
MAIL_DEFAULT_SENDER   = info@novel-academy.com
```

**Generate SESSION_SECRET:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

4. Click **Save**

---

## Step 6: Database Setup

### Initialize Database

```bash
# In cPanel Terminal (or SSH), navigate to app directory
cd ~/novelacad_prod

# Initialize SQLite database with schema
sqlite3 database.db < ../schema.sql

# Or if that path doesn't work:
cat << 'EOF' | sqlite3 database.db
[Copy contents of schema.sql here]
EOF

# Verify database was created
ls -la database.db
```

---

## Step 7: Create First Admin User

### Option A: Via Database Insert

```bash
# In cPanel Terminal
sqlite3 database.db

# Inside sqlite3 shell:
INSERT INTO admins (username, email, password_hash, role, created_at)
VALUES ('admin', 'admin@example.com', '$2a$12$...', 'master', datetime('now'));
```

> Password hash can be generated using bcryptjs: `npm install bcryptjs` then use password generator

### Option B: Via Application API

After app is running, use an admin creation endpoint or the contact form first, then manually promote that user.

---

## Step 8: Start & Verify

1. **cPanel → Node.js App Manager**
2. Select your application
3. Click **Start/Restart**
4. Click **"Open in Browser"** or visit `https://novel-techtraining.com`

### Check Logs

Click the **Logs** button to view application output and errors.

---

## Troubleshooting

### "Cannot find application startup file"
- Ensure `dist/server/index.mjs` exists after build
- Check that `npm run build` completed successfully
- Verify the Startup File path matches exactly

### Application won't start - 502 Bad Gateway
```bash
# In Terminal, check logs
tail -f ~/novelacad_prod/.build/logs  # Adjust path as needed

# Verify Node.js version
node --version

# Ensure all dependencies installed
npm install
```

### Database "locked" or "already in use"
- Restart the application through cPanel
- Check if another process is using the database

### Static files (CSS/images) not loading
- Run `npm run build` again
- Verify `public/` folder contents
- Check Nginx/Apache serves static files correctly

### Email not sending
- Verify `MAIL_*` environment variables are set
- For Gmail: Use [App Password](https://myaccount.google.com/apppasswords)
- Check email provider doesn't block SMTP from your server

### "Cannot GET /" or blank page
- Check build output: `npm run build`
- Verify `dist/` folder contains `server/` and `client/` directories
- Check application logs for errors

---

## Updating Your Application

### When you want to deploy updates:

```bash
# From your local machine
cd novelacad
git add .
git commit -m "Update feature"
git push origin main

# On server (via Terminal or GitHub Actions)
cd ~/novelacad_prod
git pull origin main
npm install
npm run build
```

Then restart the application in cPanel → Node.js App Manager.

---

## Performance Optimization

### Enable Compression
In `nuxt.config.ts`:

```typescript
export default defineNuxtConfig({
  nitro: {
    prerender: {
      crawlLinks: true,
    },
    headers: {
      'Cache-Control': 'public, max-age=3600',
    }
  }
})
```

### Database Optimization

```bash
# Optimize SQLite database
sqlite3 database.db "VACUUM;"
```

---

## Backups

```bash
# Backup database
cp database.db database.db.backup.$(date +%Y%m%d)

# Backup entire application
tar -czf novelacad-backup-$(date +%Y%m%d).tar.gz ~/novelacad_prod/
```

---

## Support

For Namecheap support:
- **Chat/Ticket**: https://www.namecheap.com/support/
- **Node.js issues**: Check Node.js documentation at https://nodejs.org/

For Novel Academy issues:
- **GitHub Issues**: https://github.com/novelacadhost-sketch/novelacad/issues

