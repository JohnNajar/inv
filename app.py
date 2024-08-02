# app.py
# rev 2.0
from flask import Flask, g, request, redirect, url_for, render_template, session
import sqlite3
from datetime import timedelta, datetime
from blueprints import register_blueprints

app = Flask(__name__)
app.config['DATABASE'] = 'invDatabase.db'
app.config['SECRET_KEY'] = 'your_secret_key'  # Replace with a secure secret key
app.config['PERMANENT_SESSION_LIFETIME'] = timedelta(hours=2)

def get_db():
    if 'db' not in g:
        g.db = sqlite3.connect(app.config['DATABASE'])
    return g.db

@app.teardown_appcontext
def close_db(exception):
    db = g.pop('db', None)
    if db is not None:
        db.close()

def get_navbar_categories():
    db = get_db()
    cursor = db.cursor()
    cursor.execute('SELECT AUTOID, CATNAME FROM CATEGORY WHERE CATNAME != "General"')
    return cursor.fetchall()

app.jinja_env.globals.update(get_navbar_categories=get_navbar_categories)

def require_login():
    if 'user_id' not in session and request.endpoint not in ['login', 'static', 'logout']:
        return redirect(url_for('login.login'))
    if 'user_id' in session:
        session.permanent = True
        session.modified = True

def check_admin():
    if 'role' not in session or session['role'] != 'admin':
        return redirect(url_for('home_bp.home'))

app.before_request(require_login)

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        
        db = get_db()
        cursor = db.cursor()
        cursor.execute('SELECT ID, Password, Role FROM USERS WHERE Username = ?', (username,))
        user = cursor.fetchone()
        
        if user and user[1] == password:  # Replace with a secure password check
            session['user_id'] = user[0]
            session['role'] = user[2]
            session.permanent = True
            session['last_login'] = datetime.now()
            return redirect(url_for('home_bp.home'))
        else:
            return render_template('login.html', error="Invalid username or password")
    return render_template('login.html')

@app.route('/logout')
def logout():
    session.pop('user_id', None)
    session.pop('role', None)
    session.pop('last_login', None)
    return redirect(url_for('login.login'))

register_blueprints(app)

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')
