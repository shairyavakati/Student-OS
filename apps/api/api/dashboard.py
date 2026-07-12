from datetime import datetime, date, time
from typing import List, Dict, Any
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from uuid import UUID

from database.session import get_db
from dependencies.auth import get_current_user
from models.all_models import Profile
from repositories.all_repositories import timetable_repo, note_repo, assignment_repo, attendance_repo, subject_repo

router = APIRouter()

@router.get("/summary")
async def get_dashboard_summary(
    current_user: Profile = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    # 1. Today's Classes
    today_name = datetime.now().strftime("%a") # e.g. "Mon"
    all_slots = await timetable_repo.get_by_user(db, current_user.id)
    today_slots = [s for s in all_slots if s.day_of_week == today_name]
    
    subjects = await subject_repo.get_by_user(db, current_user.id)
    subject_map = {sub.id: sub for sub in subjects}
    
    classes_today = []
    # Sort slots by start_time
    today_slots.sort(key=lambda x: x.start_time)
    
    now_time = datetime.now().time()
    for s in today_slots:
        sub = subject_map.get(s.subject_id)
        sub_name = sub.name if sub else "Subject"
        
        # Determine status
        if s.end_time < now_time:
            status = "done"
        elif s.start_time <= now_time <= s.end_time:
            status = "now"
        else:
            status = "next"
            
        classes_today.append({
            "id": str(s.id),
            "time": f"{s.start_time.strftime('%H:%M')} – {s.end_time.strftime('%H:%M')}",
            "subject": sub_name,
            "room": s.room or "TBA",
            "type": s.class_type,
            "status": status
        })
        
    # 2. Upcoming Assignments
    assignments = await assignment_repo.get_by_user(db, current_user.id, is_done=False)
    assignments.sort(key=lambda x: x.due_date)
    upcoming_assignments = []
    for ass in assignments[:3]:
        sub = subject_map.get(ass.subject_id)
        sub_name = sub.name if sub else "General"
        upcoming_assignments.append({
            "id": str(ass.id),
            "title": ass.title,
            "subject": sub_name,
            "due": ass.due_date.strftime("%b %d, %Y"),
            "priority": ass.priority,
            "progress": ass.progress_percentage
        })
        
    # 3. Recent Notes
    notes = await note_repo.get_by_user(db, current_user.id)
    # Sort notes by updated_at descending
    notes.sort(key=lambda x: x.updated_at, reverse=True)
    recent_notes = []
    for n in notes[:3]:
        sub = subject_map.get(n.subject_id)
        sub_name = sub.name if sub else "General"
        recent_notes.append({
            "id": str(n.id),
            "title": n.title,
            "subject": sub_name,
            "preview": n.content[:80] + "..." if len(n.content) > 80 else n.content,
            "tags": n.tags or [],
            "pinned": n.is_pinned,
            "date": n.updated_at.strftime("%b %d")
        })
        
    # 4. Attendance Summary
    attendance_records = await attendance_repo.get_by_user(db, current_user.id)
    overall_attended = sum(a.attended_count for a in attendance_records)
    overall_total = sum(a.total_count for a in attendance_records)
    attendance_percentage = int(overall_attended / overall_total * 100) if overall_total > 0 else 100
    
    # 5. Productivity Stats & Streak
    # Return mockup/default streak stats (preserving UI visualizer data structures)
    return {
        "greeting": {
            "name": current_user.full_name,
            "semester": current_user.semester,
            "department": current_user.department
        },
        "streak": 12,
        "classes_today": classes_today,
        "attendance": {
            "percentage": attendance_percentage,
            "attended": overall_attended,
            "total": overall_total
        },
        "upcoming_assignments": upcoming_assignments,
        "recent_notes": recent_notes,
        "study_hours_today": 3.5,
        "pending_assignments_count": len(assignments)
    }
