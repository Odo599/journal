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
