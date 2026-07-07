"""
ScoutAI Backend - FastAPI Application Entry Point

Main application factory with middleware, routers, and lifecycle management.
"""

from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from loguru import logger

from app.core import get_settings
from app.core.database import init_db, close_db
from app.modules.auth.router import router as auth_router
from app.modules.players.router import router as players_router
from app.modules.ai.router import router as ai_router



@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifecycle: startup and shutdown events."""
    settings = get_settings()
    logger.info(f"🚀 Starting {settings.APP_NAME} v{settings.APP_VERSION}")
    logger.info(f"📊 Debug mode: {settings.DEBUG}")

    # Initialize database tables (development only)
    if settings.DEBUG:
        await init_db()
        logger.info("✅ Database tables created/verified")

    yield

    # Cleanup
    await close_db()
    logger.info("👋 Application shutdown complete")


def create_app() -> FastAPI:
    """Create and configure the FastAPI application."""
    settings = get_settings()

    app = FastAPI(
        title=settings.APP_NAME,
        description=(
            "Intelligent Football Recruitment & Transfer Analytics Platform. "
            "AI-powered scouting, player analysis, and transfer intelligence."
        ),
        version=settings.APP_VERSION,
        docs_url="/docs",
        redoc_url="/redoc",
        lifespan=lifespan,
    )

    # ─── CORS Middleware ───────────────────────────────────────────────────
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.CORS_ORIGINS,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # ─── Mount Routers ─────────────────────────────────────────────────────
    app.include_router(auth_router, prefix=settings.API_PREFIX)
    app.include_router(players_router, prefix=settings.API_PREFIX)
    app.include_router(ai_router, prefix=settings.API_PREFIX)


    # ─── Health Check ──────────────────────────────────────────────────────
    @app.get("/health", tags=["System"])
    async def health_check():
        return {
            "status": "healthy",
            "app": settings.APP_NAME,
            "version": settings.APP_VERSION,
        }

    @app.get("/", tags=["System"])
    async def root():
        return {
            "message": f"Welcome to {settings.APP_NAME} API",
            "docs": "/docs",
            "health": "/health",
        }

    return app


# Create the app instance
app = create_app()
