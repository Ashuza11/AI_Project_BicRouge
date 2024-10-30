from pydantic import BaseModel
from typing import Optional


class InstitutionBase(BaseModel):
    name: str
    description: Optional[str] = None


class InstitutionCreate(InstitutionBase):
    pass


class InstitutionRead(InstitutionBase):
    id: int

    class Config:
        from_attributes = True
