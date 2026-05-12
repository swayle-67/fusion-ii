import os
import psycopg2
import psycopg2.extras
from flask import Flask, render_template, redirect, request, session, flash, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from functools import wraps

app = Flask(__name__)
app.secret_key = os.environ["SECRET_KEY"]

# ── ADMINS ──────────────────────────────────────────────────────────────────
ADMINS = ["n0xy-dev", "swayle"]
# ────────────────────────────────────────────────────────────────────────────

def get_db():
    return psycopg2.connect(
        os.environ["DATABASE_URL"],
        cursor_factory=psycopg2.extras.RealDictCursor
    )

def db_execute(query, *args):
    # Convert SQLite ? placeholders to PostgreSQL %s
    query = query.replace("?", "%s")
    conn = get_db()
    cur = conn.cursor()
    cur.execute(query, args if args else None)
    conn.commit()
    try:
        results = [dict(row) for row in cur.fetchall()]
    except Exception:
        results = []
    cur.close()
    conn.close()
    return results

def init_db():
    conn = get_db()
    cur = conn.cursor()

    cur.execute("""CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE NOT NULL,
        hash TEXT NOT NULL)""")

    cur.execute("""CREATE TABLE IF NOT EXISTS portfolio (
        id SERIAL PRIMARY KEY,
        business_name TEXT NOT NULL,
        description TEXT NOT NULL,
        link TEXT NOT NULL,
        tier TEXT NOT NULL,
        gif_url TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)""")

    cur.execute("""CREATE TABLE IF NOT EXISTS ratings (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL,
        portfolio_id INTEGER,
        company_rating INTEGER CHECK (company_rating BETWEEN 1 AND 5),
        service_rating INTEGER CHECK (service_rating BETWEEN 1 AND 5),
        project_rating INTEGER CHECK (project_rating BETWEEN 1 AND 5),
        comment TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)""")

    cur.execute("""CREATE TABLE IF NOT EXISTS bookings (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        phone TEXT NOT NULL,
        slot TEXT NOT NULL,
        notes TEXT,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP)""")

    conn.commit()
    cur.close()
    conn.close()

@app.before_request
def setup():
    if not getattr(app, '_db_ready', False):
        init_db()
        app._db_ready = True

# ── DECORATORS ───────────────────────────────────────────────────────────────

def login_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        if not session.get("user_id"):
            return redirect("/login")
        return f(*args, **kwargs)
    return decorated

def admin_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        if session.get("username") not in ADMINS:
            flash("Access denied.", "error")
            return redirect("/")
        return f(*args, **kwargs)
    return decorated

@app.context_processor
def inject_globals():
    return dict(session=session, ADMINS=ADMINS)

# ── PAGES ────────────────────────────────────────────────────────────────────

@app.route("/")
def index():
    portfolio = db_execute("SELECT * FROM portfolio ORDER BY created_at DESC")
    return render_template("index.html", portfolio=portfolio)

@app.route("/pricing")
def pricing():
    return render_template("pricing.html")

@app.route("/about")
def about():
    return render_template("about.html")

@app.route("/chat")
def chat():
    return render_template("chat.html")

@app.route("/privacy")
def privacy():
    return render_template("privacy.html")

# ── AUTH ─────────────────────────────────────────────────────────────────────

@app.route("/register", methods=["GET", "POST"])
def register():
    if request.method == "POST":
        username = request.form.get("username", "").strip()
        email = request.form.get("email", "").strip()
        password = request.form.get("password", "")
        confirmation = request.form.get("confirmation", "")
        if not all([username, email, password, confirmation]):
            flash("All fields required.", "error")
            return render_template("register.html")
        if password != confirmation:
            flash("Passwords do not match.", "error")
            return render_template("register.html")
        try:
            db_execute("INSERT INTO users (username, email, hash) VALUES (?, ?, ?)",
                       username, email, generate_password_hash(password))
        except Exception:
            flash("Username or email already taken.", "error")
            return render_template("register.html")
        flash("Account created! Please log in.", "success")
        return redirect("/login")
    return render_template("register.html")

@app.route("/login", methods=["GET", "POST"])
def login():
    if session.get("user_id"):
        return redirect("/")
    session.clear()
    if request.method == "POST":
        username = request.form.get("username", "").strip()
        password = request.form.get("password", "")
        rows = db_execute("SELECT * FROM users WHERE username = ?", username)
        if len(rows) != 1 or not check_password_hash(rows[0]["hash"], password):
            flash("Invalid username or password.", "error")
            return render_template("login.html")
        session["user_id"] = rows[0]["id"]
        session["username"] = rows[0]["username"]
        return redirect("/")
    return render_template("login.html")

