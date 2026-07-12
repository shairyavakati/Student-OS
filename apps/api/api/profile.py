from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from ..database.session import get_db
from ..dependencies.auth import get_current_user
from ..models.all_models import Profile
from ..schemas.all_schemas import ProfileOut, ProfileUpdate
from ..repositories.all_repositories import user_repo

router = APIRouter()

@router.get("/me", response_model=ProfileOut)
async def read_current_profile(current_user: Profile = Depends(get_current_user)):
    return current_user

@router.put("/me", response_model=ProfileOut)
async def update_current_profile(
    schema: ProfileUpdate,
    current_user: Profile = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    updated = await user_repo.update(db, db_obj=current_user, obj_in=schema)
    return updated
