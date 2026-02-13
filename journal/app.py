from typing import Optional

from fastapi import FastAPI, HTTPException
from . import datebase

app = FastAPI()


@app.get("/")
def read_root():
    return {"Hello": "World"}


@app.post("/createUser", status_code=201)
def read_item(username: Optional[str], password: Optional[str] = None):
    try:
        datebase.add_user(username, password)
    except datebase.UsernameTakenError:
        raise HTTPException(status_code=409, detail="user already created")
