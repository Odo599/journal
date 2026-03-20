import uuid
from typing import Optional, Annotated
from uuid import UUID

from fastapi import FastAPI, HTTPException, Depends, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.params import Form
from fastapi.responses import FileResponse
from fastapi.security import APIKeyHeader
from pydantic import ValidationError
from sqlmodel import create_engine, Session

from . import database
from . import errors
from . import models
from .models import *

app = FastAPI()

API_KEY_NAME = "X-API-Key"
api_key_header = APIKeyHeader(name=API_KEY_NAME, auto_error=True)

ALLOWED_IMAGE_TYPES = {"image/jpeg","image/jpg"}

origins = [
    "http://127.0.0.1:8081",
    "http://localhost:8081",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

sqlite_file_name = "instance/data.db"
sqlite_url = f"sqlite:///{sqlite_file_name}"

connect_args = {"check_same_thread": False}
engine = create_engine(sqlite_url, connect_args=connect_args)

SQLModel.metadata.create_all(engine)

def get_session():
    with Session(engine) as session:
        yield session

SessionDep = Annotated[Session, Depends(get_session)]

@app.on_event("startup")
def on_startup():
    SQLModel.metadata.create_all(engine)

@app.post("/createUser", status_code=201)
def create_user(username: str, password: str, session: SessionDep) -> str:
    try:
        database.add_user(username, password, session)
        return database.create_api_key(username, session)
    except errors.UsernameTakenError:
        raise HTTPException(status_code=409, detail="user already created")


@app.get("/getUserApiKey", status_code=200)
def get_api_key(username: Optional[str], password: Optional[str], session: SessionDep):
    try:
        response = database.check_login(username, password, session)
        return response
    except errors.UsernameOrPasswordIncorrectError:
        raise HTTPException(status_code=401, detail="incorrect username or password")


@app.get("/verifyApiKey", status_code=200)
def verify_api_key(session: SessionDep, api_key_user: str = Depends(api_key_header)):
    api_key_user = database.verify_api_key(api_key_user, session)
    if api_key_user:
        return api_key_user
    else:
        raise HTTPException(
            status_code=401,
            detail="api key invalid"
        )


@app.post("/createEntry", status_code=201)
def create_entry(entry: EntryPublic, session: SessionDep, api_key: str = Depends(api_key_header)) -> EntryPublic:
    user = database.verify_api_key(api_key, session)
    if not user:
        raise HTTPException(status_code=403, detail="api key invalid")
    return database.create_entry(entry, user, session)


@app.get("/entries/{entry_id}", status_code=200)
def get_entry(entry_id: uuid.UUID, session: SessionDep, api_key: str = Depends(api_key_header)):
    user = database.verify_api_key(api_key, session)
    if not user:
        raise HTTPException(status_code=403, detail="api key invalid")
    return database.get_entry(user, entry_id, session)


@app.put("/entry")
def put_entry(session: SessionDep, entry: EntryPublic, api_key: str = Depends(api_key_header)):
    user = database.verify_api_key(api_key, session)
    if not user:
        raise HTTPException(status_code=403, detail="api key invalid")
    return database.put_entry(user, entry, session)


@app.get("/getEntries", status_code=200)
def get_entries(session: SessionDep, api_key: str = Depends(api_key_header)):
    user = database.verify_api_key(api_key, session)
    if not user:
        raise HTTPException(status_code=403, detail="api key invalid")
    return database.get_entries(user, session)


@app.delete("/entries/{entry_id}", status_code=204)
def delete_entry(entry_id: uuid.UUID, session: SessionDep, api_key: str = Depends(api_key_header)):
    user = database.verify_api_key(api_key, session)
    if not user:
        raise HTTPException(status_code=403, detail="api key invalid")
    database.delete_entry(user, entry_id, session)


@app.get("/health", status_code=200)
def health_check():
    return {"status": "healthy"}


@app.post("/uploadImage")
def uploadImage(
        session: SessionDep,
        image: UploadFile = File(...),
        entry: str = Form(...),
        image_id: uuid.UUID = Form(...),
        api_key: str = Depends(api_key_header)
) -> EntryPublic:
    user = database.verify_api_key(api_key, session)
    if not user:
        raise HTTPException(status_code=403, detail="api key invalid")
    if image.content_type not in ALLOWED_IMAGE_TYPES:
        raise HTTPException(
            status_code=400,
            detail="Invalid image type. Only JPEG, PNG, GIF, and WebP are allowed, you provided " + image.content_type
        )
    try:
        entry_obj = EntryPublic.model_validate_json(entry)
    except ValidationError as e:
        raise HTTPException(status_code=400, detail=str(e))
    return database.create_image(image, entry_obj, user,image_id, session)


@app.get("/images/{image_id}", response_class=FileResponse)
def getImage(session: SessionDep, image_id: uuid.UUID, api_key: str = Depends(api_key_header)):
    user = database.verify_api_key(api_key, session)
    if not user:
        raise HTTPException(status_code=403, detail="api key invalid")

    image_path = database.get_image(image_id, user, session)
    return FileResponse(image_path, headers={"content-type": "image/jpeg"})


@app.delete("/images/{image_id}", status_code=204)
def delete_image(session:SessionDep, image_id: UUID, api_key: str = Depends(api_key_header)):
    user = database.verify_api_key(api_key, session)
    if not user:
        raise HTTPException(status_code=403, detail="api key invalid")
    database.delete_image(image_id, user, session)
