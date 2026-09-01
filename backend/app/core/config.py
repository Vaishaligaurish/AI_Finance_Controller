from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    API_V1_STR: str = "/api"
    DATABASE_URL: str = "sqlite:///./finance_controller.db"
    
    class Config:
        env_file = ".env"

settings = Settings()
