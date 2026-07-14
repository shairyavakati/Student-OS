from typing import AsyncGenerator
import urllib.parse
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from sqlalchemy.orm import declarative_base

# ===================================================
# IPV4 POOLER - SESSION MODE (PORT 5432)
# ===================================================
DB_USER = "postgres.ymmvlncvpagxebjgqoya"  # Complete pooler username
DB_PASS = "Shairya@150307"                 # Your password
DB_HOST = "aws-0-ap-southeast-1.pooler.supabase.com"
DB_PORT = "5432"                           # Port 5432 = Session Mode (No prepared statement errors!)
DB_NAME = "postgres"

# Safely encode the password to handle the '@' symbol
encoded_pass = urllib.parse.quote_plus(DB_PASS)

# Construct a standard, clean connection string
raw_url = f"postgresql+asyncpg://{DB_USER}:{encoded_pass}@{DB_HOST}:{DB_PORT}/{DB_NAME}"

# Initialize the engine (no tricky connect_args needed!)
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