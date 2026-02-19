# Deploying to Namecheap (Main Domain: novel-techtraining.com)

This guide takes you through deploying your Flask application to your main domain `novel-techtraining.com` from scratch.

## Step 1: Prepare Your Files (Local)

1.  **Check `requirements.txt`**: Ensure it contains `reportlab` (not `flask-corsreportlab`).
2.  **Check `passenger_wsgi.py`**: Ensure this file exists in your project root.
3.  **Zip your project**: Select all files in your project folder (except `venv`, `.git`, `.idea`, `__pycache__`) and zip them into `novelacad.zip`.

## Step 2: Upload Files to Namecheap

1.  Log in to **cPanel**.
2.  Open **File Manager**.
3.  **Create a Folder**:
    - Navigate to your home directory (`/home/yourusername/`).
    - Create a NEW folder named `novelacad_prod` (or similar).
    - **CRITICAL:** Do NOT upload your files directly into `public_html` or the `novel-techtraining.com` folder.
    - _Why?_ For security, your application code should live _outside_ the public web root. The "Setup Python App" tool will link your domain (`novel-techtraining.com`) to this private folder (`novelacad_prod`) automatically.
4.  **Upload**:
    - Go into `novelacad_prod`.
    - Upload `novelacad.zip`.
    - Right-click and **Extract** it here.

## Step 3: Configure Python App in cPanel

1.  Go back to cPanel main menu.
2.  Scroll to **Software** -> **Setup Python App**.
3.  _If you have an old app for `api.novel-techtraining.com`, delete it to avoid conflicts (optional)._
4.  Click **Create Application**.
5.  **Configure**:
    - **Python Version**: **3.8** (Recommended) or 3.9.
    - **Application Root**: `novelacad_prod` (The folder you just created).
    - **Application URL**: Select `novel-techtraining.com` from the dropdown. Leave the field blank to deploy to the root (e.g., `https://novel-techtraining.com/`).
    - **Application Startup File**: `passenger_wsgi.py`
    - **Application Entry Point**: `application`
6.  Click **Create**.

## Step 4: Install Dependencies

1.  At the top of the app page, look for the **"Enter to the virtual environment"** command. copying it.
    - Example: `source /home/user/virtualenv/novelacad_prod/3.8/bin/activate && cd /home/user/novelacad_prod`
2.  Open **Terminal** in cPanel.
3.  Paste the command and press Enter.
4.  Run:
    ```bash
    pip install -r requirements.txt
    ```

## Step 5: Database & Environment Setup

1.  **Initialize Database**:
    (Still in Terminal)

    ```bash
    python init_db.py
    python manage_admins.py
    ```

    - Create your Master Admin user when prompted.

2.  **Add Environment Variables**:
    Go back to the "Setup Python App" page in cPanel.
    Scroll to **Environment variables**.
    Add:
    - `SECRET_KEY`: (Any long random string)
    - `FLASK_ENV`: `production`
    - `FLASK_DEBUG`: `False`

    Click **Save**.

## Step 6: Restart & Test

1.  Click **Restart** on the Python App page.
2.  Visit `https://novel-techtraining.com`.

## Troubleshooting

- **"It works!" default page**: If you see a default Python page, ensure your `passenger_wsgi.py` is correct and you clicked **Restart**.
- **Static Files (CSS/Images missing)**:
  - Flask should serve them automatically in this setup.
  - If not, you might need to try forcing `STATIC_URL` or ensuring the `static` folder is inside `novelacad_prod`.
