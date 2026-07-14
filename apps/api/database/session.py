from typing import AsyncGenerator
import urllib.parse
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from sqlalchemy.orm import declarative_base

# ==========================================
# DIRECT CONNECTION TO SUPABASE (PORT 5432)
# ==========================================
# This completely bypasses PgBouncer/Supavisor parsing errors
DB_USER = "postgres"  # Standard username for direct connection
DB_PASS = "Shairya@150307"
DB_HOST = "db.ymmvlncvpagxebjgqoya.supabase.co"  # Direct Supabase host
DB_PORT = "5432"  # Direct Postgres port
DB_NAME = "postgres"

# URL-encode the password to safely handle the '@' symbol
encoded_pass = urllib.parse.quote_plus(DB_PASS)

# Construct the clean direct connection string
raw_url = f"postgresql+asyncpg://{DB_USER}:{encoded_pass}@{DB_HOST}:{DB_PORT}/{DB_NAME}"

# ==========================================
# ASYNC ENGINE INITIALIZATION
# ==========================================
engine = create_async_engine(
    raw_url,
    echo=False,
    future=True,
    pool_pre_ping=True,
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