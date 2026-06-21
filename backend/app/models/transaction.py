from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.database.session import Base

class Transaction(Base):
    """
    SQLAlchemy model representing an income or expense transaction.
    """
    __tablename__ = "transactions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    type = Column(String, nullable=False)  # "income" or "expense"
    category = Column(String, nullable=False)  # e.g., "Food", "Salary", "Rent"
    amount = Column(Float, nullable=False)
    date = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    notes = Column(String, nullable=True)
    tags = Column(String, nullable=True)  # Comma-separated tags (e.g., "groceries,weekly")

    # Relationships
    user = relationship("User", back_populates="transactions")
