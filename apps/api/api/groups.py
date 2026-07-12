from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from uuid import UUID

from database.session import get_db
from dependencies.auth import get_current_user
from models.all_models import Profile, StudyGroup, StudyGroupMember
from schemas.all_schemas import StudyGroupOut, StudyGroupCreate, StudyGroupMemberOut

router = APIRouter()

@router.get("", response_model=List[StudyGroupOut])
async def get_study_groups(
    current_user: Profile = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    # Fetch all study groups the user is part of
    from sqlalchemy import select
    query = select(StudyGroup).join(StudyGroupMember, StudyGroupMember.group_id == StudyGroup.id).where(StudyGroupMember.user_id == current_user.id)
    res = await db.execute(query)
    return list(res.scalars().all())

@router.post("", response_model=StudyGroupOut, status_code=status.HTTP_201_CREATED)
async def create_study_group(
    schema: StudyGroupCreate,
    current_user: Profile = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    group_data = schema.model_dump()
    group_data["creator_id"] = current_user.id
    
    group = StudyGroup(**group_data)
    db.add(group)
    await db.flush()
    
    # Add creator as group admin/member
    member = StudyGroupMember(
        group_id=group.id,
        user_id=current_user.id,
        role="creator"
    )
    db.add(member)
    await db.flush()
    
    return group

@router.post("/{group_id}/invite", response_model=StudyGroupMemberOut)
async def invite_member(
    group_id: UUID,
    invitee_email: str,
    current_user: Profile = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    # Check if group exists and current user is member
    from sqlalchemy import select
    from models.all_models import Profile as ProfileModel
    
    group = await db.get(StudyGroup, group_id)
    if not group:
        raise HTTPException(status_code=404, detail="Study group not found")
        
    # Check if inviter is a member
    query = select(StudyGroupMember).where(StudyGroupMember.group_id == group_id, StudyGroupMember.user_id == current_user.id)
    res = await db.execute(query)
    if not res.scalar_one_or_none():
        raise HTTPException(status_code=403, detail="You must be a member of the group to invite others")
        
    # Find invitee
    user_query = select(ProfileModel).where(ProfileModel.email == invitee_email)
    user_res = await db.execute(user_query)
    invitee = user_res.scalar_one_or_none()
    if not invitee:
        raise HTTPException(status_code=404, detail="Invited student user profile not found")
        
    # Check if already a member
    mem_query = select(StudyGroupMember).where(StudyGroupMember.group_id == group_id, StudyGroupMember.user_id == invitee.id)
    mem_res = await db.execute(mem_query)
    if mem_res.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="User is already a member of this group")
        
    new_member = StudyGroupMember(
        group_id=group_id,
        user_id=invitee.id,
        role="member"
    )
    db.add(new_member)
    await db.flush()
    return new_member
