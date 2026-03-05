from pydantic import BaseModel

class CreateEntry(BaseModel):
    text: str
    created: str

class PutEntry(BaseModel):
    text: str
    created: str
    id: int