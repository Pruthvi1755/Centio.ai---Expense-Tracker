import logging
from collections import defaultdict
from datetime import datetime, timezone, timedelta
from typing import Dict, Any, List
from fastapi import APIRouter, Depends, Response, HTTPException
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.models.user import User
from app.models.transaction import Transaction
from app.routers.auth import get_current_user
from app.services.report_service import ReportService

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/analytics", tags=["Analytics"])

@router.get("/summary")
def get_summary(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Computes cumulative totals for income, expense, net balance, and saving percentages.
    """
    try:
        transactions = db.query(Transaction).filter(Transaction.user_id == current_user.id).all()
        
        total_income = sum(t.amount for t in transactions if t.type == "income")
        total_expense = sum(t.amount for t in transactions if t.type == "expense")
        net_balance = total_income - total_expense
        
        savings_rate = 0.0
        if total_income > 0:
            savings_rate = round(((total_income - total_expense) / total_income) * 100, 2)
            
        return {
            "total_income": round(total_income, 2),
            "total_expense": round(total_expense, 2),
            "net_balance": round(net_balance, 2),
            "savings_rate": savings_rate,
            "total_transactions": len(transactions)
        }
    except Exception as e:
        logger.error(f"Error compiling summary metrics: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to compile summary metrics.")

@router.get("/categories")
def get_category_breakdown(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Groups spending records by category and computes proportional ratios.
    """
    try:
        expenses = db.query(Transaction).filter(
            Transaction.user_id == current_user.id,
            Transaction.type == "expense"
        ).all()
        
        total_expense = sum(e.amount for e in expenses)
        
        cat_map: Dict[str, float] = defaultdict(float)
        for exp in expenses:
            cat_map[exp.category] = cat_map[exp.category] + exp.amount
            
        breakdown = []
        for cat, amt in cat_map.items():
            percentage = round((amt / total_expense) * 100, 2) if total_expense > 0 else 0.0
            breakdown.append({
                "category": cat,
                "amount": round(amt, 2),
                "percentage": percentage
            })
            
        # Sort by largest expense category first
        breakdown.sort(key=lambda x: x["amount"], reverse=True)
        return breakdown
    except Exception as e:
        logger.error(f"Error building category breakdown: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to compile category analytics.")

@router.get("/monthly-trend")
def get_monthly_trend(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Groups expenses and incomes by calendar month (e.g. YYYY-MM) for charts plotting.
    """
    try:
        transactions = db.query(Transaction).filter(Transaction.user_id == current_user.id).all()
        
        # Structure data format: {"2026-06": {"income": 0.0, "expense": 0.0}}
        trend_map: Dict[str, Dict[str, float]] = defaultdict(lambda: {"income": 0.0, "expense": 0.0})
        
        for t in transactions:
            month_key = t.date.strftime("%Y-%m")
            trend_map[month_key][t.type] += t.amount
            
        sorted_months = sorted(trend_map.keys())
        
        result = []
        for m in sorted_months:
            result.append({
                "month": m,
                "income": round(trend_map[m]["income"], 2),
                "expense": round(trend_map[m]["expense"], 2)
            })
            
        return result
    except Exception as e:
        logger.error(f"Error computing monthly trends: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to load monthly analytics.")

@router.get("/weekly-trend")
def get_weekly_trend(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Aggregates user outlays day-by-day for the past 7 days.
    """
    try:
        today = datetime.utcnow()
        seven_days_ago = today - timedelta(days=7)
        
        transactions = db.query(Transaction).filter(
            Transaction.user_id == current_user.id,
            Transaction.date >= seven_days_ago
        ).all()
        
        # Initialize day logs with zero values
        day_map = {}
        for i in range(7):
            d = (today - timedelta(days=i)).strftime("%Y-%m-%d")
            day_map[d] = {"income": 0.0, "expense": 0.0}
            
        for t in transactions:
            day_key = t.date.strftime("%Y-%m-%d")
            if day_key in day_map:
                day_map[day_key][t.type] += t.amount
                
        sorted_days = sorted(day_map.keys())
        result = []
        for d in sorted_days:
            result.append({
                "date": d,
                "income": round(day_map[d]["income"], 2),
                "expense": round(day_map[d]["expense"], 2)
            })
            
        return result
    except Exception as e:
        logger.error(f"Error loading weekly trend: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to compile weekly analytics.")

@router.get("/export/csv")
def export_csv(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Generates and downloads a CSV document containing all historical transactions.
    """
    try:
        transactions = db.query(Transaction).filter(Transaction.user_id == current_user.id).order_by(Transaction.date.desc()).all()
        csv_content = ReportService.generate_csv(transactions)
        
        return Response(
            content=csv_content,
            media_type="text/csv",
            headers={"Content-Disposition": f"attachment; filename=transactions_{current_user.id}.csv"}
        )
    except Exception as e:
        logger.error(f"Failed to export CSV: {str(e)}")
        raise HTTPException(status_code=500, detail="CSV compilation error.")

@router.get("/export/excel")
def export_excel(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Generates and downloads a styled Excel sheet containing all historical transactions.
    """
    try:
        transactions = db.query(Transaction).filter(Transaction.user_id == current_user.id).order_by(Transaction.date.desc()).all()
        excel_content = ReportService.generate_excel(transactions)
        
        media_type = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        # If openpyxl fallback is active, report service outputs binary CSV string
        from app.services.report_service import OPENPYXL_AVAILABLE
        if not OPENPYXL_AVAILABLE:
            media_type = "text/csv"
            filename = f"transactions_{current_user.id}.csv"
        else:
            filename = f"transactions_{current_user.id}.xlsx"

        return Response(
            content=excel_content,
            media_type=media_type,
            headers={"Content-Disposition": f"attachment; filename={filename}"}
        )
    except Exception as e:
        logger.error(f"Failed to export Excel spreadsheet: {str(e)}")
        raise HTTPException(status_code=500, detail="Excel compilation error.")

@router.get("/export/pdf")
def export_pdf(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Generates and downloads a styled corporate PDF containing all transactions.
    """
    try:
        transactions = db.query(Transaction).filter(Transaction.user_id == current_user.id).order_by(Transaction.date.desc()).all()
        pdf_content = ReportService.generate_pdf(transactions)
        
        return Response(
            content=pdf_content,
            media_type="application/pdf",
            headers={"Content-Disposition": f"attachment; filename=report_{current_user.id}.pdf"}
        )
    except Exception as e:
        logger.error(f"Failed to export PDF: {str(e)}")
        raise HTTPException(status_code=500, detail="PDF compilation error.")
