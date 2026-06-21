import logging
from datetime import datetime, timezone
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.models.user import User
from app.models.budget import Budget
from app.models.transaction import Transaction
from app.schemas.budget import BudgetCreate, BudgetUpdate, BudgetResponse
from app.routers.auth import get_current_user

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/budgets", tags=["Budgets"])

def calculate_spent_for_category(db: Session, user_id: int, category: str) -> float:
    """
    Helper function to compute total monthly expenditures in the current calendar month
    for a given category (or overall).
    """
    try:
        now = datetime.now(timezone.utc)
        # Calculate beginning of current calendar month (local/UTC offset handled)
        start_of_month = datetime(now.year, now.month, 1)
        
        query = db.query(Transaction).filter(
            Transaction.user_id == user_id,
            Transaction.type == "expense",
            Transaction.date >= start_of_month
        )
        
        if category.lower() != "overall":
            query = query.filter(Transaction.category.ilike(category))
            
        total = sum(t.amount for t in query.all())
        return round(total, 2)
    except Exception as e:
        logger.error(f"Error calculating spent for budget: {str(e)}")
        return 0.0

@router.post("/", response_model=BudgetResponse, status_code=status.HTTP_201_CREATED)
def create_budget(
    budget_in: BudgetCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Creates a new budget category limit. If a limit for this category
    already exists, it rejects the request to prevent duplicates.
    """
    category_key = budget_in.category.strip()
    
    # Check if budget rules already exist for this category
    existing = db.query(Budget).filter(
        Budget.user_id == current_user.id,
        Budget.category.ilike(category_key)
    ).first()
    
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"A budget rule already exists for category '{category_key}'. Use PUT to update it instead."
        )
        
    try:
        db_budget = Budget(
            user_id=current_user.id,
            category=category_key,
            amount=budget_in.amount,
            period=budget_in.period
        )
        db.add(db_budget)
        db.commit()
        db.refresh(db_budget)
        
        # Inject spent calculation
        db_budget.current_spent = calculate_spent_for_category(db, current_user.id, db_budget.category)
        logger.info(f"Created budget {db_budget.id} for user {current_user.email}")
        return db_budget
    except Exception as e:
        db.rollback()
        logger.error(f"Error creating budget limit: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to save budget settings."
        )

@router.get("/", response_model=List[BudgetResponse])
def read_budgets(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Lists all category budgets for the authenticated user, dynamically calculating
    each category's total monthly expenditure details.
    """
    try:
        budgets = db.query(Budget).filter(Budget.user_id == current_user.id).all()
        for b in budgets:
            b.current_spent = calculate_spent_for_category(db, current_user.id, b.category)
        return budgets
    except Exception as e:
        logger.error(f"Error loading budgets: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to load budget summaries."
        )

@router.get("/{budget_id}", response_model=BudgetResponse)
def read_budget(
    budget_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Retrieves a single budget details by ID.
    """
    b = db.query(Budget).filter(Budget.id == budget_id, Budget.user_id == current_user.id).first()
    if not b:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Budget limit not found.")
    
    b.current_spent = calculate_spent_for_category(db, current_user.id, b.category)
    return b

@router.put("/{budget_id}", response_model=BudgetResponse)
def update_budget(
    budget_id: int,
    budget_update: BudgetUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Updates the spending limit or period for an existing budget.
    """
    b = db.query(Budget).filter(Budget.id == budget_id, Budget.user_id == current_user.id).first()
    if not b:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Budget limit not found.")
        
    try:
        update_data = budget_update.model_dump(exclude_unset=True)
        for key, val in update_data.items():
            setattr(b, key, val)
            
        db.commit()
        db.refresh(b)
        
        b.current_spent = calculate_spent_for_category(db, current_user.id, b.category)
        logger.info(f"Updated budget {b.id} for user {current_user.email}")
        return b
    except Exception as e:
        db.rollback()
        logger.error(f"Error updating budget limit: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update budget limit."
        )

@router.delete("/{budget_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_budget(
    budget_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Deletes an existing budget limit rule.
    """
    b = db.query(Budget).filter(Budget.id == budget_id, Budget.user_id == current_user.id).first()
    if not b:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Budget limit not found.")
        
    try:
        db.delete(b)
        db.commit()
        logger.info(f"Deleted budget {budget_id} for user {current_user.email}")
        return
    except Exception as e:
        db.rollback()
        logger.error(f"Error deleting budget: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to delete budget limit rule."
        )
