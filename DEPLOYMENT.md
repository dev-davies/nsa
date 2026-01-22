# Novel Academy - Deployment Guide

This guide covers deploying the Novel Academy application to a production environment.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Deployment Options](#deployment-options)
- [Option 1: Linux Server (Ubuntu/Debian)](#option-1-linux-server-ubuntudebian)
- [Option 2: Windows Server](#option-2-windows-server)
- [Option 3: Platform as a Service (PaaS)](#option-3-platform-as-a-service-paas)
- [Post-Deployment](#post-deployment)
- [Monitoring & Maintenance](#monitoring--maintenance)

---

## Prerequisites

- Server with minimum 1GB RAM, 1 CPU core, 10GB storage
- Python 3.8 or higher
- Domain name (optional but recommended)
- SSL certificate (Let's Encrypt recommended)

---

## Deployment Options

### Quick Comparison

| Option                | Difficulty | Cost       | Best For                           |
| --------------------- | ---------- | ---------- | ---------------------------------- |
| Linux Server (VPS)    | Medium     | Low        | Full control, custom setup         |
| Windows Server        | Medium     | Medium     | Windows environment                |
| PaaS (Heroku, Render) | Easy       | Low-Medium | Quick deployment, less maintenance |

---

## Option 1: Linux Server (Ubuntu/Debian)

This is the recommended approach for production deployments.

### Step 1: Server Setup

```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Install required packages
sudo apt install -y python3 python3-pip python3-venv nginx supervisor git

# Install certbot for SSL (optional)
sudo apt install -y certbot python3-certbot-nginx
```

### Step 2: Create Application User

```bash
# Create dedicated user for the application
sudo useradd -m -s /bin/bash novelacad
sudo su - novelacad
```

### Step 3: Deploy Application Code

```bash
# Clone or upload your code
cd /home/novelacad
git clone <your-repo-url> app
# OR upload via SCP/FTP

cd app

# Create virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
pip install gunicorn  # Production WSGI server
```

### Step 4: Environment Configuration

Create environment file:

```bash
nano /home/novelacad/app/.env
```

Add the following:

```env
# Flask Configuration
SECRET_KEY=your-very-long-random-secret-key-change-this
FLASK_DEBUG=False
FLASK_ENV=production

# Database
DATABASE=/home/novelacad/app/database.db

# Email Configuration (optional)
MAIL_SERVER=smtp.gmail.com
MAIL_PORT=587
MAIL_USE_TLS=True
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password

# Application URL
APP_URL=https://yourdomain.com
```

**Generate a secure secret key:**

```bash
python3 -c "import secrets; print(secrets.token_hex(32))"
```

### Step 5: Initialize Database

```bash
# While in /home/novelacad/app with venv activated
python init_db.py

# Create first admin user
python manage_admins.py
```

### Step 6: Configure Gunicorn

Create Gunicorn configuration:

```bash
nano /home/novelacad/app/gunicorn_config.py
```

```python
# Gunicorn configuration file
import multiprocessing

bind = "127.0.0.1:8000"
workers = multiprocessing.cpu_count() * 2 + 1
worker_class = "sync"
worker_connections = 1000
timeout = 30
keepalive = 2

# Logging
accesslog = "/home/novelacad/app/logs/access.log"
errorlog = "/home/novelacad/app/logs/error.log"
loglevel = "info"

# Process naming
proc_name = "novelacad"

# Server mechanics
daemon = False
pidfile = "/home/novelacad/app/gunicorn.pid"
```

Create logs directory:

```bash
mkdir -p /home/novelacad/app/logs
```

### Step 7: Configure Supervisor

Exit to root user and create supervisor config:

```bash
exit  # Exit from novelacad user
sudo nano /etc/supervisor/conf.d/novelacad.conf
```

```ini
[program:novelacad]
command=/home/novelacad/app/venv/bin/gunicorn -c /home/novelacad/app/gunicorn_config.py app:app
directory=/home/novelacad/app
user=novelacad
autostart=true
autorestart=true
stopasgroup=true
killasgroup=true
stderr_logfile=/home/novelacad/app/logs/supervisor_error.log
stdout_logfile=/home/novelacad/app/logs/supervisor_out.log
environment=PATH="/home/novelacad/app/venv/bin"
```

Start the application:

```bash
sudo supervisorctl reread
sudo supervisorctl update
sudo supervisorctl start novelacad
sudo supervisorctl status novelacad
```

### Step 8: Configure Nginx

```bash
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
