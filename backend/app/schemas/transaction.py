from datetime import datetime
from typing import List, Optional, Union
from pydantic import BaseModel, Field, field_validator

class TransactionBase(BaseModel):
    """
    Base attributes for a financial transaction.
    """
    type: str = Field(..., description="Transaction type: 'income' or 'expense'")
    category: str = Field(..., description="Category group (e.g. Food, Salary, Travel)")
    amount: float = Field(..., gt=0, description="Transaction amount (must be positive)")
    date: Optional[datetime] = Field(None, description="Date of transaction, defaults to current time if empty")
    notes: Optional[str] = Field(None, description="Additional notes/descriptions")
    tags: Optional[Union[List[str], str]] = Field(default=None, description="List of tags or a comma-separated string")

    @field_validator("type")
    @classmethod
    def validate_type(cls, value: str) -> str:
        val = value.lower().strip()
        if val not in ("income", "expense"):
            raise ValueError("Type must be either 'income' or 'expense'")
        return val

    @field_validator("category")
    @classmethod
    def validate_category(cls, value: str) -> str:
        val = value.strip()
        if not val:
            raise ValueError("Category cannot be empty")
        return val

class TransactionCreate(TransactionBase):
    """
    Schema for creating a transaction.
    """
    pass

class TransactionUpdate(BaseModel):
    """
    Schema for updating an existing transaction.
    """
    type: Optional[str] = None
    category: Optional[str] = None
    amount: Optional[float] = None
    date: Optional[datetime] = None
    notes: Optional[str] = None
    tags: Optional[Union[List[str], str]] = None

    @field_validator("amount")
    @classmethod
    def validate_amount(cls, value: Optional[float]) -> Optional[float]:
        if value is not None and value <= 0:
            raise ValueError("Amount must be greater than zero")
        return value

class TransactionResponse(BaseModel):
    """
    Schema for serialized transaction responses.
    """
    id: int
    user_id: int
    type: str
    category: str
    amount: float
    date: datetime
    notes: Optional[str] = None
    tags: List[str] = []

    class Config:
        from_attributes = True

    @field_validator("tags", mode="before")
    @classmethod
    def parse_tags(cls, v) -> List[str]:
        """
        Parses tags from database (which are stored as comma-separated string)
        into a clean list of strings for the API output.
        """
        if not v:
            return []
        if isinstance(v, list):
            return [t.strip() for t in v if t.strip()]
        if isinstance(v, str):
            return [t.strip() for t in v.split(",") if t.strip()]
        return []
