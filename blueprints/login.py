# blueprints/login.py
# rev 0.01
from flask import Blueprint, render_template, request, redirect, url_for, session, g, current_app
import sqlite3
import hashlib

login_bp = Blueprint('login', __name__)

def get_db():
    if 'db' not in g:
        g.db = sqlite3.connect(current_app.config['DATABASE'])
    return g.db

@login_bp.teardown_request
def close_db(exception):
    db = g.pop('db', None)
    if db is not None:
        db.close()

@login_bp.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = hashlib.sha256(request.form['password'].encode()).hexdigest()

        db = get_db()
        cursor = db.cursor()
        cursor.execute('SELECT * FROM USERS WHERE Username = ? AND Password = ?', (username, password))
        user = cursor.fetchone()

        if user:
            session['user_id'] = user[0]
            return redirect(url_for('home.home'))
        else:
            return render_template('login.html', error="Invalid username or password")

    return render_template('login.html')

@login_bp.route('/logout')
def logout():
    session.pop('user_id', None)
    return redirect(url_for('login.login'))
