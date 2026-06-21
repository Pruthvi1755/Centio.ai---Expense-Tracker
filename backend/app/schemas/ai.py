from typing import List, Optional
from pydantic import BaseModel, Field

class ForecastDataPoint(BaseModel):
    """
    Data point representing forecasted expenditures.
    """
    date: str = Field(..., description="Date of forecast projection (YYYY-MM-DD)")
    amount: float = Field(..., description="Predicted total expenditure amount")

class ExpenseForecastResponse(BaseModel):
    """
    Response schema for projected spending limits.
    """
    next_month_forecast: float = Field(..., description="Overall forecasted spending for next month")
    points: List[ForecastDataPoint] = Field(..., description="Day-by-day projected details")
    confidence: str = Field(..., description="Model confidence description (e.g. High, Medium, Low)")

class FinancialInsight(BaseModel):
    """
    Individual calculated AI insight or recommendation.
    """
    type: str = Field(..., description="Type of insight: 'warning', 'suggestion', or 'info'")
    message: str = Field(..., description="Detailed markdown message representing the analysis")
    category: Optional[str] = Field(None, description="Related category if applicable")
    potential_savings: Optional[float] = Field(None, description="Potential savings if action is taken")

class AIInsightsResponse(BaseModel):
    """
    Full AI analysis output containing qualitative patterns and action items.
    """
    insights: List[FinancialInsight] = Field(..., description="List of generated actionable insights")
    spending_pattern: str = Field(..., description="Text summary describing the user's spending patterns")
    savings_suggestions: List[str] = Field(..., description="List of concrete steps for saving money")
