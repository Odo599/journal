import datetime
import uuid

from sqlmodel import SQLModel, Field
from sqlalchemy import Column, DateTime

class User(SQLModel, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    username: str
    hash: str

class EntryBase(SQLModel):
    created: datetime.datetime = Field(sa_column=Column(DateTime(timezone=True)))
    last_edited: datetime.datetime = Field(sa_column=Column(DateTime(timezone=True)))
    body: str
    id: uuid.UUID

class Entry(EntryBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    author_username: str = Field(foreign_key="user.username")

class EntryPublic(EntryBase):
    image_ids: list[uuid.UUID]

class Image(SQLModel, table=True):
    path: uuid.UUID = Field(primary_key=True)
    entry_id: uuid.UUID = Field(foreign_key="entry.id")

class ApiKey(SQLModel, table=True):
    id: int = Field(default=None, primary_key=True)
    username: str = Field(foreign_key="user.username")
    key: str