import logging
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.models.user import User
from app.models.transaction import Transaction
from app.models.budget import Budget
from app.schemas.ai import ExpenseForecastResponse, AIInsightsResponse
from app.routers.auth import get_current_user
from app.services.ai_service import AIService

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/ai", tags=["AI Insights & Forecasting"])

@router.get("/forecast", response_model=ExpenseForecastResponse)
def get_forecast(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Predicts transaction spending patterns over the next 30 days based on
    chronological least-squares regression lines computed on historic expense outlays.
    """
    try:
        transactions = db.query(Transaction).filter(
            Transaction.user_id == current_user.id
        ).order_by(Transaction.date.asc()).all()
        
        forecast = AIService.get_forecast(transactions)
        return forecast
    except Exception as e:
        logger.error(f"Error compiling user forecast: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail="Failed to compute budget projections."
        )

@router.get("/insights", response_model=AIInsightsResponse)
def get_insights(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Compiles alerts, checks budget warning thresholds (80% and 100%),
    and suggests dynamic behavioral improvements based on historical inputs.
    """
    try:
        transactions = db.query(Transaction).filter(
            Transaction.user_id == current_user.id
        ).all()
        
        budgets = db.query(Budget).filter(
            Budget.user_id == current_user.id
        ).all()
        
        insights = AIService.get_insights(transactions, budgets)
        return insights
    except Exception as e:
        logger.error(f"Error compiling user insights: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail="Failed to run heuristic insights engine."
        )
