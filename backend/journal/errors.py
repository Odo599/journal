class UsernameTakenError(Exception):
    """Tried to create a user with a taken username"""
    pass


class UsernameOrPasswordIncorrectError(Exception):
    """Tried to log in with an incorrect username"""
    pass


class UsernameNotFoundError(Exception):
    """Tried to find a username, but it was not found in the db."""
    pass


class EntryNotFoundError(Exception):
    """Tried to find an entry, but it was not in the db."""
    pass
