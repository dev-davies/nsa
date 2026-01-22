# Novel Academy

> Where innovation meets sustainability!

A modern Flask-based course registration and management system for Novel Academy, offering courses in solar energy, AI & robotics, web development, and professional development.

## ✨ Features

### Public-Facing

- 🎓 **7 Course Offerings**: Solar Design & Installation, Solarpreneurship, Repair & Maintenance, HSE Management, AI & Robotics, Web Development, and Digital Marketing
- 📝 **Online Registration**: Multi-step registration form with course duration selection (6-month Certificate, 1-year Associate Diploma, 2-year Diploma)
- 📱 **Single Page Application**: Smooth navigation without page reloads
- 🛡️ **Anti-Bot Protection**: Honeypot fields and timing validation
- 💬 **Contact Form**: Direct messaging to academy administrators
- 🎨 **Modern UI**: Responsive design with Bootstrap and custom styling

### Admin Panel

- 🔐 **Secure Authentication**: Login system with password reset
- 📊 **Dashboard**: View all registrations and contact messages
- 👥 **User Management**: Create and manage admin accounts with role-based access
- 🔍 **Registration Details**: Detailed view of student applications
- 🛡️ **Role-Based Access**: Master admins can create/delete admin users
- 🚦 **Rate Limiting**: Protection against spam and abuse

## 🚀 Quick Start

### Prerequisites

- Python 3.8 or higher
- pip (Python package manager)
- Git (optional, for cloning)

### Installation

1. **Clone or download the repository**

   ```bash
   cd c:\Users\Novel\Downloads\novelacad
   ```

2. **Create a virtual environment**

   ```bash
   python -m venv venv
   ```

3. **Activate the virtual environment**

   **Windows (PowerShell):**

   ```powershell
   .\venv\Scripts\Activate.ps1
   ```

   **Windows (Command Prompt):**

   ```cmd
   venv\Scripts\activate.bat
   ```

4. **Install dependencies**

   ```bash
   pip install -r requirements.txt
   ```

5. **Initialize the database**

   ```bash
   python init_db.py
   ```

6. **Create your first admin user**

   ```bash
   python manage_admins.py
   ```

   - Select option `1` to add a new admin
   - Enter username, email, and password
   - Choose role: `master` (for full access) or `admin`

7. **Run the application**

   ```bash
   python app.py
   ```

8. **Access the application**
   - Public site: `http://localhost:5000`
   - Admin panel: `http://localhost:5000/admin/login`

## ⚙️ Configuration

### Environment Variables

For production deployment, set these environment variables:

- `SECRET_KEY`: Flask secret key for session management (required for production)
- `FLASK_DEBUG`: Set to `False` in production
- `DATABASE`: Path to SQLite database file (default: `database.db`)

**Example:**

```bash
export SECRET_KEY="your-secure-random-key-here"
export FLASK_DEBUG=False
```

### Database Schema

The application uses SQLite with three main tables:

- **registrations**: Student course registrations
- **messages**: Contact form submissions
- **admins**: Admin user accounts

## 📚 Usage Guide

### For Students

1. **Browse Courses**: Navigate to the Courses page to view available programs
2. **Register**: Click on a course and fill out the registration form
3. **Select Duration**: Choose between 6-month Certificate, 1-year Associate Diploma, or 2-year Diploma
4. **Submit**: Complete all required fields and submit your application
5. **Confirmation**: You'll be redirected to a thank you page upon successful submission

### For Administrators

1. **Login**: Navigate to `/admin/login`
2. **Dashboard**: View all registrations and messages
3. **Review Applications**: Click on any registration to see full details
4. **Manage Admins** (Master admins only):
   - Create new admin users from the dashboard
   - Delete existing admin accounts
   - Cannot delete your own account

### Creating Additional Admins

**Via Command Line:**

```bash
python manage_admins.py
```

**Via Admin Dashboard:**

1. Log in as a Master admin
2. Scroll to the "Admin Management" section
3. Fill in the form to create a new admin user

