import logging
from datetime import datetime, timedelta, timezone
from typing import List, Dict, Any, Tuple
from app.models.transaction import Transaction
from app.models.budget import Budget
from app.schemas.ai import ForecastDataPoint, FinancialInsight, AIInsightsResponse, ExpenseForecastResponse

logger = logging.getLogger(__name__)

def compute_linear_regression(points: List[Tuple[float, float]]) -> Tuple[float, float]:
    """
    Computes simple linear regression using Ordinary Least Squares (OLS).
    Returns slope (m) and intercept (c) for the line y = mx + c.
    """
    n = len(points)
    if n < 2:
        return 0.0, sum(p[1] for p in points) / (n if n > 0 else 1)
        
    sum_x = sum(p[0] for p in points)
    sum_y = sum(p[1] for p in points)
    sum_xx = sum(p[0] * p[0] for p in points)
    sum_xy = sum(p[0] * p[1] for p in points)
    
    denominator = (n * sum_xx) - (sum_x * sum_x)
    if denominator == 0:
        return 0.0, sum_y / n
        
    slope = ((n * sum_xy) - (sum_x * sum_y)) / denominator
    intercept = (sum_y - (slope * sum_x)) / n
    return slope, intercept

class AIService:
    """
    AI core services handling linear regression-based expense forecasting,
    category thresholds analysis, and rule-based savings recommendations.
    """

    @staticmethod
    def get_forecast(transactions: List[Transaction]) -> ExpenseForecastResponse:
        """
        Projects daily spending for the next 30 days using linear regression.
        Fits a line on historical daily expenses.
        """
        try:
            # Filter and sort historical expenses
            expenses = [t for t in transactions if t.type == "expense"]
            if not expenses:
                # Return empty/default forecast if no history
                default_points = []
                today = datetime.now()
                for i in range(1, 31):
                    future_date = (today + timedelta(days=i)).strftime("%Y-%m-%d")
                    default_points.append(ForecastDataPoint(date=future_date, amount=0.0))
                return ExpenseForecastResponse(
                    next_month_forecast=0.0,
                    points=default_points,
                    confidence="Low (No data)"
                )
                
            # Aggregate expenses by date (YYYY-MM-DD)
            daily_aggregates: Dict[str, float] = {}
            for exp in expenses:
                date_str = exp.date.strftime("%Y-%m-%d")
                daily_aggregates[date_str] = daily_aggregates.get(date_str, 0.0) + exp.amount

            # Convert to sorted list of (timestamp_ordinal, amount)
            dates_sorted = sorted(daily_aggregates.keys())
            regression_points: List[Tuple[float, float]] = []
            
            # Use day indices (0, 1, 2...) for regression X axis to keep math stable
            base_date = datetime.strptime(dates_sorted[0], "%Y-%m-%d")
            for d_str in dates_sorted:
                d_obj = datetime.strptime(d_str, "%Y-%m-%d")
                days_diff = (d_obj - base_date).days
                regression_points.append((float(days_diff), daily_aggregates[d_str]))
            
            # Fit line: y = mx + c
            m, c = compute_linear_regression(regression_points)
            
            # Forecast next 30 days
            last_day_offset = regression_points[-1][0] if regression_points else 0
            today = datetime.now()
            forecast_points: List[ForecastDataPoint] = []
            next_month_total = 0.0
            
            for i in range(1, 31):
                future_offset = last_day_offset + i
                predicted_val = (m * future_offset) + c
                if predicted_val < 0:
                    predicted_val = 0.0 # Expenses cannot be negative
                
                future_date_str = (today + timedelta(days=i)).strftime("%Y-%m-%d")
                forecast_points.append(ForecastDataPoint(date=future_date_str, amount=round(predicted_val, 2)))
                next_month_total += predicted_val

            # Determine confidence level based on data length
            confidence = "High" if len(regression_points) >= 15 else "Medium" if len(regression_points) >= 5 else "Low"
            
            return ExpenseForecastResponse(
                next_month_forecast=round(next_month_total, 2),
                points=forecast_points,
                confidence=f"{confidence} ({len(regression_points)} data days fitted)"
            )
        except Exception as e:
            logger.error(f"Error compiling forecast: {str(e)}")
            raise RuntimeError("Forecast compilation failed.") from e

    @staticmethod
    def get_insights(transactions: List[Transaction], budgets: List[Budget]) -> AIInsightsResponse:
        """
        Analyzes spending profiles, identifies anomalies/over-budget items,
        and generates actionable alerts.
        """
        try:
            expenses = [t for t in transactions if t.type == "expense"]
            total_expense = sum(e.amount for e in expenses)
            
            insights_list: List[FinancialInsight] = []
            savings_suggestions: List[str] = []
            
            # 1. Category-specific breakdown
            cat_totals: Dict[str, float] = {}
            for exp in expenses:
                cat_totals[exp.category] = cat_totals.get(exp.category, 0.0) + exp.amount
                
            # 2. Check budgets and generate alerts
            for b in budgets:
                cat_name = b.category
                limit = b.amount
                
                # Calculate what was spent in this category
                spent = 0.0
                if cat_name.lower() == "overall":
                    spent = total_expense
                else:
                    spent = cat_totals.get(cat_name, 0.0)
                    
                percentage = (spent / limit) * 100 if limit > 0 else 0
                
                if percentage >= 100:
                    insights_list.append(FinancialInsight(
                        type="warning",
                        message=f"Budget **Exceeded** for **{cat_name.title()}**! You spent **${spent:,.2f}** of your **${limit:,.2f}** limit.",
                        category=cat_name,
                        potential_savings=spent - limit
                    ))
                    savings_suggestions.append(f"Pause luxury spending on {cat_name} immediately to curb deficits.")
                elif percentage >= 80:
                    insights_list.append(FinancialInsight(
                        type="warning",
                        message=f"Budget **Warning** for **{cat_name.title()}**! You have consumed **{percentage:.1f}%** of your limit (${spent:,.2f} / ${limit:,.2f}).",
                        category=cat_name,
                        potential_savings=None
                    ))
                    savings_suggestions.append(f"Consider cheaper alternatives for {cat_name} to stay under budget limit.")

            # 3. Pattern classification & anomalies
            pattern_summary = "Analyzing transaction data..."
            if not expenses:
                pattern_summary = "No expense data recorded. Start adding expenses to receive custom AI behavioral patterns!"
                savings_suggestions.append("Add your monthly income and recurring budgets to start mapping savings projections.")
            else:
                # Find maximum expense categories
                sorted_cats = sorted(cat_totals.items(), key=lambda x: x[1], reverse=True)
                primary_cat, primary_amt = sorted_cats[0]
                primary_percent = (primary_amt / total_expense) * 100
                
                pattern_summary = (
                    f"Your primary expense driver is **{primary_cat.title()}**, representing "
                    f"**{primary_percent:.1f}%** of total outlays (${primary_amt:,.2f} spent)."
                )
                
                # Rule-based suggestions based on categories
                if primary_cat.lower() in ("dining", "food", "restaurants"):
                    insights_list.append(FinancialInsight(
                        type="suggestion",
                        message=f"Cooking at home more often could reduce **{primary_cat.title()}** outlays.",
                        category=primary_cat,
                        potential_savings=primary_amt * 0.25 # assume 25% savings potential
                    ))
                    savings_suggestions.append("Plan meals weekly and limit dining out to twice a week.")
                    
                elif primary_cat.lower() in ("entertainment", "shopping", "leisure"):
                    insights_list.append(FinancialInsight(
                        type="suggestion",
                        message="Subscription audits or delayed-purchase rules can reduce shopping leaks.",
                        category=primary_cat,
                        potential_savings=primary_amt * 0.30
                    ))
                    savings_suggestions.append("Use the 48-hour rule: wait 2 days before buying non-essential items.")
                
                # Check savings rate
                total_income = sum(t.amount for t in transactions if t.type == "income")
                if total_income > 0:
                    savings_rate = ((total_income - total_expense) / total_income) * 100
                    if savings_rate < 10:
                        insights_list.append(FinancialInsight(
                            type="warning",
                            message=f"Low Savings Rate! You are only saving **{savings_rate:.1f}%** of your earnings. Target is at least 20%.",
                            category=None,
                            potential_savings=total_income * 0.20 - (total_income - total_expense)
                        ))
                        savings_suggestions.append("Automate a 10% transfers to savings account on payday.")
                    else:
                        insights_list.append(FinancialInsight(
                            type="info",
                            message=f"Healthy financial balance! Saving **{savings_rate:.1f}%** of your active incoming cash flows.",
                            category=None,
                            potential_savings=None
                        ))
                else:
                    insights_list.append(FinancialInsight(
                        type="info",
                        message="No active income flows recorded. Tracking regular income helps compute saving metrics.",
                        category=None,
                        potential_savings=None
                    ))
                    
            if not insights_list:
                # Add default general insights if no warnings/suggestions triggered
                insights_list.append(FinancialInsight(
                    type="info",
                    message="All spending matches typical ranges. Keep maintaining budgets to maintain baseline wealth.",
                    category=None,
                    potential_savings=None
                ))
            if not savings_suggestions:
                savings_suggestions.append("Maintain an emergency fund covering at least three to six months of vital bills.")

            return AIInsightsResponse(
                insights=insights_list,
                spending_pattern=pattern_summary,
                savings_suggestions=savings_suggestions
            )
        except Exception as e:
            logger.error(f"Error computing insights: {str(e)}")
            raise RuntimeError("Insights evaluation failed.") from e
