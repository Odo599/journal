from typing import Optional

from fastapi import FastAPI, HTTPException
from . import datebase
from . import errors

app = FastAPI()


@app.post("/createUser", status_code=201)
def read_item(username: Optional[str], password: Optional[str] = None):
    try:
        datebase.add_user(username, password)
    except datebase.UsernameTakenError:
        raise HTTPException(status_code=409, detail="user already created")


@app.get("/getUserApiKey", status_code=200)
def get_api_key(username: Optional[str], password: Optional[str]):
    try:
        response = datebase.check_login(username, password)
        return response
    except errors.UsernameOrPasswordIncorrectError:
        raise HTTPException(status_code=401, detail="incorrect username or password")
