import os
from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import Field

class Settings(BaseSettings):
    PROJECT_NAME: str = "StudentOS API"
    API_V1_STR: str = "/api/v1"
    
    # Database
    DATABASE_URL: str = Field(
        default="postgresql+asyncpg://postgres:postgres@localhost:5432/postgres",
        validation_alias="DATABASE_URL"
    )
    
    # JWT Security
    JWT_SECRET: str = Field(
        default="SUPER_SECRET_STUDENT_OS_KEY_DO_NOT_SHARE_ChangeMePlease123!",
        validation_alias="JWT_SECRET"
    )
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    
    # External AI APIs
    OPENAI_API_KEY: str = Field(default="mock-key", validation_alias="OPENAI_API_KEY")
    OPENAI_API_BASE: str = "https://api.openai.com/v1"
    
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )

settings = Settings()
