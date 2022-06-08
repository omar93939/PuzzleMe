from cs50 import SQL
from flask import Flask, flash, redirect, render_template, request, session
from flask_session import Session
from tempfile import mkdtemp
from werkzeug.security import check_password_hash, generate_password_hash

from helpers import apology, login_required

from datetime import datetime, timezone

# Configure application
app = Flask(__name__)

# Ensure templates are auto-reloaded
app.config["TEMPLATES_AUTO_RELOAD"] = True

# Configure session to use filesystem (instead of signed cookies)
app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
Session(app)

# Configure CS50 Library to use SQLite database
db = SQL("sqlite:///accounts.db")


@app.after_request
def after_request(response):
    """Ensure responses aren't cached"""
    response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
    response.headers["Expires"] = 0
    response.headers["Pragma"] = "no-cache"
    return response


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/2048")
def game2048():
    return render_template("2048Redirect.html")


@app.route("/2048/hard", methods=["GET", "POST"])
def game2048Hard():

    users = db.execute("SELECT username, hard FROM users, game2048 WHERE id = user_id ORDER BY hard DESC LIMIT 10")

    if session.get("user_id") is not None:
        user_id = session["user_id"]

        if request.method == "POST":
            db.execute("UPDATE game2048 SET hard = hard + 1 WHERE user_id = ?", user_id)
            db.execute("INSERT INTO history VALUES (?, '2048', 'hard', ?)", user_id, datetime.now(
                timezone.utc).strftime("%Y-%m-%d %H:%M:%S") + " UTC")

        history = db.execute("SELECT game, difficulty, datetime FROM history WHERE user_id = ? ORDER BY datetime DESC LIMIT 10", user_id)
        return render_template("2048.html", users=users, history=history)

    return render_template("2048.html", users=users)


@app.route("/2048/medium", methods=["GET", "POST"])
def game2048Medium():

    users = db.execute("SELECT username, medium FROM users, game2048 WHERE id = user_id ORDER BY medium DESC LIMIT 10")

    if session.get("user_id") is not None:
        user_id = session["user_id"]

        if request.method == "POST":
            db.execute("UPDATE game2048 SET medium = medium + 1 WHERE user_id = ?", user_id)
            db.execute("INSERT INTO history VALUES (?, '2048', 'medium', ?)", user_id, datetime.now(
                timezone.utc).strftime("%Y-%m-%d %H:%M:%S") + " UTC")

        history = db.execute("SELECT game, difficulty, datetime FROM history WHERE user_id = ? ORDER BY datetime DESC LIMIT 10", user_id)
        return render_template("2048.html", users=users, history=history)

    return render_template("2048.html", users=users)


@app.route("/2048/easy", methods=["GET", "POST"])
def game2048Easy():

    users = db.execute("SELECT username, easy FROM users, game2048 WHERE id = user_id ORDER BY easy DESC LIMIT 10")

    if session.get("user_id") is not None:
        user_id = session["user_id"]

        if request.method == "POST":
            db.execute("UPDATE game2048 SET easy = easy + 1 WHERE user_id = ?", user_id)
            db.execute("INSERT INTO history VALUES (?, '2048', 'easy', ?)", user_id, datetime.now(
                timezone.utc).strftime("%Y-%m-%d %H:%M:%S") + " UTC")

        history = db.execute("SELECT game, difficulty, datetime FROM history WHERE user_id = ? ORDER BY datetime DESC LIMIT 10", user_id)
        return render_template("2048.html", users=users, history=history)

    return render_template("2048.html", users=users)


@app.route("/history")
@login_required
def history():
    """Show history of wins"""
    return render_template("history.html", history=db.execute("SELECT game, difficulty, datetime FROM history WHERE user_id = ? ORDER BY datetime DESC LIMIT 50", session["user_id"]))


@app.route("/login", methods=["GET", "POST"])
def login():
    """Log user in"""

    # Forget any user_id
    session.clear()

    # User reached route via POST (as by submitting a form via POST)
    if request.method == "POST":

        # Ensure username was submitted
        if not request.form.get("username"):
            return apology("must provide username", "/login", 403)

        # Ensure password was submitted
        elif not request.form.get("password"):
            return apology("must provide password", "login", 403)

        # Query database for username
        rows = db.execute("SELECT * FROM users WHERE username = ?", request.form.get("username"))

        # Ensure username exists and password is correct
        if len(rows) != 1 or not check_password_hash(rows[0]["hash"], request.form.get("password")):
            return apology("invalid username and/or password", "login", 403)

        # Remember which user has logged in
        session["user_id"] = rows[0]["id"]

        # Redirect user to home page
        return redirect("/")

    # User reached route via GET (as by clicking a link or via redirect)
    else:
        return render_template("login.html")


@app.route("/register", methods=["GET", "POST"])
def register():
    """Register user"""
    if request.method == "POST":
        username = request.form.get("username")
        rows = db.execute("SELECT * FROM users WHERE username = ?", username)
        if not username:
            return apology("must provide username", "/register")
        elif len(rows) != 0:
            return apology("username already exists", "/register")
        password = request.form.get("password", "/register")
        confirmation = request.form.get("confirmation")
        if not password:
            return apology("must provide password", "/register")
        if not confirmation:
            return apology("please confirm your password", "/register")
        if password != confirmation:
            return apology("passwords do not match", "/register")

        db.execute("INSERT INTO users (username, hash) VALUES (?, ?)", username, generate_password_hash(password))
        db.execute("INSERT INTO game2048 (user_id) VALUES (?)", db.execute("SELECT id FROM users WHERE username = ?", username)[0]["id"])
        return redirect("/login")

    return render_template("register.html")


@app.route("/logout")
def logout():
    """Log user out"""

    # Forget any user_id
    session.clear()

    # Redirect user to login form
    return redirect("/")
