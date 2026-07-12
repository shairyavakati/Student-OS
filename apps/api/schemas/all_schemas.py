from pydantic import BaseModel, EmailStr, Field
from typing import List, Optional
from datetime import datetime, time, date
from uuid import UUID

# ─── AUTH SCHEMAS ─────────────────────────────────────────────────────────────

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserSignup(BaseModel):
    email: EmailStr
    password: str
    full_name: str
    semester: Optional[int] = 1
    department: Optional[str] = None

class Token(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"

class TokenData(BaseModel):
    user_id: Optional[str] = None

# ─── PROFILE SCHEMAS ──────────────────────────────────────────────────────────

class ProfileBase(BaseModel):
    full_name: str
    semester: int
    department: Optional[str] = None
    avatar_url: Optional[str] = None

class ProfileUpdate(BaseModel):
    full_name: Optional[str] = None
    semester: Optional[int] = None
    department: Optional[str] = None
    avatar_url: Optional[str] = None

class ProfileOut(ProfileBase):
    id: UUID
    email: EmailStr
    created_at: datetime

    class Config:
        from_attributes = True

# ─── SUBJECT SCHEMAS ──────────────────────────────────────────────────────────

class SubjectBase(BaseModel):
    name: str
    code: str
    color: str
    room: Optional[str] = None
    professor: Optional[str] = None

class SubjectCreate(SubjectBase):
    pass

class SubjectOut(SubjectBase):
    id: UUID
    user_id: UUID

    class Config:
        from_attributes = True

# ─── TIMETABLE SCHEMAS ────────────────────────────────────────────────────────

class TimetableSlotBase(BaseModel):
    subject_id: UUID
    day_of_week: str = Field(..., max_length=3) # e.g. "Mon"
    start_time: time
    end_time: time
    class_type: str # e.g. "Lecture", "Lab", "Tutorial"
    room: Optional[str] = None

class TimetableSlotCreate(TimetableSlotBase):
    pass

class TimetableSlotOut(TimetableSlotBase):
    id: UUID
    user_id: UUID
    subject: Optional[SubjectOut] = None

    class Config:
        from_attributes = True

# ─── NOTE SCHEMAS ─────────────────────────────────────────────────────────────

class NoteBase(BaseModel):
    subject_id: Optional[UUID] = None
    title: str
    content: str
    folder_name: Optional[str] = "General"
    is_pinned: Optional[bool] = False
    tags: Optional[List[str]] = []

class NoteCreate(NoteBase):
    pass

class NoteUpdate(BaseModel):
    subject_id: Optional[UUID] = None
    title: Optional[str] = None
    content: Optional[str] = None
    folder_name: Optional[str] = None
    is_pinned: Optional[bool] = None
    tags: Optional[List[str]] = None

class NoteOut(NoteBase):
    id: UUID
    user_id: UUID
    words_count: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# ─── ASSIGNMENT SCHEMAS ───────────────────────────────────────────────────────

class AssignmentBase(BaseModel):
    subject_id: Optional[UUID] = None
    title: str
    due_date: datetime
    priority: str = "medium" # low, medium, high
    is_done: Optional[bool] = False
    progress_percentage: Optional[int] = 0

class AssignmentCreate(AssignmentBase):
    pass

class AssignmentUpdate(BaseModel):
    subject_id: Optional[UUID] = None
    title: Optional[str] = None
    due_date: Optional[datetime] = None
    priority: Optional[str] = None
    is_done: Optional[bool] = None
    progress_percentage: Optional[int] = None

class AssignmentOut(AssignmentBase):
    id: UUID
    user_id: UUID

    class Config:
        from_attributes = True

# ─── ATTENDANCE SCHEMAS ───────────────────────────────────────────────────────

class AttendanceBase(BaseModel):
    subject_id: UUID
    attended_count: int = 0
    total_count: int = 0

class AttendanceCreate(AttendanceBase):
    pass

class AttendanceUpdate(BaseModel):
    attended_count: Optional[int] = None
    total_count: Optional[int] = None

class AttendanceOut(AttendanceBase):
    id: UUID
    user_id: UUID

    class Config:
        from_attributes = True

# ─── CALENDAR EVENT SCHEMAS ───────────────────────────────────────────────────

class CalendarEventBase(BaseModel):
    event_type: str # assignment, exam, event, study_session
    label: str
    event_date: date
    description: Optional[str] = None

class CalendarEventCreate(CalendarEventBase):
    pass

class CalendarEventOut(CalendarEventBase):
    id: UUID
    user_id: UUID

    class Config:
        from_attributes = True

# ─── COLLABORATIVE GROUP SCHEMAS ──────────────────────────────────────────────

class StudyGroupBase(BaseModel):
    name: str
    description: Optional[str] = None

class StudyGroupCreate(StudyGroupBase):
    pass

class StudyGroupOut(StudyGroupBase):
    id: UUID
    creator_id: UUID
    created_at: datetime

    class Config:
        from_attributes = True

class StudyGroupMemberOut(BaseModel):
    id: UUID
    group_id: UUID
    user_id: UUID
    role: str
    joined_at: datetime

    class Config:
        from_attributes = True