### Promoting Admins to Master

```bash
python manage_admins.py
```

- Select option `2`
- Enter the username to promote

## 🏗️ Project Structure

```
novelacad/
├── app.py                      # Main Flask application
├── schema.sql                  # Database schema
├── init_db.py                  # Database initialization script
├── manage_admins.py            # Admin management CLI
├── requirements.txt            # Python dependencies
├── database.db                 # SQLite database (created on init)
├── static/                     # Static assets
│   ├── css/                    # Stylesheets
│   ├── js/                     # JavaScript files
│   │   └── main.js            # Site-wide functionality
│   ├── img/                    # Images and logos
│   ├── lib/                    # Third-party libraries
│   └── docs/                   # PDF documents
└── templates/                  # HTML templates
    ├── app.html               # SPA shell
    ├── pages/                 # Public page templates
    │   ├── index.html         # Homepage
    │   ├── course.html        # Course listing
    │   ├── registration.html  # Registration form
    │   └── *.html            # Individual course pages
    ├── admin/                 # Admin panel templates
    │   ├── login.html
    │   ├── dashboard.html
    │   └── registration_details.html
    └── includes/              # Reusable components
        ├── navbar.html
        └── footer.html
```

## 🔧 Technology Stack

**Backend:**

- Flask (Python web framework)
- SQLite (Database)
- Flask-WTF (CSRF protection)
- Flask-Limiter (Rate limiting)
- Werkzeug (Password hashing)
- itsdangerous (Token generation)

**Frontend:**

- HTML5/CSS3
- JavaScript (ES6+)
- jQuery
- Bootstrap 4
- Owl Carousel
- Typed.js

## 🛡️ Security Features

- ✅ CSRF protection on all forms
- ✅ Rate limiting on registration and contact forms
- ✅ Password hashing with Werkzeug
- ✅ Anti-bot validation (honeypot fields + timing)
- ✅ Session-based authentication
- ✅ Role-based access control
- ✅ SQL injection protection via parameterized queries

## 🐛 Troubleshooting

### Database Issues

**Error: "no such table: registrations"**

```bash
python init_db.py
```

**Reset the database completely:**

```bash
# Delete existing database
del database.db  # Windows
rm database.db   # Linux/Mac

# Reinitialize
python init_db.py
python manage_admins.py
```

### Port Already in Use

If port 5000 is already in use, modify `app.py`:

```python
if __name__ == "__main__":
    app.run(debug=True, port=5001)  # Change port
```

### Admin Login Issues

**Forgot password:**

1. Navigate to `/admin/forgot-password`
2. Enter your email
3. Check the server console for the password reset link
4. Note: Email integration is not yet configured, links print to console

## 📝 Development

### Running in Debug Mode

```bash
python app.py
```

Debug mode is enabled by default in development. The app will auto-reload when you make changes.

### Database Migrations

The application includes automatic migration support. Missing columns will be added automatically on startup.

To manually check database structure:

```bash
sqlite3 database.db
.schema
```

## 🚀 Deployment

### Production Checklist

- [ ] Set `SECRET_KEY` environment variable to a strong random value
- [ ] Set `FLASK_DEBUG=False`
- [ ] Use a production WSGI server (Gunicorn, uWSGI)
- [ ] Set up HTTPS/SSL
- [ ] Configure email service for password resets
- [ ] Set up regular database backups
- [ ] Enable logging and error tracking

### Example with Gunicorn

```bash
pip install gunicorn
gunicorn -w 4 -b 0.0.0.0:8000 app:app
```

## 📋 Known Limitations

- Email functionality not yet implemented (password reset links print to console)
- No data export feature for registrations
- No pagination on admin dashboard
- Registration status tracking not implemented

## 🤝 Contributing

This is a private project for Novel Academy. For questions or issues, contact the development team.

## 📄 License

Proprietary - Novel Academy © 2026

---

**Built with ❤️ for Novel Academy - Where innovation meets sustainability!**
