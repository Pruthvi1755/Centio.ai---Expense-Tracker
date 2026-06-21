from sqlalchemy import Column, Integer, String, Float, ForeignKey
from sqlalchemy.orm import relationship
from app.database.session import Base

class Budget(Base):
    """
    SQLAlchemy model representing spending limits per category or overall monthly limits.
    """
    __tablename__ = "budgets"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    category = Column(String, nullable=False)  # "overall" or specific categories (e.g. "Food")
    amount = Column(Float, nullable=False)      # The maximum limit
    period = Column(String, default="monthly", nullable=False)

    # Relationships
    user = relationship("User", back_populates="budgets")
