import math
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from uuid import UUID

from ..database.session import get_db
from ..dependencies.auth import get_current_user
from ..models.all_models import Profile
from ..schemas.all_schemas import AttendanceOut, AttendanceCreate, AttendanceUpdate
from ..repositories.all_repositories import attendance_repo, subject_repo

router = APIRouter()

@router.get("", response_model=List[AttendanceOut])
async def read_attendance(
    current_user: Profile = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    return await attendance_repo.get_by_user(db, current_user.id)

@router.post("", response_model=AttendanceOut, status_code=status.HTTP_201_CREATED)
async def create_or_update_attendance(
    schema: AttendanceCreate,
    current_user: Profile = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    existing = await attendance_repo.get_by_subject(db, current_user.id, schema.subject_id)
    if existing:
        return await attendance_repo.update(db, db_obj=existing, obj_in=schema)
    data = schema.model_dump()
    data["user_id"] = current_user.id
    return await attendance_repo.create(db, obj_in=data)

@router.put("/{attendance_id}", response_model=AttendanceOut)
async def update_attendance(
    attendance_id: UUID,
    schema: AttendanceUpdate,
    current_user: Profile = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    attendance = await attendance_repo.get(db, attendance_id)
    if not attendance or attendance.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Attendance record not found")
    return await attendance_repo.update(db, db_obj=attendance, obj_in=schema.model_dump(exclude_unset=True))

@router.get("/prediction")
async def get_attendance_predictions(
    target_percentage: Optional[float] = Query(75.0),
    current_user: Profile = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    records = await attendance_repo.get_by_user(db, current_user.id)
    target = target_percentage / 100.0
    
    predictions = []
    for rec in records:
        subject = await subject_repo.get(db, rec.subject_id)
        sub_name = subject.name if subject else "Unknown"
        
        attended = rec.attended_count
        total = rec.total_count
        
        pct = (attended / total * 100.0) if total > 0 else 0.0
        
        # Risk Classifications
        if pct >= 80.0:
            status = "Safe"
        elif pct >= 75.0:
            status = "Warning"
        else:
            status = "Critical"
            
        classes_to_attend = 0
        classes_to_skip = 0
        
        if total > 0:
            if pct < target_percentage:
                # X >= (target * total - attended) / (1 - target)
                val = (target * total - attended) / (1 - target)
                classes_to_attend = max(0, math.ceil(val))
            else:
                # Y <= (attended / target) - total
                val = (attended / target) - total
                classes_to_skip = max(0, math.floor(val))
                
        predictions.append({
            "subject_id": rec.subject_id,
            "subject_name": sub_name,
            "attended": attended,
            "total": total,
            "percentage": round(pct, 1),
            "status": status,
            "classes_to_attend": classes_to_attend,
            "classes_to_skip": classes_to_skip,
            "advice": f"You must attend the next {classes_to_attend} classes to reach {target_percentage}%." if pct < target_percentage else f"You can safely skip the next {classes_to_skip} classes without dropping below {target_percentage}%."
        })
        
    return {
        "target_percentage": target_percentage,
        "predictions": predictions
    }
