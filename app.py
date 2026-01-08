import sqlite3
print("--- APP STARTING ---")
import os
import time
from flask import Flask, render_template, request, flash, redirect, url_for, jsonify, g, session
from werkzeug.security import check_password_hash, generate_password_hash
from itsdangerous import URLSafeTimedSerializer
from flask_wtf.csrf import CSRFProtect, CSRFError
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address

# Ensure Flask uses the correct template folder
app = Flask(__name__, template_folder="templates")
app.secret_key = os.environ.get('SECRET_KEY', 'dev-key-change-in-production')  # Required for flashing messages
s = URLSafeTimedSerializer(app.secret_key)

# Initialize CSRF Protection
csrf = CSRFProtect(app)

# Initialize Rate Limiter
limiter = Limiter(
    app=app,
    key_func=get_remote_address,
    default_limits=["200 per day", "50 per hour"],
    storage_uri="memory://"
)

# Error handler for CSRF validation failures
@app.errorhandler(CSRFError)
def handle_csrf_error(e):
    """Handle CSRF token validation errors"""
    if request.is_json or request.path.startswith('/submit_'):
        return jsonify({"status": "error", "message": "CSRF token missing or invalid. Please refresh the page and try again."}), 400
    flash("CSRF token missing or invalid. Please try again.", "error")
    return redirect(request.url or url_for('home'))

# Error handler for rate limit exceeded
from flask_limiter.errors import RateLimitExceeded

@app.errorhandler(RateLimitExceeded)
def handle_rate_limit_exceeded(e):
    """Handle rate limit exceeded errors"""
    retry_after = getattr(e, 'retry_after', 60)
    if request.is_json or request.path.startswith('/submit_'):
        return jsonify({
            "status": "error", 
            "message": f"Too many requests. Please wait {retry_after} seconds before trying again."
        }), 429
    flash(f"Too many requests. Please wait a moment before trying again.", "error")
    return redirect(request.url or url_for('home')), 429

DATABASE = 'database.db'

# Anti-bot protection helper functions
def check_honeypot(form_data, honeypot_field_name='website'):
    """Check if honeypot field was filled (indicates bot)"""
    honeypot_value = form_data.get(honeypot_field_name, '').strip()
    return honeypot_value == ''  # True if honeypot is empty (human), False if filled (bot)

def check_form_timing(form_data, min_time=3):
    """Check if form was filled too quickly (indicates bot)"""
    form_start_time = form_data.get('_form_start_time', '0')
    try:
        start_time = float(form_start_time)
        elapsed_time = time.time() - start_time
        return elapsed_time >= min_time  # True if enough time passed, False if too fast
    except (ValueError, TypeError):
        return False  # If timing data is invalid, reject

def validate_anti_bot(form_data, is_json=False):
    """Validate anti-bot protections. Returns (is_valid, error_message)"""
    if is_json:
        honeypot_field = form_data.get('website', '').strip()
        honeypot_field2 = form_data.get('email_confirm', '').strip()  # Second honeypot
        form_start = form_data.get('_form_start_time', '0')
    else:
        honeypot_field = form_data.get('website', '').strip()
        honeypot_field2 = form_data.get('email_confirm', '').strip()  # Second honeypot
        form_start = form_data.get('_form_start_time', '0')
    
    # Check honeypot fields (if filled, it's a bot)
    if honeypot_field != '':
        app.logger.warning(f"Bot detected: Honeypot field 'website' was filled with: {honeypot_field}")
        return False, "Invalid submission detected."
    
    if honeypot_field2 != '':
        app.logger.warning(f"Bot detected: Honeypot field 'email_confirm' was filled with: {honeypot_field2}")
        return False, "Invalid submission detected."
    
    # Check timing - form should take at least 5 seconds to fill out
    try:
        start_time = float(form_start)
        if start_time == 0:
            return False, "Form timing validation failed. Please refresh and try again."
        
        elapsed_time = time.time() - start_time
        
        # Too fast (less than 5 seconds) - likely a bot
        if elapsed_time < 5:
            app.logger.warning(f"Bot suspected: Form submitted in {elapsed_time:.2f} seconds (too fast)")
            return False, "Form submitted too quickly. Please take your time filling out all fields carefully."
        
        # Suspiciously fast for a registration form (less than 10 seconds for complex forms)
        if elapsed_time < 10 and 'fullName' in str(form_data):
            app.logger.warning(f"Bot suspected: Registration form submitted in {elapsed_time:.2f} seconds")
            return False, "Form submitted too quickly. Please ensure all fields are completed accurately."
        
        # Too slow (more than 1 hour) - session might be stale
        if elapsed_time > 3600:
            return False, "Form session expired. Please refresh the page and try again."
            
    except (ValueError, TypeError):
        app.logger.warning(f"Invalid form timing data: {form_start}")
        return False, "Invalid form submission. Please refresh the page and try again."
    
    # Additional checks for JSON submissions
    if is_json:
        # Check if required fields are suspiciously similar (bot pattern)
        if 'fullName' in form_data and 'email' in form_data:
            name = form_data.get('fullName', '').strip()
            email = form_data.get('email', '').strip()
            if name and email and name.lower() == email.lower():
                app.logger.warning(f"Bot suspected: Name and email are identical")
                return False, "Invalid form data detected."
    
    # Basic user agent check (only reject obviously fake ones, don't be too strict)
    user_agent = request.headers.get('User-Agent', '')
    if not user_agent or len(user_agent) < 10:
        app.logger.warning(f"Suspicious user agent: {user_agent}")
        # Don't reject, just log - some privacy tools hide user agents
    
    return True, None

