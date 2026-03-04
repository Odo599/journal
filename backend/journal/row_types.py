from typing import TypedDict


class EntryRow(TypedDict):
    id: int
    author_username: str
    created: str
    body: str
    last_edited: str
