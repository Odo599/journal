from typing import TypedDict


class EntryRow(TypedDict):
    id: int
    author_id: int
    created: str
    body: str
