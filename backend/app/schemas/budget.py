from typing import Optional
from pydantic import BaseModel, Field, field_validator

class BudgetBase(BaseModel):
    """
    Base attributes for a category or overall spending budget.
    """
    category: str = Field(default="overall", description="Budget category (e.g. 'overall' or a specific category name)")
    amount: float = Field(..., gt=0, description="Spending limit value (must be positive)")
    period: str = Field(default="monthly", description="Budget period length, defaults to monthly")

    @field_validator("category")
    @classmethod
    def validate_category(cls, value: str) -> str:
        val = value.strip()
        if not val:
            raise ValueError("Category name cannot be empty")
        return val

    @field_validator("period")
    @classmethod
    def validate_period(cls, value: str) -> str:
        val = value.lower().strip()
        if val not in ("daily", "weekly", "monthly", "yearly"):
            raise ValueError("Period must be daily, weekly, monthly, or yearly")
        return val

class BudgetCreate(BudgetBase):
    """
    Schema for budget creation.
    """
    pass

class BudgetUpdate(BaseModel):
    """
    Schema for updating an existing budget limit.
    """
    amount: Optional[float] = None
    category: Optional[str] = None
    period: Optional[str] = None

    @field_validator("amount")
    @classmethod
    def validate_amount(cls, value: Optional[float]) -> Optional[float]:
        if value is not None and value <= 0:
            raise ValueError("Amount must be greater than zero")
        return value

class BudgetResponse(BudgetBase):
    """
    Schema for serialized budget responses.
    """
    id: int
    user_id: int
    current_spent: float = 0.0  # Helper calculation added by API services

    class Config:
        from_attributes = True
