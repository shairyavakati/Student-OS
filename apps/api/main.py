import os
import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .core.config import settings
from .database.session import Base, engine

# Import routers
from .api import (
    auth,
    profile,
    subjects,
    timetable,
    notes,
    assignments,
    attendance,
    analytics,
    calendar,
    ai,
    groups,
)

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="The AI-Powered Academic Operating System for Students",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# =====================================================
# CORS CONFIGURATION
# =====================================================

origins = [
    "https://student-os-web-tawny.vercel.app",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

extra_origins = os.getenv("ALLOWED_ORIGINS")

if extra_origins:
    for origin in extra_origins.split(","):
        origin = origin.strip()
        if origin and origin not in origins:
            origins.append(origin)

print("Allowed Origins:", origins)

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =====================================================
# ROUTERS
# =====================================================

app.include_router(
    auth.router,
    prefix=f"{settings.API_V1_STR}/auth",
    tags=["Authentication"],
)

app.include_router(
    profile.router,
    prefix=f"{settings.API_V1_STR}/profile",
    tags=["Student Profiles"],
)

app.include_router(
    subjects.router,
    prefix=f"{settings.API_V1_STR}/subjects",
    tags=["Subjects"],
)

app.include_router(
    timetable.router,
    prefix=f"{settings.API_V1_STR}/timetable",
    tags=["Timetable"],
)

app.include_router(
    notes.router,
    prefix=f"{settings.API_V1_STR}/notes",
    tags=["Notes"],
)

app.include_router(
    assignments.router,
    prefix=f"{settings.API_V1_STR}/assignments",
    tags=["Assignments"],
)

app.include_router(
    attendance.router,
    prefix=f"{settings.API_V1_STR}/attendance",
    tags=["Attendance"],
)

app.include_router(
    analytics.router,
    prefix=f"{settings.API_V1_STR}/analytics",
    tags=["Analytics"],
)

app.include_router(
    calendar.router,
    prefix=f"{settings.API_V1_STR}/calendar",
    tags=["Calendar"],
)

app.include_router(
    ai.router,
    prefix=f"{settings.API_V1_STR}/ai",
    tags=["AI"],
)

app.include_router(
    groups.router,
    prefix=f"{settings.API_V1_STR}/groups",
    tags=["Groups"],
)

# =====================================================
# ROOT
# =====================================================

@app.get("/")
async def root():
    return {
        "status": "healthy",
        "app": settings.PROJECT_NAME,
        "docs": "/docs",
    }

# =====================================================
# STARTUP
# =====================================================

@app.on_event("startup")
async def startup_event():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    print("Database connected successfully.")
    print("Application startup completed.")

# =====================================================
# LOCAL RUN
# =====================================================

if __name__ == "__main__":
    uvicorn.run(
        "apps.api.main:app",
        host="0.0.0.0",
        port=int(os.getenv("PORT", 8000)),
        reload=True,
    )
    