def get_db():
    db = getattr(g, '_database', None)
    if db is None:
        db = g._database = sqlite3.connect(DATABASE)
        db.row_factory = sqlite3.Row
    return db

@app.teardown_appcontext
def close_connection(exception):
    db = getattr(g, '_database', None)
    if db is not None:
        db.close()

# Main entry point - serves single-page app shell
@app.route("/")
def home():
    return render_template("app.html")

# SPA Routing Configuration
PAGE_MAP = {
    'home': 'index.html',
    'courses': 'course.html',
    'testimonial': 'testimonial.html',
    'registration': 'registration.html',
    'thank-you': 'thank_you.html',
}

COURSE_MAP = {
    'solar-design-installation': ('solar-design-installation.html', 'Solar Design & Installation'),
    'solarpreneurship': ('solarpreneurship.html', 'Solarpreneurship'),
    'repair-maintenance': ('repair-maintenance.html', 'Repair & Maintenance'),
    'hse-management': ('hse-management.html', 'HSE Management'),
    'ai-robotics': ('ai-robotics.html', 'AI & Robotics'),
    'web-development': ('web-development.html', 'Web Development'),
    'digital-marketing': ('digital-marketing.html', 'Digital Marketing'),
}

# API endpoint to get CSRF token for AJAX requests
@csrf.exempt
@app.route("/api/csrf-token")
def get_csrf_token():
    """Return CSRF token for AJAX requests"""
    from flask_wtf.csrf import generate_csrf
    return jsonify({"csrf_token": generate_csrf()})

# API endpoints to fetch page content dynamically
# Exclude API endpoints from CSRF protection as they're used by SPA
@csrf.exempt
@app.route("/api/page/<page_name>")
def get_page(page_name):
    """Fetch page content as JSON for SPA loading"""
    if page_name not in PAGE_MAP:
        # Check if it's a course name
        if page_name in COURSE_MAP:
             return get_course(page_name)
        app.logger.warning(f"Page not found: {page_name}")
        return jsonify({"error": "Page not found"}), 404

    try:
        content = render_template(f"pages/{PAGE_MAP[page_name]}")
        return jsonify({"content": content, "page": page_name})
    except Exception as e:
        app.logger.error(f"Error rendering page '{page_name}': {e}")
        return jsonify({"error": str(e)}), 500

@csrf.exempt
@app.route("/api/course/<course_slug>")
def get_course(course_slug):
    """Fetch course content dynamically"""
    if course_slug not in COURSE_MAP:
        return jsonify({"error": "Course not found"}), 404
    
    try:
        template_file, course_name = COURSE_MAP[course_slug]
        content = render_template(f"pages/{template_file}")
        return jsonify({"content": content, "page": f"course-{course_slug}", "title": course_name})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/admin/login", methods=["GET", "POST"])
def admin_login():
    if request.method == "POST":
        username = request.form.get("username")
        password = request.form.get("password")
        
        db = get_db()
        user = db.execute('SELECT * FROM admins WHERE username = ?', (username,)).fetchone()
        
        if user and check_password_hash(user['password_hash'], password):
            session['admin_logged_in'] = True
            session['admin_role'] = user['role']
            session['admin_username'] = user['username'] 
            flash("Successfully logged in!", "success")
            return redirect(url_for('admin_dashboard'))
        else:
            flash("Invalid username or password.", "error")
            
    return render_template("admin/login.html")

@app.route("/admin/logout")
def admin_logout():
    session.pop('admin_logged_in', None)
    session.pop('admin_role', None)
    session.pop('admin_username', None)
    flash("You have been logged out.", "success")
    return redirect(url_for('admin_login'))

