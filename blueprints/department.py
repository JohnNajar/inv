# blueprints/department.py
# rev 0.07
from flask import Blueprint, render_template, g, current_app, request
import sqlite3

department_bp = Blueprint('department', __name__)

def get_db():
    if 'db' not in g:
        g.db = sqlite3.connect(current_app.config['DATABASE'])
    return g.db

@department_bp.teardown_request
def close_db(exception):
    db = g.pop('db', None)
    if db is not None:
        db.close()

@department_bp.route('/update_amount/<int:item_id>', methods=['POST'])
def update_amount(item_id):
    new_amount = request.form['amount']
    db = get_db()
    cursor = db.cursor()
    try:
        cursor.execute('UPDATE INVENTORY SET AMOUNT = ? WHERE ID = ?', (new_amount, item_id))
        db.commit()
    except sqlite3.Error as e:
        db.rollback()
        print(f"Error updating amount: {e}")
        return "An error occurred", 500
    return 'Amount updated successfully', 200

@department_bp.route('/department/<int:category_id>')
def department_id(category_id):
    db = get_db()
    cursor = db.cursor()
    try:
        cursor.execute('SELECT CATNAME FROM CATEGORY WHERE AUTOID = ?', (category_id,))
        category_name = cursor.fetchone()[0]
        cursor.execute('''
        SELECT INVENTORY.NAME, INVENTORY.AMOUNT, SUBCATEGORY.SUBCATNAME, INVENTORY.ID
        FROM INVENTORY 
        JOIN SUBCATEGORY ON INVENTORY.SUBCATEGORY = SUBCATEGORY.AUTOID 
        WHERE SUBCATEGORY.CATEGORYID = ?
        ORDER BY SUBCATEGORY.SUBCATNAME, INVENTORY.NAME
        ''', (category_id,))
        items = cursor.fetchall()
    except sqlite3.Error as e:
        print(f"Database query failed: {e}")
        return "An error occurred", 500

    return render_template('department.html', category_name=category_name, items=items)

@department_bp.route('/clear_amounts/<category_name>', methods=['POST'])
def clear_amounts(category_name):
    db = get_db()
    cursor = db.cursor()
    try:
        cursor.execute('''
        UPDATE INVENTORY 
        SET AMOUNT = 0 
        WHERE ID IN (
            SELECT INVENTORY.ID 
            FROM INVENTORY 
            JOIN SUBCATEGORY ON INVENTORY.SUBCATEGORY = SUBCATEGORY.AUTOID 
            JOIN CATEGORY ON SUBCATEGORY.CATEGORYID = CATEGORY.AUTOID
            WHERE CATEGORY.CATNAME = ?
        )
        ''', (category_name,))
        db.commit()
    except sqlite3.Error as e:
        db.rollback()
        print(f"Error clearing amounts: {e}")
        return "An error occurred", 500
    return 'All amounts cleared successfully', 200
