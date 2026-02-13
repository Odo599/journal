import sqlite3

database_file = "instance/data.db"
sql_file = "journal/schema.sql"


def connect():
    conn = sqlite3.connect(database_file)
    cursor = conn.cursor()

    return conn, cursor


def init_db():
    conn = None
    try:
        conn, cursor = connect()
        with open(sql_file, "r") as f:
            sql_script = f.read()
        cursor.executescript(sql_script)
        conn.commit()
    except sqlite3.Error as e:
        print("an error occurred", e)
    finally:
        if conn:
            conn.close()


class UsernameTakenError(Exception):
    pass


def add_user(uname, pwd):
    conn, cursor = connect()
    try:
        cursor.execute("INSERT INTO user (username, password) VALUES (?,?);", (uname, pwd))
        conn.commit()
    except sqlite3.IntegrityError:
        raise UsernameTakenError
    finally:
        conn.close()
