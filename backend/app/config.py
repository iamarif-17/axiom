from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    gemini_api_key: str = ""
    github_client_id: str = ""
    github_client_secret: str = ""
    secret_key: str = "dev-secret-key"
    database_url: str = "sqlite:///./axiom.db"
    allowed_origins: str = "http://localhost:5173"

    class Config:
        env_file = ".env"

settings = Settings()