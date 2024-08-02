# blueprints/add.py
# rev 0.12
from flask import Blueprint, redirect, render_template, request, g, current_app, jsonify, session, url_for
import sqlite3

add_bp = Blueprint('add_bp', __name__)

def get_db():
    if 'db' not in g:
        g.db = sqlite3.connect(current_app.config['DATABASE'])
    return g.db

@add_bp.teardown_request
def close_db(exception):
    db = g.pop('db', None)
    if db is not None:
        db.close()

@add_bp.before_request
def restrict_to_admin():
    if 'role' not in session or session['role'] != 'admin':
        return redirect(url_for('home_bp.home'))

@add_bp.route('/add')
def add():
    db = get_db()
    cursor = db.cursor()
    cursor.execute('SELECT * FROM CATEGORY WHERE CATNAME != "General"')
    categories = cursor.fetchall()
    cursor.execute('SELECT * FROM SUBCATEGORY')
    subcategories = cursor.fetchall()
    cursor.execute('SELECT * FROM INVENTORY')
    items = cursor.fetchall()
    return render_template('add.html', categories=categories, subcategories=subcategories, items=items)

@add_bp.route('/add_category', methods=['POST'])
def add_category():
    category_name = request.form['categoryName']
    db = get_db()
    cursor = db.cursor()
    try:
        cursor.execute('INSERT INTO CATEGORY (CATNAME) VALUES (?)', (category_name,))
        db.commit()
    except sqlite3.Error as e:
        db.rollback()
        print(f"Error adding category: {e}")
    return jsonify({'status': 'success', 'message': 'Category added successfully'})

@add_bp.route('/add_subcategory', methods=['POST'])
def add_subcategory():
    subcategory_name = request.form['subcategoryName']
    category_id = request.form['categoryId']
    db = get_db()
    cursor = db.cursor()
    try:
        cursor.execute('INSERT INTO SUBCATEGORY (SUBCATNAME, CATEGORYID) VALUES (?, ?)', (subcategory_name, category_id))
        db.commit()
    except sqlite3.Error as e:
        db.rollback()
        print(f"Error adding subcategory: {e}")
    return jsonify({'status': 'success', 'message': 'Subcategory added successfully'})

@add_bp.route('/add_item', methods=['POST'])
def add_item():
    item_name = request.form['itemName']
    amount = request.form['amount']
    category_id = request.form['categoryId']
    subcategory_id = request.form['subcategoryId']
    db = get_db()
    cursor = db.cursor()
    try:
        cursor.execute('INSERT INTO INVENTORY (NAME, AMOUNT, CATEGORY, SUBCATEGORY) VALUES (?, ?, ?, ?)', 
                       (item_name, amount, category_id, subcategory_id))
        db.commit()
    except sqlite3.Error as e:
        db.rollback()
        print(f"Error adding item: {e}")
    return jsonify({'status': 'success', 'message': 'Item added successfully'})

@add_bp.route('/add_multiple_items_by_names', methods=['POST'])
def add_multiple_items_by_names():
    item_names = request.form['itemNames']
    amount = request.form['amount']
    category_id = request.form['categoryId']
    subcategory_id = request.form['subcategoryId']
    item_names_list = [name.strip() for name in item_names.split(',')]
    db = get_db()
    cursor = db.cursor()
    try:
        for item_name in item_names_list:
            cursor.execute('INSERT INTO INVENTORY (NAME, AMOUNT, CATEGORY, SUBCATEGORY) VALUES (?, ?, ?, ?)', 
                           (item_name, amount, category_id, subcategory_id))
        db.commit()
    except sqlite3.Error as e:
        db.rollback()
        print(f"Error adding multiple items: {e}")
    return jsonify({'status': 'success', 'message': 'Items added successfully'})

@add_bp.route('/modify_item', methods=['POST'])
def modify_item():
    item_id = request.form['itemId']
    new_name = request.form.get('itemName', '').strip()
    new_amount = request.form.get('amount', '').strip()
    new_category_id = request.form.get('newCategoryId', '').strip()
    new_subcategory_id = request.form.get('newSubcategoryId', '').strip()
    db = get_db()
    cursor = db.cursor()
    
    try:
        if new_name:
            cursor.execute('UPDATE INVENTORY SET NAME = ? WHERE ID = ?', (new_name, item_id))
        if new_amount:
            cursor.execute('UPDATE INVENTORY SET AMOUNT = ? WHERE ID = ?', (new_amount, item_id))
        if new_category_id:
            cursor.execute('UPDATE INVENTORY SET CATEGORY = ? WHERE ID = ?', (new_category_id, item_id))
        if new_subcategory_id:
            cursor.execute('UPDATE INVENTORY SET SUBCATEGORY = ? WHERE ID = ?', (new_subcategory_id, item_id))
        db.commit()
    except sqlite3.Error as e:
        db.rollback()
        print(f"Error modifying item: {e}")
    return jsonify({'status': 'success', 'message': 'Item modified successfully'})

@add_bp.route('/get_subcategories/<int:category_id>')
def get_subcategories(category_id):
    db = get_db()
    cursor = db.cursor()
    cursor.execute('SELECT AUTOID, SUBCATNAME FROM SUBCATEGORY WHERE CATEGORYID = ?', (category_id,))
    subcategories = cursor.fetchall()
    return jsonify(subcategories)

@add_bp.route('/get_items/<int:subcategory_id>')
def get_items(subcategory_id):
    db = get_db()
    cursor = db.cursor()
    cursor.execute('SELECT ID, NAME FROM INVENTORY WHERE SUBCATEGORY = ?', (subcategory_id,))
    items = cursor.fetchall()
    return jsonify(items)
