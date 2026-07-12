from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from uuid import UUID

from database.session import get_db
from dependencies.auth import get_current_user
from models.all_models import Profile
from schemas.all_schemas import NoteOut, NoteCreate, NoteUpdate
from repositories.all_repositories import note_repo

router = APIRouter()

@router.get("", response_model=List[NoteOut])
async def read_notes(
    folder: Optional[str] = Query(None),
    q: Optional[str] = Query(None),
    current_user: Profile = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    notes = await note_repo.get_by_user(db, current_user.id, folder=folder)
    if q:
        notes = [n for n in notes if q.lower() in n.title.lower() or q.lower() in n.content.lower()]
    return notes

@router.post("", response_model=NoteOut, status_code=status.HTTP_201_CREATED)
async def create_note(
    schema: NoteCreate,
    current_user: Profile = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    data = schema.model_dump()
    data["user_id"] = current_user.id
    # Calculate word count
    data["words_count"] = len(schema.content.split()) if schema.content else 0
    return await note_repo.create(db, obj_in=data)

@router.put("/{note_id}", response_model=NoteOut)
async def update_note(
    note_id: UUID,
    schema: NoteUpdate,
    current_user: Profile = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    note = await note_repo.get(db, note_id)
    if not note or note.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Note not found")
        
    data = schema.model_dump(exclude_unset=True)
    if "content" in data:
        data["words_count"] = len(data["content"].split()) if data["content"] else 0
        
    return await note_repo.update(db, db_obj=note, obj_in=data)

@router.delete("/{note_id}", response_model=NoteOut)
async def delete_note(
    note_id: UUID,
    current_user: Profile = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    note = await note_repo.get(db, note_id)
    if not note or note.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Note not found")
    await note_repo.remove(db, id=note_id)
    return note
