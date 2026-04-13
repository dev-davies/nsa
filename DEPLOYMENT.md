# Novel Academy - Deployment Guide

This guide covers deploying the Novel Academy Nuxt/Nitro application to production.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Deployment Options](#deployment-options)
- [Option 1: Linux Server (Recommended)](#option-1-linux-server-recommended)
- [Option 2: Windows Server](#option-2-windows-server)
- [Option 3: PaaS (Recommended)](#option-3-paas-recommended)
- [Post-Deployment](#post-deployment)
- [Monitoring & Maintenance](#monitoring--maintenance)

---

## Prerequisites

- **Node.js 18+** (required for Nuxt/Nitro)
- Server with minimum 512MB RAM, 1 CPU core, 5GB storage
- Domain name (optional but recommended)
- SSL certificate (Let's Encrypt recommended)

---

## Deployment Options

| Option              | Difficulty | Cost       | Best For                           |
|---------------------|-----------|-----------|-----------------------------------|
| Linux VPS (Node.js) | Easy      | Low       | Full control, cost-effective      |
| Windows Server      | Medium    | Medium    | Windows environment               |
| PaaS (Vercel)       | Very Easy | Low/Free  | **Recommended** - automatic deploys, CDN |
| PaaS (Render)       | Easy      | Low       | Good alternative                  |
| PaaS (Railway)      | Easy      | Low       | Another good option               |

---

## Option 1: Linux Server (Recommended)

### Step 1: Server Setup

```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Install Node.js (latest LTS)
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt install -y nodejs

# Install PM2 (process manager) and NGINX
sudo apt install -y npm nginx git
sudo npm install -g pm2

# Install certbot for SSL (Let's Encrypt)
sudo apt install -y certbot python3-certbot-nginx
```

### Step 2: Create Application User

```bash
# Create dedicated user
sudo useradd -m -s /bin/bash novelacad
sudo su - novelacad
```

### Step 3: Deploy Application Code

```bash
# Clone repository
cd /home/novelacad
git clone https://github.com/novelacadhost-sketch/novelacad.git app
cd app/novelacad-nuxt

# Install dependencies
npm install

# Build for production
npm run build
```

### Step 4: Environment Configuration

Create `.env` file:

```bash
# From /home/novelacad/app/novelacad-nuxt directory
nano .env
```

Add:

```env
# Session & Security
SESSION_SECRET=your-very-long-random-secret-key-change-this

# Database Path
DB_PATH=./database.db

# Email Configuration (optional)
MAIL_SERVER=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password
MAIL_DEFAULT_SENDER=info@novel-academy.com

# Node Environment
NODE_ENV=production

# Public API URL
NUXT_PUBLIC_API_BASE=https://yourdomain.com
```

**Generate SECRET_KEY:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Step 5: Initialize Database

```bash
# From /home/novelacad/app/novelacad-nuxt directory
# The database will auto-initialize on first Nitro startup
# To prepopulate with schema, use the schema.sql file:

sqlite3 database.db < ../schema.sql

# Create first admin user via direct DB insertion or through API
# Option: Use the contact form and then create admin via script
```

### Step 6: Start with PM2

```bash
# Start the application
pm2 start "npm run preview" --name "novelacad" --cwd /home/novelacad/app/novelacad-nuxt

# Make it auto-start on reboot
pm2 startup
pm2 save

# Check status
pm2 list
```

### Step 7: Configure Nginx as Reverse Proxy

Exit to root and create Nginx config:

```bash
exit  # Exit from novelacad user
sudo nano /etc/nginx/sites-available/novelacad
```

```nginx
upstream novelacad {
    server 127.0.0.1:3000;
    keepalive 64;
}

server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;

    # SSL certificate paths (set up with certbot)
    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    # SSL configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    # Security headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;

    # Logging
    access_log /var/log/nginx/novelacad_access.log;
    error_log /var/log/nginx/novelacad_error.log;

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

    location / {
        proxy_pass http://novelacad;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable the config:

```bash
sudo ln -s /etc/nginx/sites-available/novelacad /etc/nginx/sites-enabled/
sudo nginx -t  # Test configuration
sudo systemctl restart nginx
```

### Step 8: Set Up SSL (Let's Encrypt)

```bash
sudo certbot certonly --nginx -d yourdomain.com -d www.yourdomain.com

# Auto-renewal is set up automatically
sudo systemctl enable certbot.timer
```

---

## Option 2: Windows Server

### Prerequisites
- Windows Server 2016+ with IIS 10+
- Node.js 18+ installed
- Administrator access

### Deployment Steps

```powershell
# Navigate to deployment directory
cd C:\inetpub\wwwroot

# Clone repository
git clone https://github.com/novelacadhost-sketch/novelacad.git novelacad
cd novelacad\novelacad-nuxt

# Create .env file
New-Item -Path . -Name ".env" -ItemType "file" -Value @"
SESSION_SECRET=your-secret-key
DB_PATH=./database.db
MAIL_SERVER=smtp.gmail.com
MAIL_PORT=587
NODE_ENV=production
"@

# Install dependencies
npm install

# Build application
npm run build

# Start with PM2 (or use IIS URL Rewrite module)
npm install -g pm2
pm2 start "npm run preview" --name "novelacad"
pm2 save
```

Configure IIS as reverse proxy (see Node.js/Nuxt hosting guides for detailed IIS configuration).

---

## Option 3: PaaS (Recommended) ⭐

### Vercel (Easiest - Recommended)

Vercel is optimized for Nuxt and offers free tier with automatic deploys.

1. **Push to GitHub:**
```bash
git add .
git commit -m "Ready for deployment"
git push origin feature/nuxt-migration
```

2. **Create Vercel Account:**
   - Go to [vercel.com](https://vercel.com)
   - Sign up with GitHub
   - Import the `novelacad` repository

3. **Configure Environment Variables:**
   In Vercel dashboard:
   - `SESSION_SECRET` → Your secret key
   - `DB_PATH` → `./database.db`
   - `MAIL_SERVER`, `MAIL_PORT`, etc.

4. **Deploy:**
   - Vercel automatically deploys on push to main
   - Custom domain setup in project settings

5. **Database Persistence:**
   - Store SQLite database in `/tmp` (ephemeral) OR
   - Use Vercel KV for session storage
   - Consider using PlanetScale (MySQL) or Supabase (PostgreSQL) for persistent data

### Render

1. Go to [render.com](https://render.com)
2. Connect GitHub repository
3. Create new "Web Service"
4. **Build command:** `npm install && npm run build`
5. **Start command:** `npm run preview`
6. Add environment variables
7. Deploy

### Railway

1. Go to [railway.app](https://railway.app)
2. Connect GitHub
3. Create new project from repository
4. Customize environment variables
5. Deploy

---

## Post-Deployment

### 1. Database Setup

```bash
# Verify database is created
ls -la database.db

# If needed, initialize schema
sqlite3 database.db < ../schema.sql
```

### 2. Create Admin User

Use the admin creation API endpoint or direct database insert:

```bash
cd /home/novelacad/app/novelacad-nuxt

# Create first admin via direct SQL
sqlite3 database.db "
INSERT INTO admins (username, email, password_hash, role, created_at)
VALUES ('admin', 'admin@novel-academy.com', '[bcrypt-hash]', 'master', datetime('now'))
"
```

### 3. Test Application

```bash
# Check if app is running
curl https://yourdomain.com

# Check specific endpoints
curl https://yourdomain.com/api/admin/session
```

### 4. Email Configuration

If using Gmail:
1. Enable 2-factor authentication
2. Create "App Password" at [https://myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
3. Use that password in `MAIL_PASSWORD` environment variable

---

## Monitoring & Maintenance

### PM2 Monitoring

```bash
# View logs
pm2 logs novelacad

# Monitor in real-time
pm2 monit

# Restart application
pm2 restart novelacad

# View processes
pm2 list
```

### Nginx Logs

```bash
# Access logs
tail -f /var/log/nginx/novelacad_access.log

# Error logs
tail -f /var/log/nginx/novelacad_error.log
```

### Database Backups

```bash
# Backup SQLite database
cp database.db database.db.backup.$(date +%Y%m%d_%H%M%S)

# Automated daily backup (add to crontab)
0 2 * * * cp /home/novelacad/app/novelacad-nuxt/database.db /backups/novelacad_$(date +\%Y\%m\%d).db
```

### Updates

```bash
# Pull latest code
cd /home/novelacad/app
git pull origin main

# Install new dependencies if any
cd novelacad-nuxt
npm install

# Rebuild
npm run build

# Restart application
pm2 restart novelacad
```

---

## Troubleshooting

### Application won't start
```bash
pm2 logs novelacad  # Check error logs
npm run dev         # Test locally first
```

### Database locked
```bash
# Check if another process is using database
lsof | grep database.db

# Restart application
pm2 restart novelacad
```

### Email not sending
- Check MAIL_* environment variables
- Test with `npm run dev` and use test API endpoint
- Check email provider API restrictions

### High memory usage
```bash
# Check PM2 usage
pm2 monit

# Increase Node heap size if needed
NODE_OPTIONS="--max_old_space_size=1024" npm run preview
```

sudo nano /etc/nginx/sites-available/novelacad
```

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    # Redirect HTTP to HTTPS (after SSL setup)
    # return 301 https://$server_name$request_uri;

    # Static files
    location /static {
        alias /home/novelacad/app/static;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }

    # Application
    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # Increase timeouts for long-running requests
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;

    client_max_body_size 10M;
}
```

Enable the site:

```bash
sudo ln -s /etc/nginx/sites-available/novelacad /etc/nginx/sites-enabled/
sudo nginx -t  # Test configuration
sudo systemctl restart nginx
```

### Step 9: Setup SSL with Let's Encrypt

```bash
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

Follow the prompts. Certbot will automatically:

- Obtain SSL certificate
- Update Nginx configuration
- Set up auto-renewal

Test auto-renewal:

```bash
sudo certbot renew --dry-run
```

### Step 10: Configure Firewall

```bash
sudo ufw allow 'Nginx Full'
sudo ufw allow 22  # SSH
sudo ufw enable
sudo ufw status
```

---

## Option 2: Windows Server

### Step 1: Install Prerequisites

1. Install Python 3.8+ from [python.org](https://www.python.org/downloads/)
2. Install IIS (Internet Information Services)
3. Install [wfastcgi](https://pypi.org/project/wfastcgi/)

### Step 2: Setup Application

```powershell
# Create application directory
mkdir C:\inetpub\novelacad
cd C:\inetpub\novelacad

# Copy application files
# ... (via FTP, Git, etc.)

# Create virtual environment
python -m venv venv
.\venv\Scripts\Activate.ps1

# Install dependencies
pip install -r requirements.txt
pip install wfastcgi

# Enable wfastcgi
wfastcgi-enable
```

### Step 3: Configure IIS

1. Open IIS Manager
2. Create new website:
   - Site name: Novel Academy
   - Physical path: `C:\inetpub\novelacad`
   - Binding: Port 80 (or 443 with SSL)

3. Add FastCGI handler:
   - Handler Mappings → Add Module Mapping
   - Request path: `*`
   - Module: FastCgiModule
   - Executable: `C:\inetpub\novelacad\venv\Scripts\python.exe|C:\inetpub\novelacad\venv\Scripts\wfastcgi.py`

### Step 4: Create web.config

```xml
<?xml version="1.0" encoding="UTF-8"?>
<configuration>
  <appSettings>
    <add key="PYTHONPATH" value="C:\inetpub\novelacad" />
    <add key="WSGI_HANDLER" value="app.app" />
    <add key="WSGI_LOG" value="C:\inetpub\novelacad\logs\wfastcgi.log" />
  </appSettings>
  <system.webServer>
    <handlers>
      <add name="Python FastCGI" path="*" verb="*"
           modules="FastCgiModule"
           scriptProcessor="C:\inetpub\novelacad\venv\Scripts\python.exe|C:\inetpub\novelacad\venv\Scripts\wfastcgi.py"
           resourceType="Unspecified" />
    </handlers>
  </system.webServer>
</configuration>
```

---

## Option 3: Platform as a Service (PaaS)

### Heroku Deployment

1. **Install Heroku CLI**

   ```bash
   # See: https://devcenter.heroku.com/articles/heroku-cli
   ```

2. **Create Procfile**

   ```bash
   echo "web: gunicorn app:app" > Procfile
   ```

3. **Create runtime.txt**

   ```bash
   echo "python-3.11.0" > runtime.txt
   ```

4. **Deploy**

   ```bash
   heroku login
   heroku create novelacad

   # Set environment variables
   heroku config:set SECRET_KEY=$(python -c "import secrets; print(secrets.token_hex(32))")
   heroku config:set FLASK_ENV=production

   # Deploy
   git push heroku main

   # Run database initialization
   heroku run python init_db.py
   heroku run python manage_admins.py
   ```

### Render.com Deployment

1. Connect your GitHub repository
2. Create new Web Service
3. Configure:
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `gunicorn app:app`
   - **Environment Variables**: Add `SECRET_KEY`, `FLASK_ENV=production`

---

## Post-Deployment

### Security Checklist

- [ ] Set strong `SECRET_KEY` environment variable
- [ ] Set `FLASK_DEBUG=False`
- [ ] Enable HTTPS/SSL
- [ ] Configure firewall rules
- [ ] Set up database backups
- [ ] Implement rate limiting (already in code)
- [ ] Review admin accounts
- [ ] Set secure file permissions:
  ```bash
  chmod 600 database.db
  chmod 600 .env
  ```

### Database Backup

**Linux (cron job):**

```bash
# Add to crontab: crontab -e
0 2 * * * cp /home/novelacad/app/database.db /home/novelacad/backups/database_$(date +\%Y\%m\%d).db
```

**Windows (Task Scheduler):**

```powershell
copy C:\inetpub\novelacad\database.db "C:\backups\database_%date:~-4,4%%date:~-10,2%%date:~-7,2%.db"
```

### Email Configuration

Update `app.py` to use environment variables for email:

```python
import os
from flask_mail import Mail, Message

app.config['MAIL_SERVER'] = os.environ.get('MAIL_SERVER', 'smtp.gmail.com')
app.config['MAIL_PORT'] = int(os.environ.get('MAIL_PORT', 587))
app.config['MAIL_USE_TLS'] = os.environ.get('MAIL_USE_TLS', 'True') == 'True'
app.config['MAIL_USERNAME'] = os.environ.get('MAIL_USERNAME')
app.config['MAIL_PASSWORD'] = os.environ.get('MAIL_PASSWORD')

mail = Mail(app)
```

---

## Monitoring & Maintenance

### View Logs

**Linux (Supervisor):**

```bash
sudo supervisorctl tail -f novelacad
tail -f /home/novelacad/app/logs/error.log
tail -f /home/novelacad/app/logs/access.log
```

**Nginx:**

```bash
tail -f /var/log/nginx/error.log
tail -f /var/log/nginx/access.log
```

### Application Updates

```bash
# Stop application
sudo supervisorctl stop novelacad

# Update code
cd /home/novelacad/app
git pull origin main
# OR upload new files

# Activate venv and update dependencies
source venv/bin/activate
pip install -r requirements.txt

# Run database migrations if needed
python init_db.py

# Restart application
sudo supervisorctl start novelacad

# Clear Nginx cache if needed
sudo systemctl restart nginx
```

### Health Monitoring

Consider implementing:

- **Uptime monitoring**: UptimeRobot, Pingdom
- **Error tracking**: Sentry
- **Analytics**: Google Analytics
- **Server monitoring**: New Relic, Datadog

### Common Issues

**Issue: 502 Bad Gateway**

- Check if Gunicorn is running: `sudo supervisorctl status`
- Check Gunicorn logs: `tail -f /home/novelacad/app/logs/error.log`
- Verify socket/port configuration in Nginx

**Issue: Static files not loading**

- Check Nginx static file path
- Verify file permissions: `chmod -R 755 /home/novelacad/app/static`

**Issue: Database locked**

- SQLite doesn't handle high concurrency well
- Consider migrating to PostgreSQL for production:
  ```bash
  pip install psycopg2-binary
  # Update DATABASE in .env to PostgreSQL connection string
  ```

---

## Performance Optimization

### Enable Gzip Compression (Nginx)

Add to Nginx server block:

```nginx
gzip on;
gzip_vary on;
gzip_min_length 1024;
gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/json;
```

### CDN for Static Files

Consider using Cloudflare or AWS CloudFront for static assets.

### Database Optimization

For high traffic, migrate to PostgreSQL:

```bash
sudo apt install postgresql postgresql-contrib
pip install psycopg2-binary
```

---

## Support & Troubleshooting

For issues during deployment:

1. Check application logs
2. Check web server logs (Nginx/IIS)
3. Verify environment variables are set
4. Ensure database is initialized
5. Confirm firewall rules allow traffic

---

**Deployment Complete! 🚀**

Your Novel Academy application should now be live and accessible at your domain.
