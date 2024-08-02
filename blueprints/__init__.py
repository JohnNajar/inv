# blueprints/__init__.py
# rev 1.3
from flask import Blueprint

# Initialize the blueprint for each module
from .add import add_bp
from .home import home_bp
from .pdf import pdf_bp
from .department import department_bp
from .login import login_bp
from .users import users_bp

def register_blueprints(app):
    app.register_blueprint(add_bp)
    app.register_blueprint(home_bp)
    app.register_blueprint(pdf_bp)
    app.register_blueprint(department_bp)
    app.register_blueprint(login_bp)
    app.register_blueprint(users_bp)
