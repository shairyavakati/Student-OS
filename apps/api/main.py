import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .core.config import settings
from .database.session import Base, engine

# Import routers
from .api import auth, profile, subjects, timetable, notes, assignments, attendance, analytics, calendar, ai, groups

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="The AI-Powered Academic Operating System for Students - Backend Services",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS configuration
# Allows local dev servers and any Vercel deployment
import os

ALLOWED_ORIGINS = os.getenv("ALLOWED_ORIGINS", "")
if ALLOWED_ORIGINS:
    origins = [o.strip() for o in ALLOWED_ORIGINS.split(",")]
else:
    origins = [
        "http://localhost:3000",
        "http://localhost:5173",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:5173",
    ]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # allow all — restrict via ALLOWED_ORIGINS env var in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API V1 Routers
app.include_router(auth.router, prefix=f"{settings.API_V1_STR}/auth", tags=["Authentication"])
app.include_router(profile.router, prefix=f"{settings.API_V1_STR}/profile", tags=["Student Profiles"])
app.include_router(subjects.router, prefix=f"{settings.API_V1_STR}/subjects", tags=["Subjects"])
app.include_router(timetable.router, prefix=f"{settings.API_V1_STR}/timetable", tags=["Timetable Schedule"])
app.include_router(notes.router, prefix=f"{settings.API_V1_STR}/notes", tags=["Notes Editor"])
app.include_router(assignments.router, prefix=f"{settings.API_V1_STR}/assignments", tags=["Assignments & Tasks"])
app.include_router(attendance.router, prefix=f"{settings.API_V1_STR}/attendance", tags=["Attendance Tracker"])
app.include_router(analytics.router, prefix=f"{settings.API_V1_STR}/analytics", tags=["Study Analytics"])
app.include_router(calendar.router, prefix=f"{settings.API_V1_STR}/calendar", tags=["Calendar integration"])
app.include_router(ai.router, prefix=f"{settings.API_V1_STR}/ai", tags=["AI Advanced Features"])
app.include_router(groups.router, prefix=f"{settings.API_V1_STR}/groups", tags=["Collaboration Study Groups"])

@app.get("/")
def read_root():
    return {
        "status": "healthy",
        "app": settings.PROJECT_NAME,
        "docs_url": "/docs"
    }

# Automatic database tables initialization for testing convenience
@app.on_event("startup")
async def startup_event():
    async with engine.begin() as conn:
        # Create all tables if they don't exist
        await conn.run_sync(Base.metadata.create_all)
        print("SQLAlchemy Base ORM tables initialized successfully.")

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
