from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from uuid import UUID

from ..database.session import get_db
from ..core.security import get_password_hash, verify_password, create_access_token, create_refresh_token, decode_token
from ..repositories.all_repositories import user_repo
from ..schemas.all_schemas import UserSignup, UserLogin, Token, ProfileOut
from ..dependencies.auth import get_current_user
from ..models.all_models import Profile

router = APIRouter()

@router.post("/signup", response_model=ProfileOut, status_code=status.HTTP_201_CREATED)
async def signup(schema: UserSignup, db: AsyncSession = Depends(get_db)):
    existing_user = await user_repo.get_by_email(db, schema.email)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A user with this email already exists"
        )

    hashed_pass = get_password_hash(schema.password)
    db_obj = Profile(
        full_name=schema.full_name,
        email=schema.email,
        semester=schema.semester,
        department=schema.department,
        avatar_url="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150",
        hashed_password=hashed_pass,
    )
    db.add(db_obj)
    await db.commit()
    await db.refresh(db_obj)

    return db_obj

@router.post("/login", response_model=Token)
async def login(schema: UserLogin, db: AsyncSession = Depends(get_db)):
    user = await user_repo.get_by_email(db, schema.email)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )

    if not user.hashed_password or not verify_password(schema.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )

    access = create_access_token(user.id)
    refresh = create_refresh_token(user.id)
    return Token(access_token=access, refresh_token=refresh)

@router.post("/refresh", response_model=Token)
async def refresh_token(refresh_token: str, db: AsyncSession = Depends(get_db)):
    payload = decode_token(refresh_token)
    if not payload or payload.get("type") != "refresh":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid refresh token"
        )

    user_id = payload.get("sub")
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token missing user information"
        )

    user = await user_repo.get(db, UUID(user_id))
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

    access = create_access_token(user.id)
    new_refresh = create_refresh_token(user.id)
    return Token(access_token=access, refresh_token=new_refresh)

@router.get("/me", response_model=ProfileOut)
async def get_me(current_user: Profile = Depends(get_current_user)):
    return current_user
