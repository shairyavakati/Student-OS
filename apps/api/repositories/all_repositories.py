from typing import List, Optional
from uuid import UUID
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from .base_repository import BaseRepository
from ..models.all_models import Profile, Subject, TimetableSlot, Note, Assignment, AttendanceRecord, CalendarEvent, StudyGroup, StudyGroupMember

class UserRepository(BaseRepository[Profile]):
    def __init__(self):
        super().__init__(Profile)
        
    async def get_by_email(self, db: AsyncSession, email: str) -> Optional[Profile]:
        query = select(Profile).where(Profile.email == email, Profile.deleted_at.is_(None))
        res = await db.execute(query)
        return res.scalar_one_or_none()

class SubjectRepository(BaseRepository[Subject]):
    def __init__(self):
        super().__init__(Subject)

    async def get_by_user(self, db: AsyncSession, user_id: UUID) -> List[Subject]:
        query = select(Subject).where(Subject.user_id == user_id, Subject.deleted_at.is_(None))
        res = await db.execute(query)
        return list(res.scalars().all())

class TimetableRepository(BaseRepository[TimetableSlot]):
    def __init__(self):
        super().__init__(TimetableSlot)

    async def get_by_user(self, db: AsyncSession, user_id: UUID) -> List[TimetableSlot]:
        query = select(TimetableSlot).where(TimetableSlot.user_id == user_id, TimetableSlot.deleted_at.is_(None))
        res = await db.execute(query)
        return list(res.scalars().all())

class NotesRepository(BaseRepository[Note]):
    def __init__(self):
        super().__init__(Note)

    async def get_by_user(self, db: AsyncSession, user_id: UUID, folder: Optional[str] = None) -> List[Note]:
        query = select(Note).where(Note.user_id == user_id, Note.deleted_at.is_(None))
        if folder:
            query = query.where(Note.folder_name == folder)
        res = await db.execute(query)
        return list(res.scalars().all())

class AssignmentRepository(BaseRepository[Assignment]):
    def __init__(self):
        super().__init__(Assignment)

    async def get_by_user(self, db: AsyncSession, user_id: UUID, is_done: Optional[bool] = None) -> List[Assignment]:
        query = select(Assignment).where(Assignment.user_id == user_id, Assignment.deleted_at.is_(None))
        if is_done is not None:
            query = query.where(Assignment.is_done == is_done)
        res = await db.execute(query)
        return list(res.scalars().all())

class AttendanceRepository(BaseRepository[AttendanceRecord]):
    def __init__(self):
        super().__init__(AttendanceRecord)

    async def get_by_user(self, db: AsyncSession, user_id: UUID) -> List[AttendanceRecord]:
        query = select(AttendanceRecord).where(AttendanceRecord.user_id == user_id, AttendanceRecord.deleted_at.is_(None))
        res = await db.execute(query)
        return list(res.scalars().all())

    async def get_by_subject(self, db: AsyncSession, user_id: UUID, subject_id: UUID) -> Optional[AttendanceRecord]:
        query = select(AttendanceRecord).where(
            AttendanceRecord.user_id == user_id, 
            AttendanceRecord.subject_id == subject_id,
            AttendanceRecord.deleted_at.is_(None)
        )
        res = await db.execute(query)
        return res.scalar_one_or_none()

class CalendarEventRepository(BaseRepository[CalendarEvent]):
    def __init__(self):
        super().__init__(CalendarEvent)

    async def get_by_user(self, db: AsyncSession, user_id: UUID) -> List[CalendarEvent]:
        query = select(CalendarEvent).where(CalendarEvent.user_id == user_id, CalendarEvent.deleted_at.is_(None))
        res = await db.execute(query)
        return list(res.scalars().all())

# Instantiate repositories
user_repo = UserRepository()
subject_repo = SubjectRepository()
timetable_repo = TimetableRepository()
note_repo = NotesRepository()
assignment_repo = AssignmentRepository()
attendance_repo = AttendanceRepository()
calendar_repo = CalendarEventRepository()
