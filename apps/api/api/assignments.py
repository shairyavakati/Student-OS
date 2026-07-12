from typing import List, Optional
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from uuid import UUID

from ..database.session import get_db
from ..dependencies.auth import get_current_user
from ..models.all_models import Profile
from ..schemas.all_schemas import AssignmentOut, AssignmentCreate, AssignmentUpdate
from ..repositories.all_repositories import assignment_repo

router = APIRouter()

@router.get("", response_model=List[AssignmentOut])
async def read_assignments(
    is_done: Optional[bool] = Query(None),
    current_user: Profile = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    return await assignment_repo.get_by_user(db, current_user.id, is_done=is_done)

@router.post("", response_model=AssignmentOut, status_code=status.HTTP_201_CREATED)
async def create_assignment(
    schema: AssignmentCreate,
    current_user: Profile = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    data = schema.model_dump()
    data["user_id"] = current_user.id
    return await assignment_repo.create(db, obj_in=data)

@router.put("/{assignment_id}", response_model=AssignmentOut)
async def update_assignment(
    assignment_id: UUID,
    schema: AssignmentUpdate,
    current_user: Profile = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    assignment = await assignment_repo.get(db, assignment_id)
    if not assignment or assignment.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Assignment not found")
    return await assignment_repo.update(db, db_obj=assignment, obj_in=schema.model_dump(exclude_unset=True))

@router.delete("/{assignment_id}", response_model=AssignmentOut)
async def delete_assignment(
    assignment_id: UUID,
    current_user: Profile = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    assignment = await assignment_repo.get(db, assignment_id)
    if not assignment or assignment.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Assignment not found")
    await assignment_repo.remove(db, id=assignment_id)
    return assignment

@router.get("/prioritized")
async def get_prioritized_assignments(
    current_user: Profile = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    assignments = await assignment_repo.get_by_user(db, current_user.id, is_done=False)
    now = datetime.now(timezone.utc)
    
    prioritized_list = []
    for ass in assignments:
        due = ass.due_date
        # Convert due to timezone-aware if needed
        if due.tzinfo is None:
            due = due.replace(tzinfo=timezone.utc)
            
        time_diff = due - now
        days_left = time_diff.total_seconds() / 86400.0
        
        # Priority weight
        p_weight = 50 if ass.priority == "high" else (25 if ass.priority == "medium" else 0)
        
        # Calculate urgency score (higher is more urgent)
        # Avoid division by zero
        denom = max(days_left, 0.01)
        urgency_score = (100.0 / (denom + 0.5)) + p_weight
        
        # Urgency Indicator
        if days_left <= 1.0 or urgency_score >= 80:
            indicator = "Critical"
        elif days_left <= 3.0 or urgency_score >= 50:
            indicator = "High"
        elif days_left <= 7.0 or urgency_score >= 20:
            indicator = "Medium"
        else:
            indicator = "Low"
            
        prioritized_list.append({
            "id": ass.id,
            "title": ass.title,
            "due_date": ass.due_date,
            "priority": ass.priority,
            "progress_percentage": ass.progress_percentage,
            "subject_id": ass.subject_id,
            "days_left": round(days_left, 1),
            "urgency_score": round(urgency_score, 1),
            "urgency_indicator": indicator
        })
        
    # Sort descending by urgency score
    prioritized_list.sort(key=lambda x: x["urgency_score"], reverse=True)
    return prioritized_list
