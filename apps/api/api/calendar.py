from datetime import datetime, date, timedelta
from typing import List, Dict, Any
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from uuid import UUID

from ..database.session import get_db
from ..dependencies.auth import get_current_user
from ..models.all_models import Profile
from ..repositories.all_repositories import calendar_repo, assignment_repo, timetable_repo, subject_repo

router = APIRouter()

@router.get("")
async def get_integrated_calendar(
    current_user: Profile = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    # Fetch user calendar events, assignments, and class timetable
    custom_events = await calendar_repo.get_by_user(db, current_user.id)
    assignments = await assignment_repo.get_by_user(db, current_user.id, is_done=False)
    timetable_slots = await timetable_repo.get_by_user(db, current_user.id)
    subjects = await subject_repo.get_by_user(db, current_user.id)
    subject_map = {sub.id: sub for sub in subjects}
    
    events_feed: List[Dict[str, Any]] = []
    
    # 1. Custom events
    for e in custom_events:
        events_feed.append({
            "id": str(e.id),
            "type": e.event_type, # assignment, exam, event, study_session
            "label": e.label,
            "date": e.event_date.isoformat(),
            "description": e.description,
            "source": "custom"
        })
        
    # 2. Active assignments as calendar events
    for a in assignments:
        events_feed.append({
            "id": str(a.id),
            "type": "assignment",
            "label": f"Due: {a.title}",
            "date": a.due_date.date().isoformat(),
            "description": f"Priority: {a.priority}",
            "source": "assignment"
        })
        
    # 3. Timetable Slots mapped into recurring calendar entries for current week
    # Helper to find date of specific weekday in current week
    today = date.today()
    start_of_week = today - timedelta(days=today.weekday()) # Monday
    weekday_map = {"Mon": 0, "Tue": 1, "Wed": 2, "Thu": 3, "Fri": 4, "Sat": 5, "Sun": 6}
    
    for slot in timetable_slots:
        day_offset = weekday_map.get(slot.day_of_week)
        if day_offset is not None:
            slot_date = start_of_week + timedelta(days=day_offset)
            sub = subject_map.get(slot.subject_id)
            sub_name = sub.name if sub else "Class"
            events_feed.append({
                "id": str(slot.id),
                "type": "class",
                "label": f"{sub_name} ({slot.class_type})",
                "date": slot_date.isoformat(),
                "description": f"Room: {slot.room} | {slot.start_time.strftime('%H:%M')} - {slot.end_time.strftime('%H:%M')}",
                "source": "timetable"
            })
            
    return events_feed
