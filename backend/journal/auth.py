from argon2 import PasswordHasher
from argon2.exceptions import VerifyMismatchError


def check_login(password: str, hsh: str):
    ph = PasswordHasher()
    try:
        ph.verify(hsh, password)
        return True
    except VerifyMismatchError:
        return False
