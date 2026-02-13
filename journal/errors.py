class UsernameTakenError(Exception):
    """Tried to create a user with a taken username"""
    pass


class UsernameOrPasswordIncorrectError(Exception):
    """Tried to log in with an incorrect username"""
    pass
