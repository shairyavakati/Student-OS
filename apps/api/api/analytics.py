from typing import Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from database.session import get_db
from dependencies.auth import get_current_user
from models.all_models import Profile
from repositories.all_repositories import assignment_repo, attendance_repo

router = APIRouter()

@router.get("/study-stats")
async def get_study_stats(
    current_user: Profile = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    # Retrieve mock study stats (replicating UI dashboard visualizer datasets)
    # Mon: 3.5 hrs, Tue: 4.2 hrs, Wed: 2.8 hrs, Thu: 5.1 hrs, Fri: 3.9 hrs, Sat: 6.2 hrs, Sun: 2.1 hrs
    study_hours = [
        {"day": "Mon", "hours": 3.5},
        {"day": "Tue", "hours": 4.2},
        {"day": "Wed", "hours": 2.8},
        {"day": "Thu", "hours": 5.1},
        {"day": "Fri", "hours": 3.9},
        {"day": "Sat", "hours": 6.2},
        {"day": "Sun", "hours": 2.1}
    ]
    
    # Weekly completion data: [ {week: "W1", done: 4, pct: 92}, ... ]
    weekly_completion = [
        {"week": "W1", "done": 4, "pct": 92},
        {"week": "W2", "done": 6, "pct": 88},
        {"week": "W3", "done": 3, "pct": 95},
        {"week": "W4", "done": 7, "pct": 82},
        {"week": "W5", "done": 5, "pct": 90},
        {"week": "W6", "done": 8, "pct": 87}
    ]
    
    return {
        "weekly_study_hours": study_hours,
        "weekly_completion": weekly_completion,
        "total_study_hours_this_week": sum(d["hours"] for d in study_hours),
        "average_daily_hours": round(sum(d["hours"] for d in study_hours) / 7.0, 1)
    }

@router.get("/gpa-predictor")
async def predict_gpa(
    internal_average: Optional[float] = Query(85.0, description="Average marks in internal tests (0-100)"),
    exam_estimate: Optional[float] = Query(80.0, description="Estimated final exam average (0-100)"),
    current_user: Profile = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    # Fetch assignments and attendance
    assignments = await assignment_repo.get_by_user(db, current_user.id)
    attendance = await attendance_repo.get_by_user(db, current_user.id)
    
    # Compute assignment progress/grade average (using progress as mock grade representation)
    if assignments:
        assignment_avg = sum(a.progress_percentage for a in assignments) / len(assignments)
    else:
        assignment_avg = 80.0 # fallback default
        
    # Compute attendance average
    if attendance:
        attended = sum(a.attended_count for a in attendance)
        total = sum(a.total_count for a in attendance)
        attendance_avg = (attended / total * 100.0) if total > 0 else 85.0
    else:
        attendance_avg = 85.0 # fallback default
        
    # Compute weighted score
    # Internals: 30%, Assignments: 20%, Attendance: 10%, Exams: 40%
    score = (
        (internal_average * 0.3) +
        (assignment_avg * 0.2) +
        (attendance_avg * 0.1) +
        (exam_estimate * 0.4)
    )
    
    # Map score (0-100) to GPA (0.0-4.0)
    if score >= 90:
        gpa = 4.0
        grade = "A"
    elif score >= 80:
        gpa = 3.5 + (score - 80) * 0.05
        grade = "B+"
    elif score >= 70:
        gpa = 3.0 + (score - 70) * 0.05
        grade = "B"
    elif score >= 60:
        gpa = 2.0 + (score - 60) * 0.1
        grade = "C"
    else:
        gpa = max(1.0, score / 30.0)
        grade = "D"
        
    gpa = round(gpa, 2)
    
    # Expected outcomes data for visualization
    visualizations = [
        {"scenario": "Worst Case (Exam Average: 60%)", "predicted_gpa": round(gpa - 0.5, 2)},
        {"scenario": "Current Trend (Exam Average: " + str(exam_estimate) + "%)", "predicted_gpa": gpa},
        {"scenario": "Best Case (Exam Average: 95%)", "predicted_gpa": round(min(4.0, gpa + 0.4), 2)}
    ]
    
    return {
        "assignment_average": round(assignment_avg, 1),
        "attendance_average": round(attendance_avg, 1),
        "internal_average": internal_average,
        "exam_estimate": exam_estimate,
        "predicted_score": round(score, 1),
        "predicted_gpa": gpa,
        "predicted_grade": grade,
        "visualizations": visualizations
    }
