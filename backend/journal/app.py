from typing import Optional

from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import APIKeyHeader

from . import database
from . import errors
from .types import CreateEntry, PutEntry

app = FastAPI()

API_KEY_NAME = "X-API-Key"
api_key_header = APIKeyHeader(name=API_KEY_NAME, auto_error=True)

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


@app.post("/createUser", status_code=201)
def read_item(username: Optional[str], password: Optional[str] = None):
    try:
        database.add_user(username, password)
        return database.create_api_key(username)
    except errors.UsernameTakenError:
        raise HTTPException(status_code=409, detail="user already created")


@app.get("/getUserApiKey", status_code=200)
def get_api_key(username: Optional[str], password: Optional[str]):
    try:
        response = database.check_login(username, password)
        return response
    except errors.UsernameOrPasswordIncorrectError:
        raise HTTPException(status_code=401, detail="incorrect username or password")


@app.get("/verifyApiKey", status_code=200)
def verify_api_key(api_key: str = Depends(api_key_header)):
    if database.verify_api_key(api_key):
        return api_key
    else:
        raise HTTPException(
            status_code=401,
            detail="api key invalid"
        )


@app.post("/createEntry", status_code=201)
def create_entry(entry: CreateEntry, api_key: str = Depends(api_key_header)):
    user = database.verify_api_key(api_key)
    if not user:
        raise HTTPException(status_code=403, detail="api key invalid")
    return database.create_entry(user, entry.text, entry.created)


@app.get("/entries/{entry_id}", status_code=200)
def get_entry(entry_id: int, api_key: str = Depends(api_key_header)):
    user = database.verify_api_key(api_key)
    if not user:
        raise HTTPException(status_code=403, detail="api key invalid")
    return database.get_entry(user, entry_id)


@app.put("/entries/{entry_id}")
def put_entry(entry_id: int, entry: PutEntry, api_key: str = Depends(api_key_header)):
    user = database.verify_api_key(api_key)
    if not user:
        raise HTTPException(status_code=403, detail="api key invalid")
    return database.put_entry(user, entry)


@app.get("/getEntries", status_code=200)
def get_entries(api_key: str = Depends(api_key_header)):
    user = database.verify_api_key(api_key)
    if not user:
        raise HTTPException(status_code=403, detail="api key invalid")
    return database.get_entries(user)


@app.delete("/entries/{entry_id}", status_code=204)
def delete_entry(entry_id: int, api_key: str = Depends(api_key_header)):
    user = database.verify_api_key(api_key)
    if not user:
        raise HTTPException(status_code=403, detail="api key invalid")
    database.delete_entry(user, entry_id)


@app.get("/health", status_code=200)
def health_check():
    return {"status": "healthy"}
