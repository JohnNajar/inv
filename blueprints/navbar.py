# rev 0.02
from flask import Blueprint, render_template, g, current_app
import sqlite3

navbar_bp = Blueprint('navbar', __name__)

def get_db():
    if 'db' not in g:
        g.db = sqlite3.connect(current_app.config['DATABASE'])
    return g.db

@navbar_bp.teardown_request
def close_db(exception):
    db = g.pop('db', None)
    if db is not None:
        db.close()

@navbar_bp.route('/navbar')
def navbar():
    db = get_db()
    cursor = db.cursor()
    cursor.execute('SELECT AUTOID, CATNAME FROM CATEGORY WHERE CATNAME != "General"')
    categories = cursor.fetchall()
    return render_template('navbar.html', categories=categories)
