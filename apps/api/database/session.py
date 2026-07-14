from typing import AsyncGenerator
import urllib.parse
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from sqlalchemy.orm import declarative_base
from ..core.config import settings

# ==========================================
# SAFELY PARSE DATABASE URL FOR PRODUCTION
# ==========================================
raw_url = settings.DATABASE_URL

# Fast safety fallback: Explicitly convert to asyncpg driver syntax if needed
if raw_url.startswith("postgresql://"):
    raw_url = raw_url.replace("postgresql://", "postgresql+asyncpg://", 1)

# Fix for the '@' symbol in passwords (e.g., shairya@150307)
if "://" in raw_url and raw_url.count("@") > 1:
    try:
        scheme, remainder = raw_url.split("://", 1)
        auth_chunk, host_chunk = remainder.rsplit("@", 1)
        
        if ":" in auth_chunk:
            username, password = auth_chunk.split(":", 1)
            # URL encode the password safely (converts '@' to '%40')
            safe_password = urllib.parse.quote_plus(password)
            raw_url = f"{scheme}://{username}:{safe_password}@{host_chunk}"
    except Exception:
        pass

# Safely append PgBouncer pooling parameters to the URL query string to prevent crashes
# This bypasses the unexpected keyword argument error in asyncpg
separator = "&" if "?" in raw_url else "?"
raw_url = f"{raw_url}{separator}prepared_threshold=0&statement_cache_size=0"

# ==========================================
# ASYNC ENGINE INITIALIZATION
# ==========================================
engine = create_async_engine(
    raw_url,
    echo=False,
    future=True,
    pool_pre_ping=True,  # Disconnect protection
    pool_size=10,
    max_overflow=20
)

# Async session maker
async_session = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autocommit=False,
    autoflush=False
)

Base = declarative_base()

# Database Dependency Injection yield
async def get_db() -> AsyncGenerator[AsyncSession, None]:
    async with async_session() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()
            