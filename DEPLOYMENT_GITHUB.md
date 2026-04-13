# Automated Deployment via GitHub Actions

This guide sets up automatic deployment of your Nuxt/Nitro application when you push to the `main` branch.

## Deployment Targets

- **Option 1:** Namecheap via FTP (cPanel + Node.js)
- **Option 2:** Vercel (Recommended - Automatic)
- **Option 3:** GitHub Pages + Serverless Functions

---

## Option 1: Namecheap via FTP (Auto-Deploy)

### One-Time Setup

#### Step 1: Create FTP Account in cPanel

1. Log in to **cPanel**
2. Go to **FTP Accounts**
3. Click **+ Add FTP Account**
4. Fill in:
   - **Log In**: `deploy`
   - **Password**: Strong, unique password
   - **Directory**: `/novelacad_prod` (restricts to this folder only)
5. Click **Create FTP Account**

> **Security Note**: Using a dedicated FTP account (not your main password) is safer. This account only has access to the deployment folder.

#### Step 2: Add GitHub Secrets

1. Go to your repository: **Settings → Secrets and variables → Actions**
2. Click **New repository secret** and add:

| Secret Name | Value |
|------------|-------|
| `FTP_SERVER` | `ftp.novel-techtraining.com` (from cPanel sidebar) |
| `FTP_USERNAME` | `deploy@novel-techtraining.com` |
| `FTP_PASSWORD` | The password you set above |

#### Step 3: Create GitHub Actions Workflow

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Namecheap

on:
  push:
    branches:
      - main

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Install dependencies
        run: |
          cd novelacad-nuxt
          npm ci

      - name: Build application
        run: |
          cd novelacad-nuxt
          npm run build

      - name: Deploy to FTP
        uses: SamKirkland/FTP-Deploy-Action@v4.3.5
        with:
          server: ${{ secrets.FTP_SERVER }}
          username: ${{ secrets.FTP_USERNAME }}
          password: ${{ secrets.FTP_PASSWORD }}
          local-dir: ./novelacad-nuxt/
          server-dir: /novelacad_prod/
          exclude: |
            **/.git*
            **/.git*/**
            **/node_modules/**
            **/.nuxt/**
            **/dist/**
            .gitignore
            .env (keep existing)
            database.db (keep existing)

      - name: Notify deployment
        if: always()
        run: |
          echo "Deployment status: ${{ job.status }}"
          echo "Check your application at: https://novel-techtraining.com"
```

#### Step 4: Configure Python App in cPanel

After first deployment, set up the Python app wrapper:

1. **Go to cPanel → Setup Python App**
2. **Create Application:**
   - **Python Version**: 3.8 or higher
   - **Application Root**: `novelacad_prod`
   - **Application URL**: `novel-techtraining.com`
   - **Startup File**: `server.js` (Nitro server file)
   - **Entry Point**: `default`

3. **Install npm dependencies** in cPanel Terminal:
```bash
cd /home/user/novelacad_prod
npm install
npm run build
```

4. **Add environment variables** in cPanel (Setup Python App → Environment Variables):
   - `SESSION_SECRET=your-secret-key`
   - `NODE_ENV=production`
   - `MAIL_SERVER=smtp.gmail.com`
   - etc.

5. **Restart** the application

#### Step 5: Deploy

```bash
# Make changes locally
git add .
git commit -m "Update course information"
git push origin main
```

Check the **Actions** tab in GitHub to see deployment progress.

---

## Option 2: Vercel (Easiest - Recommended) ⭐

### Setup (One-Time)

1. **Push to GitHub:**
```bash
git add .
git commit -m "Ready for Vercel"
git push origin main
```

2. **Create Vercel Account:**
   - Go to [vercel.com](https://vercel.com)
   - Sign up with GitHub
   - Choose "novelacad" repository
   - Select "novelacad-nuxt" as root directory

3. **Configure Environment Variables:**
   In Vercel dashboard → Project Settings → Environment Variables:
   - `SESSION_SECRET` = Your secret key
   - `DB_PATH` = `./database.db`
   - `MAIL_SERVER` = `smtp.gmail.com`
   - `MAIL_PORT` = `587`
   - `MAIL_USERNAME` = Your email
   - `MAIL_PASSWORD` = App password
   - `MAIL_DEFAULT_SENDER` = Your email

4. **Deploy:**
   - Vercel automatically deploys on push
   - Your app will be at `novelacad.vercel.app`

5. **Custom Domain:**
   - In Vercel Settings → Domains
   - Add `novel-techtraining.com`
   - Update DNS records as instructed

### Database Persistence

For SQLite database on Vercel (ephemeral filesystem):

**Option A:** Use Vercel KV (Recommended)
```bash
vercel env add VERCEL_KV_REST_API_URL
vercel env add VERCEL_KV_REST_API_TOKEN
```

**Option B:** Use Supabase (PostgreSQL)
```javascript
// Update server/utils/db.ts to use Supabase client instead of SQLite
```

---

## Option 3: GitHub Pages + Serverless

For a hybrid approach using GitHub Pages for static files and serverless functions for API:

Create `.github/workflows/deploy-hybrid.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Install dependencies
        run: |
          cd novelacad-nuxt
          npm ci

      - name: Build static site
        run: |
          cd novelacad-nuxt
          npm run generate

      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./novelacad-nuxt/dist
```

---

## Troubleshooting

### Deployment fails on FTP
- Verify FTP credentials in GitHub Secrets
- Check FTP server permissions
- Ensure `novelacad_prod` directory exists on server

### Application doesn't start after deploy
```bash
# In cPanel Terminal
cd /home/user/novelacad_prod
npm install
npm run build
# Then restart in Setup Python App
```

### Environment variables not loading
- Verify they're set in cPanel or Vercel dashboard
- Check `.env` file in local directory (should be gitignored)
- Restart application after updating variables

### Database changes not persisting
- Check database file location and permissions
- Ensure `DB_PATH` environment variable is set correctly
- Verify SQLite is installed on server: `which sqlite3`

---

## Monitoring Deployments

### GitHub Actions
- View all deployments: Repository → **Actions** tab
- Check deployment logs for errors
- Rollback by pushing a previous commit

### Vercel
- View deployment logs: Vercel Dashboard → Deployments
- Automatic rollback available for each deployment
- Real-time monitoring and logs available

### Namecheap
- Check application logs in cPanel: **Setup Python App → View Logs**
- Monitor resource usage in cPanel
- Manually restart via "Restart" button if needed

---

## Manual Deployment Alternative

If you prefer manual deployment without GitHub Actions:

```bash
# Local build
cd novelacad-nuxt
npm run build

# Upload via FTP/SCP
scp -r dist/ user@ftp.server:/novelacad_prod/

# Or compress and upload
zip -r novelacad-dist.zip dist/
# Upload via cPanel File Manager

# Then restart in cPanel → Setup Python App
```

