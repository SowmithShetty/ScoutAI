"""
ScoutAI Backend - Database Configuration

Async SQLAlchemy engine, session factory, and base model class.
"""

from sqlalchemy.ext.asyncio import (
    AsyncSession,
    async_sessionmaker,
    create_async_engine,
)
from sqlalchemy.orm import DeclarativeBase, MappedAsDataclass
from sqlalchemy import MetaData

from app.core import get_settings

# ─── Naming Convention for Constraints ─────────────────────────────────────────

NAMING_CONVENTION = {
    "ix": "ix_%(column_0_label)s",
    "uq": "uq_%(table_name)s_%(column_0_name)s",
    "ck": "ck_%(table_name)s_%(constraint_name)s",
    "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
    "pk": "pk_%(table_name)s",
}

metadata = MetaData(naming_convention=NAMING_CONVENTION)


# ─── Base Model ────────────────────────────────────────────────────────────────

class Base(DeclarativeBase):
    """Base class for all SQLAlchemy ORM models."""
    metadata = metadata


# ─── Engine & Session ──────────────────────────────────────────────────────────

settings = get_settings()

engine_kwargs = {
    "echo": settings.DEBUG,
    "pool_pre_ping": True,
}
if settings.DATABASE_URL.startswith("postgresql"):
    engine_kwargs["pool_size"] = 20
    engine_kwargs["max_overflow"] = 10

engine = create_async_engine(
    settings.DATABASE_URL,
    **engine_kwargs
)


async_session_factory = async_sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False,
)


async def get_db() -> AsyncSession:
    """
    FastAPI dependency: Provide an async database session.
    Session is automatically closed after the request completes.
    """
    async with async_session_factory() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()


async def init_db():
    """Create all tables. Used for development/testing only."""
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)


async def close_db():
    """Dispose the engine connection pool."""
    await engine.dispose()