@app.route("/admin/dashboard")
def admin_dashboard():
    if not session.get('admin_logged_in'):
        flash("Please log in to access the dashboard.", "error")
        return redirect(url_for('admin_login'))

    db = get_db()
    registrations = db.execute('SELECT id, full_name, course, submitted_at FROM registrations ORDER BY submitted_at DESC').fetchall()
    messages = db.execute('SELECT * FROM messages ORDER BY submitted_at DESC').fetchall()
    admins = db.execute('SELECT * FROM admins').fetchall() 
    return render_template("admin/dashboard.html", registrations=registrations, messages=messages, admins=admins)

@app.route("/admin/registration/<int:reg_id>")
def registration_details(reg_id):
    if not session.get('admin_logged_in'):
        return redirect(url_for('admin_login'))
    
    db = get_db()
    registration = db.execute('SELECT * FROM registrations WHERE id = ?', (reg_id,)).fetchone()
    
    if registration is None:
        flash("Registration not found.", "error")
        return redirect(url_for('admin_dashboard'))
        
    return render_template("admin/registration_details.html", registration=registration)

@app.route("/admin/create", methods=["POST"])
def create_admin():
    if not session.get('admin_logged_in'):
        return redirect(url_for('admin_login'))
    
    # MASTER ADMIN CHECK
    if session.get('admin_role') != 'master':
        flash("Unauthorized: Only Master Admins can create new admins.", "error")
        return redirect(url_for('admin_dashboard'))
        
    username = request.form.get("username")
    email = request.form.get("email")
    password = request.form.get("password")
    
    if not username or not email or not password:
        flash("All fields are required.", "error")
        return redirect(url_for('admin_dashboard'))
        
    password_hash = generate_password_hash(password)
    db = get_db()
    try:
        
        db.execute('INSERT INTO admins (username, email, role, password_hash) VALUES (?, ?, ?, ?)',
                   (username, email, 'admin', password_hash))
        db.commit()
        flash(f"Admin '{username}' successfully created.", "success")
    except sqlite3.IntegrityError:
        flash("Username or Email already exists.", "error")
        
    return redirect(url_for('admin_dashboard'))

@app.route("/admin/delete/<int:admin_id>", methods=["POST"])
def delete_admin(admin_id):
    if not session.get('admin_logged_in'):
        return redirect(url_for('admin_login'))
    
    # MASTER ADMIN CHECK
    if session.get('admin_role') != 'master':
        flash("Unauthorized: Only Master Admins can delete admins.", "error")
        return redirect(url_for('admin_dashboard'))
    
    # Prevent deletion of self
    db = get_db()
    current_user = db.execute('SELECT id FROM admins WHERE username = ?', (session.get('admin_username'),)).fetchone()
    if current_user and current_user['id'] == admin_id:
         flash("Operation failed: You cannot delete your own account.", "error")
         return redirect(url_for('admin_dashboard'))

    # Execute deletion
    db.execute('DELETE FROM admins WHERE id = ?', (admin_id,))
    db.commit()
    flash("Admin user deleted successfully.", "success")
    return redirect(url_for('admin_dashboard'))

@app.route("/admin/forgot-password", methods=["GET", "POST"])
def forgot_password():
    if request.method == "POST":
        email = request.form.get("email")
        db = get_db()
        user = db.execute('SELECT * FROM admins WHERE email = ?', (email,)).fetchone()
        
        if user:
            token = s.dumps(email, salt='email-confirm')
            link = url_for('reset_password', token=token, _external=True)
            # In a real app, send this via email.
            print(f"----- PASSWORD RESET LINK FOR {email} -----")
            print(link)
            print("---------------------------------------------")
            flash("A password reset link has been sent to your email (check server console).", "success")
        else:
            flash("Email not found.", "error")
            
    return render_template("admin/forgot_password.html")

@app.route("/admin/reset-password/<token>", methods=["GET", "POST"])
def reset_password(token):
    try:
        email = s.loads(token, salt='email-confirm', max_age=3600)
    except:
        flash("The reset link is invalid or has expired.", "error")
        return redirect(url_for('admin_login'))
        
    if request.method == "POST":
        password = request.form.get("password")
        confirm = request.form.get("confirm_password")
        
        if password != confirm:
            flash("Passwords do not match.", "error")
            return redirect(url_for('reset_password', token=token))
            
        password_hash = generate_password_hash(password)
        db = get_db()
        db.execute('UPDATE admins SET password_hash = ? WHERE email = ?', (password_hash, email))
        db.commit()
        flash("Your password has been reset successfully. Please login.", "success")
        return redirect(url_for('admin_login'))

    return render_template("admin/reset_password.html", token=token)

