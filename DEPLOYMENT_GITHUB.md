# Deploying to Namecheap via GitHub Actions

Automatically deploy your Flask app to `novel-techtraining.com` whenever you push to `main`.

## One-Time Setup

### Step 1: Create a Dedicated FTP Account in cPanel

Instead of using your main cPanel password, create a restricted FTP account for deployments:

1. Log in to **cPanel** → **FTP Accounts**
2. Click **Add FTP Account** and fill in:
   - **Log In**: `deploy` (resulting in `deploy@novel-techtraining.com`)
   - **Password**: Choose a strong, unique password
   - **Directory**: Set to `/oldacad` (restricts access to your app folder only)
3. Click **Create FTP Account**

> **Why?** This means your main cPanel password is never stored in GitHub, and the account only has access to the `/oldacad` folder.

### Step 2: Add GitHub Secrets

Go to **[Repository Settings → Secrets → Actions](https://github.com/novelacadhost-sketch/novelacad/settings/secrets/actions)** and add:

| Secret Name    | Value                                                           |
| -------------- | --------------------------------------------------------------- |
| `FTP_SERVER`   | `ftp.novel-techtraining.com` (or server IP from cPanel sidebar) |
| `FTP_USERNAME` | `deploy@novel-techtraining.com`                                 |
| `FTP_PASSWORD` | The password you set for the FTP account above                  |

---

## How to Deploy

```bash
git add .
git commit -m "Your change description"
git push origin main
```

Then check the **[Actions tab](https://github.com/novelacadhost-sketch/novelacad/actions)** for deployment status.

## After Deployment

Go to **cPanel → Setup Python App → Restart** to reload the application with new code.

> **Tip**: If static files (CSS/images) update but Python code changes don't take effect, the WSGI process needs a restart.

## What Gets Deployed

Everything in the repo syncs to `/oldacad/` on the server, **except**:

- `.git/`, `venv/`, `__pycache__/`
- `*.db` files (your database stays safely on the server)
- `DEPLOYMENT*.md`, `README.md`
