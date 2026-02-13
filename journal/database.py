import sqlite3
from . import errors
import secrets

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


def add_user(username: str, password: str):
    conn, cursor = connect()
    try:
        cursor.execute("INSERT INTO user (username, password) VALUES (?,?);", (username, password))
        conn.commit()
    except sqlite3.IntegrityError:
        raise errors.UsernameTakenError
    finally:
        conn.close()


def check_login(username: str, password: str):
    conn, cursor = connect()
    cursor.execute("SELECT * FROM user WHERE username=? LIMIT 1;", (username,))
    row = cursor.fetchone()
    conn.close()
    if row is None:
        raise errors.UsernameOrPasswordIncorrectError
    elif row[1] != username or row[2] != password:
        raise errors.UsernameOrPasswordIncorrectError
    else:
        return create_api_key(username)


def create_api_key(username: str):
    key = secrets.token_urlsafe(32)
    conn, cursor = connect()
    cursor.execute(
        "INSERT INTO api_keys (username, keytext) VALUES (?,?);",
        (username, key))
    conn.commit()
    conn.close()
    return key
