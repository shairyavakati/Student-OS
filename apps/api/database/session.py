from typing import AsyncGenerator

from sqlalchemy.ext.asyncio import (
    AsyncSession,
    async_sessionmaker,
    create_async_engine,
)
from sqlalchemy.orm import declarative_base

from apps.api.core.config import settings

# ===================================================
# DATABASE ENGINE
# ===================================================

# Temporary debug (remove after deployment succeeds)
safe_url = settings.DATABASE_URL
if "@" in safe_url and "://" in safe_url:
    prefix, rest = safe_url.split("://", 1)
    if "@" in rest:
        creds, host = rest.split("@", 1)
        if ":" in creds:
            user, _ = creds.split(":", 1)
            safe_url = f"{prefix}://{user}:*****@{host}"

print(f"DATABASE_URL: {safe_url}")

engine = create_async_engine(
    settings.DATABASE_URL,
    echo=False,
    future=True,
    pool_pre_ping=True,
    pool_size=10,
    max_overflow=20,
)

# ===================================================
# SESSION
# ===================================================

async_session = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autoflush=False,
)

Base = declarative_base()

# ===================================================
# DATABASE DEPENDENCY
# ===================================================

async def get_db() -> AsyncGenerator[AsyncSession, None]:
    async with async_session() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise