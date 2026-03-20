import logging
import os
import secrets
import sqlite3
from datetime import timezone
from pathlib import Path
from typing import Union, Optional
from uuid import UUID

from argon2 import PasswordHasher
from fastapi import HTTPException, UploadFile
from sqlalchemy import Sequence
from sqlmodel import Session, select

from . import auth
from . import errors
from .models import *

logger = logging.getLogger(__name__)

database_file = "instance/data.db"
sql_file = "journal/schema.sql"


def ensure_utc(dt: datetime.datetime):
    if dt.tzinfo is None:
        return dt.replace(tzinfo=timezone.utc)
    return dt


def connect(dbpath: str = database_file):
    conn = sqlite3.connect(dbpath)
    cursor = conn.cursor()
    return conn, cursor


def init_db(path: str = sql_file):
    conn = None
    try:
        conn, cursor = connect()
        with open(path, "r") as f:
            sql_script = f.read()
        cursor.executescript(sql_script)
        conn.commit()
    except sqlite3.Error as e:
        print("an error occurred", e)
    finally:
        if conn:
            conn.close()


def add_user(username: str, password: str, session: Session):
    ph = PasswordHasher()
    hsh = ph.hash(password)
    current: Optional[User] = session.exec(
        select(User).where(User.username == username)
    ).first()
    if current is None:
        user = User(username=username, hash=hsh)
        session.add(user)
        session.commit()
    else:
        raise errors.UsernameTakenError


def check_login(username: str, password: str, session: Session) -> str:
    row: Optional[User] = session.exec(
        select(User).where(User.username == username)
    ).first()
    if row is None or not auth.check_login(password, row.hash):
        raise errors.UsernameOrPasswordIncorrectError
    else:
        return create_api_key(username, session)


def create_api_key(username: str, session: Session) -> str:
    key = secrets.token_urlsafe(32)
    api_key = ApiKey(username=username, key=key)
    session.add(api_key)
    session.commit()
    return key


def verify_api_key(api_key: str, session: Session) -> Union[bool, str]:
    row: Optional[ApiKey] = session.exec(
        select(ApiKey).where(ApiKey.key == api_key)
    ).first()
    if row is None:
        return False
    return row.username


def create_entry(entry: EntryPublic, user: str, session: Session) -> EntryPublic:
    created = entry.created.astimezone(timezone.utc)
    last_edited = entry.last_edited.astimezone(timezone.utc)
    db_entry = Entry(
        **entry.model_dump(exclude={"created", "last_edited"}),
        author_username=user,
        last_edited=last_edited,
        created=created
    )
    session.add(db_entry)
    session.commit()
    session.refresh(db_entry)
    return get_entry(user, db_entry.id, session)


def get_entry(username: str, entry_id: uuid.UUID, session: Session) -> EntryPublic:
    entry: Optional[Entry] = session.exec(
        select(Entry).where(Entry.id == entry_id and Entry.author_username == username)
    ).first()
    if entry is None:
        raise HTTPException(status_code=404, detail="entry not found")
    entry.created = ensure_utc(entry.created)
    entry.last_edited = ensure_utc(entry.last_edited)

    images = session.exec(
        select(Image).where(Image.entry_id == entry.id)
    ).all()
    image_ids: list[str] = []
    for image in images:
        image_ids.append(image.path)

    return EntryPublic(**entry.model_dump(), image_ids=image_ids)


def delete_entry(username: str, entry_id: int, session: Session):
    entry: Optional[Entry] = session.exec(
        select(Entry).where(Entry.id == entry_id and Entry.author_username == username)
    ).first()
    if entry is not None:
        session.delete(entry)
        session.commit()


def get_entries(username: str, session: Session) -> list[EntryPublic]:
    entries_db = session.exec(
        select(Entry).where(Entry.author_username == username)
    ).all()
    entries = []

    for entry in entries_db:
        images: Sequence[Image] = session.exec(
            select(Image).where(Image.entry_id == entry.id)
        ).all()
        entries.append(EntryPublic(**entry.model_dump(), image_ids=[i.path for i in images]))
    return entries


def put_entry(username: str, entry: EntryPublic, session: Session) -> EntryPublic:
    current_entry: Optional[Entry] = session.exec(
        select(Entry).where(Entry.id == entry.id).where(Entry.author_username == username)
    ).first()
    if current_entry is None:
        raise HTTPException(status_code=404, detail="entry not found")
    current_entry.sqlmodel_update(entry.model_dump())
    image_ids = set(entry.image_ids)
    for iid in session.exec(select(Image).where(Image.entry_id == entry.id)).all():
        image_ids.add(iid.path)
    session.commit()
    session.refresh(current_entry)
    return EntryPublic(**current_entry.model_dump(), image_ids=image_ids)


def create_image(image_file: UploadFile, entry: EntryPublic, username: str, image_id: UUID,
                 session: Session) -> EntryPublic:
    e: Optional[Entry] = (session.exec(select(Entry)
                                       .where(Entry.id == entry.id)
                                       .where(Entry.author_username == username))
                          .first())
    if e is None:
        raise HTTPException(status_code=404, detail=f"entry with id {entry.id} could not be found")
    os.makedirs("instance/images", exist_ok=True)
    contents = image_file.file.read()
    with open(f"instance/images/{image_id}", 'wb') as f:
        f.write(contents)
    image_file.file.close()

    e.body = entry.body
    e.last_edited = entry.last_edited
    e.created = entry.created
    image_db = Image(path=image_id, entry_id=e.id)
    session.add(e)
    session.add(image_db)
    session.commit()
    session.refresh(e)

    return get_entry(username, e.id, session)


def get_image(image_id: uuid.UUID, username: str, session: Session) -> Path:
    image_not_found_exception = HTTPException(status_code=404, detail=f"image with id {image_id} could not be found")
    image_path = Path(f"instance/images/{image_id}")

    image: Optional[Image] = session.exec(select(Image).where(Image.path == image_id)).first()
    if image is None:
        raise image_not_found_exception

    entry: Entry = session.exec(select(Entry).where(Entry.id == image.entry_id)).one()
    if entry.author_username == username:
        if image_path.exists():
            return image_path
        else:
            session.delete(image)
    raise image_not_found_exception


def delete_image(image_id: UUID, username: str, session: Session):
    image_not_found_exception = HTTPException(status_code=404, detail=f"image with id {image_id} could not be found")
    image_path = Path(f"instance/images/{image_id}")

    image: Optional[Image] = session.exec(select(Image).where(Image.path == image_id)).first()
    if image is None:
        raise image_not_found_exception

    entry = session.exec(select(Entry).where(Entry.id == image.entry_id)).one()
    if entry.author_username == username:
        entry_id = entry.id
        session.delete(image)
        session.commit()
        if image_path.exists():
            try:
                os.remove(image_path)
            except FileNotFoundError:
                pass
        return get_entry(username, entry_id, session)
    raise image_not_found_exception
