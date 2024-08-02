# rev 0.35
from flask import Blueprint, render_template, request, send_file, g, current_app
import sqlite3
from io import BytesIO
from reportlab.lib.pagesizes import landscape
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch

pdf_bp = Blueprint('pdf', __name__)

def get_db():
    if 'db' not in g:
        g.db = sqlite3.connect(current_app.config['DATABASE'])
    return g.db

@pdf_bp.teardown_request
def close_db(exception):
    db = g.pop('db', None)
    if db is not None:
        db.close()

@pdf_bp.route('/select_category')
def select_category():
    db = get_db()
    cursor = db.cursor()
    cursor.execute('SELECT * FROM CATEGORY WHERE CATNAME != "General"')
    categories = cursor.fetchall()
    return render_template('select_category.html', categories=categories)

@pdf_bp.route('/generate_pdf', methods=['POST'])
def generate_pdf():
    category_id = request.form['category_id']
    db = get_db()
    cursor = db.cursor()
    
    # Fetch the selected category and its subcategories
    cursor.execute('SELECT CATNAME FROM CATEGORY WHERE AUTOID = ?', (category_id,))
    category = cursor.fetchone()
    cursor.execute('SELECT * FROM SUBCATEGORY WHERE CATEGORYID = ?', (category_id,))
    subcategories = cursor.fetchall()
    
    # Fetch inventory items for the selected category
    cursor.execute('''
    SELECT INVENTORY.NAME, INVENTORY.AMOUNT, SUBCATEGORY.SUBCATNAME
    FROM INVENTORY 
    JOIN SUBCATEGORY ON INVENTORY.SUBCATEGORY = SUBCATEGORY.AUTOID 
    WHERE SUBCATEGORY.CATEGORYID = ?
    ORDER BY SUBCATEGORY.SUBCATNAME, INVENTORY.NAME
    ''', (category_id,))
    items = cursor.fetchall()
    
    buffer = BytesIO()
    styles = getSampleStyleSheet()
    title_style = styles['Heading1']
    table_data_style = styles['BodyText']
    subheader_style = ParagraphStyle('subheader', parent=table_data_style, fontName='Helvetica-Bold')

    # Center the title
    title_style.alignment = 1  # Center alignment

    # Group items by subcategory
    data = {}
    for subcategory in subcategories:
        data[subcategory[1]] = []

    for item in items:
        item_name, amount, subcat_name = item
        data[subcat_name].append((item_name, amount))

    elements = []

    # Create a title for the document
    elements.append(Paragraph(f"{category[0]} Inventory", title_style))
    elements.append(Spacer(1, 12))  # Add space after title

    # Prepare table data
    table_data = []
    max_rows_per_column = 70  # Max rows before wrapping to next column

    # Create table header row
    header_row = []
    for subcat_name in data.keys():
        header_row.extend([Paragraph(subcat_name, subheader_style), ''])
        subcat_length = len(data[subcat_name])
        while subcat_length > max_rows_per_column:
            header_row.extend([Paragraph(f"{subcat_name} (continued)", subheader_style), ''])
            subcat_length -= max_rows_per_column
    table_data.append(header_row)

    # Create item rows
    for i in range(max_rows_per_column):
        row = []
        for subcat_name in data.keys():
            if i < len(data[subcat_name]):
                item_name, amount = data[subcat_name][i]
                row.extend([Paragraph(item_name, table_data_style), Paragraph(str(amount), table_data_style)])
                if len(data[subcat_name]) > max_rows_per_column:
                    for k in range(1, (len(data[subcat_name]) // max_rows_per_column) + 1):
                        idx = i + k * max_rows_per_column
                        if idx < len(data[subcat_name]):
                            item_name, amount = data[subcat_name][idx]
                            row.extend([Paragraph(item_name, table_data_style), Paragraph(str(amount), table_data_style)])
                        else:
                            row.extend(['', ''])
            else:
                row.extend(['', ''])
                if len(data[subcat_name]) > max_rows_per_column:
                    for _ in range(1, (len(data[subcat_name]) // max_rows_per_column) + 1):
                        row.extend(['', ''])
        table_data.append(row)

    col_widths = [1.5 * inch, 0.75 * inch] * (len(header_row) // 2)
    table = Table(table_data, colWidths=col_widths)
    table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.grey),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, 0), 12),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 8),  # Adjust padding to make cells smaller
        ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
        ('GRID', (0, 0), (-1, -1), 1, colors.black),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.whitesmoke, colors.lightgrey]),
        ('FONTSIZE', (0, 1), (-1, -1), 10)
    ]))

    elements.append(table)

    # Calculate the required page size
    table_width = sum(col_widths)
    table_height = len(table_data) * 0.27 * inch  # Adjusted to 0.27 inch per row

    # Create document with calculated size
    doc = SimpleDocTemplate(buffer, pagesize=(table_width + 20, table_height + 20), leftMargin=10, rightMargin=10, topMargin=10, bottomMargin=10)
    doc.build(elements)
    buffer.seek(0)

    return send_file(buffer, as_attachment=True, download_name=f'{category[0]}_inventory.pdf', mimetype='application/pdf')
