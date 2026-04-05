import logging

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes.text_routes import router as text_router
from app.api.routes.phishing_routes import router as phishing_router
from app.api.routes.url_routes import router as url_router
from app.api.routes.auth_routes import router as auth_router
from app.api.routes.report_routes import router as report_router
from app.db.database import Base, engine
from app.models.user import User

Base.metadata.create_all(bind=engine)

# FIX: app must be defined BEFORE any @app decorators
app = FastAPI(title="Scam Shield AI")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routes
app.include_router(auth_router)
app.include_router(text_router)
app.include_router(phishing_router)
app.include_router(url_router)
app.include_router(report_router)


# FIX: Startup validator placed AFTER app is defined and imports are at the top
@app.on_event("startup")
async def validate_env():
    from app.config.settings import OPENAI_API_KEY, GOOGLE_API_KEY, VIRUSTOTAL_API_KEY, SECRET_KEY
    missing = []
    if not OPENAI_API_KEY:
        missing.append("OPENAI_API_KEY")
    if not GOOGLE_API_KEY:
        missing.append("GOOGLE_API_KEY")
    if not VIRUSTOTAL_API_KEY:
        missing.append("VIRUSTOTAL_API_KEY")
    if not SECRET_KEY or SECRET_KEY == "dev-secret":
        logging.warning("SECRET_KEY is using the insecure default. Set a strong key in .env")
    if missing:
        logging.warning(
            f"Missing environment variables: {missing}. Affected features will degrade gracefully."
        )


@app.get("/")
def root():
    return {"message": "Scam Shield AI Backend Running"}