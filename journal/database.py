import secrets
import sqlite3
from typing import Union

from argon2 import PasswordHasher

from . import errors
from . import auth

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
    ph = PasswordHasher()
    conn, cursor = connect()
    hsh = ph.hash(password)
    try:
        cursor.execute("INSERT INTO user (username, hash) VALUES (?,?);", (username, hsh))
        conn.commit()
    except sqlite3.IntegrityError:
        raise errors.UsernameTakenError
    finally:
        conn.close()


def check_login(username: str, password: str):
    ph = PasswordHasher()
    conn, cursor = connect()
    cursor.execute("SELECT * FROM user WHERE username=? LIMIT 1;", (username,))
    row = cursor.fetchone()
    conn.close()
    if row is None:
        raise errors.UsernameOrPasswordIncorrectError
    elif row[1] != username or not auth.check_login(password, row[2]):
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


def verify_api_key(api_key: str) -> Union[bool, str]:
    conn, cursor = connect()
    cursor.execute("SELECT * FROM api_keys WHERE keytext=? LIMIT 1;", (api_key,))
    row = cursor.fetchone()
    conn.close()
    if row is None:
        return False
    else:
        return row[1]