@app.route("/logout")
def logout():
    session.clear()
    return redirect("/")

# ── PORTFOLIO ─────────────────────────────────────────────────────────────────

@app.route("/portfolio/add", methods=["GET", "POST"])
@login_required
@admin_required
def add_project():
    if request.method == "POST":
        business_name = request.form.get("business_name", "").strip()
        description = request.form.get("description", "").strip()
        link = request.form.get("link", "").strip()
        tier = request.form.get("tier", "").strip()
        if not all([business_name, description, link, tier]):
            flash("All fields are required.", "error")
            return render_template("projects.html")
        db_execute("INSERT INTO portfolio (business_name, description, link, tier) VALUES (?, ?, ?, ?)",
                   business_name, description, link, tier)
        flash("Project added!", "success")
        return redirect("/")
    return render_template("projects.html")

@app.route("/portfolio/delete/<int:project_id>", methods=["POST"])
@login_required
@admin_required
def delete_project(project_id):
    db_execute("DELETE FROM ratings WHERE portfolio_id = ?", project_id)
    db_execute("DELETE FROM portfolio WHERE id = ?", project_id)
    flash("Project deleted.", "info")
    return redirect("/")

# ── RATINGS ───────────────────────────────────────────────────────────────────

@app.route("/ratings")
def ratings():
    all_ratings = db_execute("""
        SELECT ratings.*, users.username, portfolio.business_name
        FROM ratings JOIN users ON users.id = ratings.user_id
        LEFT JOIN portfolio ON portfolio.id = ratings.portfolio_id
        ORDER BY ratings.created_at DESC""")
    portfolio = db_execute("SELECT id, business_name FROM portfolio ORDER BY business_name")
    avg = db_execute("""SELECT ROUND(AVG(company_rating)::numeric,1) as avg_company,
        ROUND(AVG(service_rating)::numeric,1) as avg_service,
        ROUND(AVG(project_rating)::numeric,1) as avg_project FROM ratings""")
    return render_template("ratings.html", ratings=all_ratings, portfolio=portfolio,
                           averages=avg[0] if avg else {})

@app.route("/ratings/add", methods=["POST"])
@login_required
def add_rating():
    portfolio_id = request.form.get("portfolio_id") or None
    company_rating = request.form.get("company_rating")
    service_rating = request.form.get("service_rating")
    project_rating = request.form.get("project_rating")
    comment = request.form.get("comment", "").strip()
    if not all([company_rating, service_rating, project_rating]):
        flash("Please provide all ratings.", "error")
        return redirect("/ratings")
    existing = db_execute("SELECT id FROM ratings WHERE user_id = ? AND portfolio_id IS NOT DISTINCT FROM ?",
                          session["user_id"], portfolio_id)
    if existing:
        flash("You've already rated this.", "error")
        return redirect("/ratings")
    db_execute("""INSERT INTO ratings
        (user_id, portfolio_id, company_rating, service_rating, project_rating, comment)
        VALUES (?, ?, ?, ?, ?, ?)""",
               session["user_id"], portfolio_id, int(company_rating),
               int(service_rating), int(project_rating), comment)
    flash("Rating submitted!", "success")
    return redirect("/ratings")

# ── BOOKINGS ──────────────────────────────────────────────────────────────────

@app.route('/api/booking', methods=['POST'])
def save_booking():
    data = request.get_json()
    if not data:
        return jsonify({'status': 'error', 'message': 'No data received'}), 400
    db_execute(
        "INSERT INTO bookings (name, phone, slot, notes) VALUES (?, ?, ?, ?)",
        data.get('name', ''),
        data.get('phone', ''),
        data.get('slot', ''),
        data.get('notes', '')
    )
    return jsonify({'status': 'saved'})

@app.route('/admin/bookings')
@login_required
@admin_required
def view_bookings():
    bookings = db_execute("SELECT * FROM bookings ORDER BY timestamp DESC")
    return render_template("bookings.html", bookings=bookings)

@app.route('/admin/bookings/delete/<int:booking_id>', methods=['POST'])
@login_required
@admin_required
def delete_booking(booking_id):
    db_execute("DELETE FROM bookings WHERE id = ?", booking_id)
    flash("Booking deleted.", "info")
    return redirect("/admin/bookings")

@app.route("/portfolio")
def portfolio():
    projects = db_execute("SELECT * FROM portfolio ORDER BY created_at DESC")
    all_ratings = db_execute("SELECT * FROM ratings")
    return render_template("portfolio.html", portfolio=projects, ratings=all_ratings)

if __name__ == "__main__":
    app.run(debug=True)