# Contact Form Submission
@limiter.limit("5 per minute")  # Rate limit: 5 submissions per minute per IP
@app.route("/submit_contact", methods=["POST"])
def submit_contact():
    # Anti-bot validation
    is_valid, error_msg = validate_anti_bot(request.form, is_json=False)
    if not is_valid:
        flash(error_msg or "Invalid submission detected.", "error")
        return redirect(url_for('home'))
    
    name = request.form.get("name")
    email = request.form.get("email")
    subject = request.form.get("subject")
    message = request.form.get("message")
    
    # Basic validation
    if not name or not email or not message:
        flash("Please fill in all required fields.", "error")
        return redirect(url_for('home'))
    
    # Save to DB
    try:
        db = get_db()
        db.execute('INSERT INTO messages (name, email, subject, message) VALUES (?, ?, ?, ?)',
                   (name, email, subject, message))
        db.commit()
        print(f"Contact Form Submission Saved: {name}, {email}")
        flash("Your message has been sent successfully!", "success")
    except Exception as e:
        app.logger.error(f"Error saving contact form: {e}")
        flash("An error occurred. Please try again later.", "error")
    
    return redirect(url_for('home'))


@limiter.limit("3 per hour")  # Rate limit: 3 registrations per hour per IP
@app.route("/submit_registration", methods=["POST"])
def submit_registration():
    if request.is_json:
        data = request.get_json()
        
        # Anti-bot validation
        is_valid, error_msg = validate_anti_bot(data, is_json=True)
        if not is_valid:
            return jsonify({"status": "error", "message": error_msg or "Invalid submission detected."}), 400
        
        # Basic validation
        required_fields = ['fullName', 'email', 'phoneNumber', 'dob', 'sex', 'nationality', 'state', 'course', 'educationLevel', 'qualification', 'courseGoals', 'infoSource']
        missing_fields = [field for field in required_fields if not data.get(field)]
        if missing_fields:
            return jsonify({"status": "error", "message": "Please fill in all required fields."}), 400
        
        # Save to DB
        try:
            db = get_db()
            db.execute('''INSERT INTO registrations 
                          (full_name, email, phone, dob, address, sex, nationality, state, course, level, qualification, goals, experience, info_source) 
                          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)''',
                       (data.get('fullName'), data.get('email'), data.get('phoneNumber'), data.get('dob'), data.get('address'), 
                        data.get('sex'), data.get('nationality'), data.get('state'), data.get('course'), 
                        data.get('educationLevel'), data.get('qualification'), data.get('courseGoals'), data.get('experience'), data.get('infoSource')))
            db.commit()
            print(f"Registration Submission Saved (JSON): {data.get('fullName')}")
            return jsonify({"status": "success", "message": "Registration received", "redirect": "/thank-you"})
        except Exception as e:
            app.logger.error(f"Error saving registration: {e}")
            return jsonify({"status": "error", "message": "An error occurred. Please try again later."}), 500
    
    # Fallback for standard form submission (if JS fails or is disabled)
    # Anti-bot validation
    is_valid, error_msg = validate_anti_bot(request.form, is_json=False)
    if not is_valid:
        flash(error_msg or "Invalid submission detected.", "error")
        return redirect('/registration')
    
    # Match the field names to what registration.html actually sends
    full_name = request.form.get("fullName")
    email = request.form.get("email")
    phone = request.form.get("phoneNumber")
    dob = request.form.get("dob")
    address = request.form.get("address")
    sex = request.form.get("sex")
    nationality = request.form.get("nationality")
    state = request.form.get("state")
    course = request.form.get("course")
    level = request.form.get("educationLevel")
    qualification = request.form.get("qualification")
    goals = request.form.get("courseGoals")
    experience = request.form.get("experience")
    info_source = request.form.get("infoSource")

    try:
        db = get_db()
        db.execute('''INSERT INTO registrations 
                      (full_name, email, phone, dob, address, sex, nationality, state, course, level, qualification, goals, experience, info_source) 
                      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)''',
                   (full_name, email, phone, dob, address, sex, nationality, state, course, level, qualification, goals, experience, info_source))
        db.commit()
        print(f"Registration Submission Saved (Form): {full_name}")
        flash("Registration submitted successfully!", "success")
    except Exception as e:
        app.logger.error(f"Error saving registration: {e}")
        flash("An error occurred. Please try again later.", "error")
        return redirect('/registration')
    
    return redirect('/thank-you')


# Unified route to serve SPA shell for all frontend paths
@app.route("/", defaults={'path': ''})
@app.route("/<path:path>")
def catch_all(path):
    # Exclude Static files from catch-all if they fall through
    if path.startswith('static/'):
        return None
        
    return render_template("app.html")

if __name__ == "__main__":
    app.run(debug=os.environ.get('FLASK_DEBUG', False))
