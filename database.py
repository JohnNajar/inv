# database.py
# rev 0.02
import sqlite3
import config

def connect_db():
    try:
        return sqlite3.connect(config.Config.DATABASE)
    except sqlite3.Error as e:
        print(f"Database connection failed: {e}")
        return None

def init_db():
    db = connect_db()
    if db is not None:
        try:
            with open('schema.sql', mode='r') as f:
                db.cursor().executescript(f.read())
            db.commit()
        except Exception as e:
            print(f"Database initialization failed: {e}")
        finally:
            db.close()
