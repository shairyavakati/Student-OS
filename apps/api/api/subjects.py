from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from uuid import UUID

from database.session import get_db
from dependencies.auth import get_current_user
from models.all_models import Profile
from schemas.all_schemas import SubjectOut, SubjectCreate
from repositories.all_repositories import subject_repo

router = APIRouter()

@router.get("", response_model=List[SubjectOut])
async def read_subjects(
    current_user: Profile = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    return await subject_repo.get_by_user(db, current_user.id)

@router.post("", response_model=SubjectOut, status_code=status.HTTP_201_CREATED)
async def create_subject(
    schema: SubjectCreate,
    current_user: Profile = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    data = schema.model_dump()
    data["user_id"] = current_user.id
    return await subject_repo.create(db, obj_in=data)

@router.delete("/{subject_id}", response_model=SubjectOut)
async def delete_subject(
    subject_id: UUID,
    current_user: Profile = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    subject = await subject_repo.get(db, subject_id)
    if not subject or subject.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Subject not found")
    await subject_repo.remove(db, id=subject_id)
    return subject
