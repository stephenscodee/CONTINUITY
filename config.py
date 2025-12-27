from pydantic_settings import BaseSettings
from typing import List

class Settings(BaseSettings):
    PROJECT_NAME: str = "Mapa Vivo de Procesos"
    BACKEND_CORS_ORIGINS: List[str] = ["http://localhost:5173"]
    SECRET_KEY: str = "change-me-in-prod"
    DATABASE_URL: str = "sqlite:///./dev.db"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()
