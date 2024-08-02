# blueprints/users.py
# rev 0.03
from flask import Blueprint, render_template, g, current_app, request, jsonify, redirect, url_for
import sqlite3

users_bp = Blueprint('users', __name__)

def get_db():
    if 'db' not in g:
        g.db = sqlite3.connect(current_app.config['DATABASE'])
    return g.db

@users_bp.teardown_request
def close_db(exception):
    db = g.pop('db', None)
    if db is not None:
        db.close()

@users_bp.route('/users')
def users():
    db = get_db()
    cursor = db.cursor()
    cursor.execute('SELECT * FROM USERS')
    users = cursor.fetchall()
    return render_template('users.html', users=users)

@users_bp.route('/get_user/<int:user_id>')
def get_user(user_id):
    db = get_db()
    cursor = db.cursor()
    cursor.execute('SELECT * FROM USERS WHERE ID = ?', (user_id,))
    user = cursor.fetchone()
    return jsonify({
        'id': user[0],
        'username': user[1],
        'password': user[2],
        'role': user[3]
    })

@users_bp.route('/modify_user', methods=['POST'])
def modify_user():
    user_id = request.form['user_id']
    username = request.form['username']
    password = request.form['password']
    role = request.form['role']
    db = get_db()
    cursor = db.cursor()
    cursor.execute('UPDATE USERS SET Username = ?, Password = ?, Role = ? WHERE ID = ?', (username, password, role, user_id))
    db.commit()
    return redirect(url_for('users.users'))

@users_bp.route('/add_user', methods=['POST'])
def add_user():
    username = request.form['username']
    password = request.form['password']
    role = request.form['role']
    db = get_db()
    cursor = db.cursor()
    cursor.execute('INSERT INTO USERS (Username, Password, Role) VALUES (?, ?, ?)', (username, password, role))
    db.commit()
    return redirect(url_for('users.users'))

@users_bp.route('/delete_user', methods=['POST'])
def delete_user():
    user_id = request.form['user_id']
    db = get_db()
    cursor = db.cursor()
    cursor.execute('DELETE FROM USERS WHERE ID = ?', (user_id,))
    db.commit()
    return redirect(url_for('users.users'))
