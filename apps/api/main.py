import os
import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .core.config import settings
from .database.session import Base, engine

# Import routers
from .api import (
    auth, profile, subjects, timetable, notes, 
    assignments, attendance, analytics, calendar, ai, groups
)

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="The AI-Powered Academic Operating System for Students - Backend Services",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# ==========================================
# SAFE CORS CONFIGURATION
# ==========================================
# Dynamically pull production frontend origins from environment variables
env_origins = os.getenv("ALLOWED_ORIGINS", "")

if env_origins:
    # Split by comma and remove whitespace. 
    # Example: "https://myfrontend.vercel.app, http://localhost:3000"
    origins = [o.strip() for o in env_origins.split(",") if o.strip()]
else:
    # Local fallback origins for development
    origins = [
        "http://localhost:3000",   # Next.js / React default
        "http://localhost:5173",   # Vite default
        "http://127.0.0.1:3000",
        "http://127.0.0.1:5173",
    ]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,   
    allow_credentials=True,  # Mandatory if using HttpOnly cookies or Authorization headers
    allow_methods=["*"],     # Allows GET, POST, PUT, DELETE, OPTIONS, etc.
    allow_headers=["*"],     # Allows all custom/standard incoming headers
)

# ==========================================
# ROUTER INCLUSIONS (V1 API)
# ==========================================
# Note: Ensure your frontend hits the full path: 
# BASE_URL + API_V1_STR + "/auth/signup" (e.g., http://localhost:8000/api/v1/auth/signup)
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

# ==========================================
# DATABASE STARTUP LIFECYCLE
# ==========================================
@app.on_event("startup")
async def startup_event():
    async with engine.begin() as conn:
        # Automatically safely spin up database tables asynchronously if missing
        await conn.run_sync(Base.metadata.create_all)
        print("SQLAlchemy Base ORM tables initialized successfully.")


if __name__ == "__main__":
    uvicorn.run(
        "apps.api.main:app",
        host="0.0.0.0",
        port=int(os.getenv("PORT", "8000")),
        reload=True  # Helpful for presentations to hot-reload code if a bug pops up
    )