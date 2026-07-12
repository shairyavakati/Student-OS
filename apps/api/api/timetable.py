from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from uuid import UUID

from ..database.session import get_db
from ..dependencies.auth import get_current_user
from ..models.all_models import Profile
from ..schemas.all_schemas import TimetableSlotOut, TimetableSlotCreate
from ..repositories.all_repositories import timetable_repo

router = APIRouter()

@router.get("", response_model=List[TimetableSlotOut])
async def read_timetable(
    current_user: Profile = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    slots = await timetable_repo.get_by_user(db, current_user.id)
    return slots

@router.post("", response_model=TimetableSlotOut, status_code=status.HTTP_201_CREATED)
async def create_timetable_slot(
    schema: TimetableSlotCreate,
    current_user: Profile = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    data = schema.model_dump()
    data["user_id"] = current_user.id
    return await timetable_repo.create(db, obj_in=data)

@router.delete("/{slot_id}", response_model=TimetableSlotOut)
async def delete_timetable_slot(
    slot_id: UUID,
    current_user: Profile = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    slot = await timetable_repo.get(db, slot_id)
    if not slot or slot.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Slot not found")
    await timetable_repo.remove(db, id=slot_id)
    return slot
