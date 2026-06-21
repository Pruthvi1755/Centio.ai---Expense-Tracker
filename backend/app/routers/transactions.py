import logging
from datetime import datetime
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.models.user import User
from app.models.transaction import Transaction
from app.schemas.transaction import TransactionCreate, TransactionUpdate, TransactionResponse
from app.routers.auth import get_current_user

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/transactions", tags=["Transactions"])

@router.post("/", response_model=TransactionResponse, status_code=status.HTTP_201_CREATED)
def create_transaction(
    transaction_in: TransactionCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Registers a new transaction (income/expense) for the authenticated user.
    """
    try:
        # Convert tags list to a comma-separated string for DB storage
        tags_str = None
        if transaction_in.tags:
            if isinstance(transaction_in.tags, list):
                tags_str = ",".join([t.strip() for t in transaction_in.tags if t.strip()])
            elif isinstance(transaction_in.tags, str):
                tags_str = transaction_in.tags
        
        tx_date = transaction_in.date or datetime.utcnow()

        db_transaction = Transaction(
            user_id=current_user.id,
            type=transaction_in.type,
            category=transaction_in.category,
            amount=transaction_in.amount,
            date=tx_date,
            notes=transaction_in.notes,
            tags=tags_str
        )
        
        db.add(db_transaction)
        db.commit()
        db.refresh(db_transaction)
        
        logger.info(f"Created transaction {db_transaction.id} for user {current_user.email}")
        return db_transaction
    except Exception as e:
        db.rollback()
        logger.error(f"Error creating transaction: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Could not save financial transaction."
        )

@router.get("/", response_model=List[TransactionResponse])
def read_transactions(
    type: Optional[str] = Query(None, description="Filter by type ('income' or 'expense')"),
    category: Optional[str] = Query(None, description="Filter by category name"),
    tag: Optional[str] = Query(None, description="Filter by individual tag name"),
    search: Optional[str] = Query(None, description="Search term matches category, notes, or tags"),
    start_date: Optional[datetime] = Query(None, description="Filter transactions after this date"),
    end_date: Optional[datetime] = Query(None, description="Filter transactions before this date"),
    sort_by: str = Query("date", description="Field to sort by ('date' or 'amount')"),
    sort_order: str = Query("desc", description="Sorting direction ('asc' or 'desc')"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Retrieves, filters, searches, and sorts financial transactions for the user.
    """
    try:
        query = db.query(Transaction).filter(Transaction.user_id == current_user.id)
        
        # 1. Filters
        if type:
            query = query.filter(Transaction.type == type.lower())
        if category:
            query = query.filter(Transaction.category.ilike(f"%{category}%"))
        if tag:
            query = query.filter(Transaction.tags.ilike(f"%{tag}%"))
            
        # 2. Date ranges
        if start_date:
            query = query.filter(Transaction.date >= start_date)
        if end_date:
            query = query.filter(Transaction.date <= end_date)
            
        # 3. Global search
        if search:
            search_pattern = f"%{search}%"
            query = query.filter(
                (Transaction.notes.ilike(search_pattern)) |
                (Transaction.category.ilike(search_pattern)) |
                (Transaction.tags.ilike(search_pattern))
            )
            
        # 4. Sorting logic
        sort_field = Transaction.date
        if sort_by.lower() == "amount":
            sort_field = Transaction.amount
            
        if sort_order.lower() == "asc":
            query = query.order_by(sort_field.asc())
        else:
            query = query.order_by(sort_field.desc())
            
        return query.all()
    except Exception as e:
        logger.error(f"Error fetching transactions: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to query transactions database."
        )

@router.get("/{transaction_id}", response_model=TransactionResponse)
def read_transaction(
    transaction_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Retrieves a single transaction by ID.
    """
    tx = db.query(Transaction).filter(Transaction.id == transaction_id, Transaction.user_id == current_user.id).first()
    if not tx:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Transaction not found.")
    return tx

@router.put("/{transaction_id}", response_model=TransactionResponse)
def update_transaction(
    transaction_id: int,
    transaction_update: TransactionUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Updates details of an existing transaction.
    """
    tx = db.query(Transaction).filter(Transaction.id == transaction_id, Transaction.user_id == current_user.id).first()
    if not tx:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Transaction not found.")
        
    try:
        update_data = transaction_update.model_dump(exclude_unset=True)
        
        # Serialize tags list to comma-separated string if provided
        if "tags" in update_data:
            tags_val = update_data["tags"]
            if isinstance(tags_val, list):
                update_data["tags"] = ",".join([t.strip() for t in tags_val if t.strip()])
            elif tags_val is None:
                update_data["tags"] = None
                
        for key, val in update_data.items():
            setattr(tx, key, val)
            
        db.commit()
        db.refresh(tx)
        logger.info(f"Updated transaction {tx.id} for user {current_user.email}")
        return tx
    except Exception as e:
        db.rollback()
        logger.error(f"Error updating transaction: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Could not update transaction details."
        )

@router.delete("/{transaction_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_transaction(
    transaction_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Deletes an existing transaction.
    """
    tx = db.query(Transaction).filter(Transaction.id == transaction_id, Transaction.user_id == current_user.id).first()
    if not tx:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Transaction not found.")
        
    try:
        db.delete(tx)
        db.commit()
        logger.info(f"Deleted transaction {transaction_id} for user {current_user.email}")
        return
    except Exception as e:
        db.rollback()
        logger.error(f"Error deleting transaction: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Could not remove transaction."
        )
