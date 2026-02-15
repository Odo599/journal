from typing import Optional

from fastapi import FastAPI, HTTPException
from . import database
from . import errors

app = FastAPI()


@app.post("/createUser", status_code=201)
def read_item(username: Optional[str], password: Optional[str] = None):
    try:
        database.add_user(username, password)
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
def verify_api_key(api_key: str):
    return database.verify_api_key(api_key)


@app.post("/createEntry", status_code=201)
def create_entry(api_key: str, text: str):
    user = database.verify_api_key(api_key)
    if not user:
        raise HTTPException(status_code=403, detail="api key invalid")
    database.create_entry(user, text)


@app.get("/entries/{entry_id}", status_code=200)
def get_entry(api_key: str, entry_id: int):
    user = database.verify_api_key(api_key)
    if not user:
        raise HTTPException(status_code=403, detail="api key invalid")
    return database.get_entry(user, entry_id)
