"""
ScoutAI - Players Router

CRUD operations, filtering, and search for the player database.
"""

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, or_, and_, desc, asc
from sqlalchemy.orm import selectinload
from typing import Optional
from uuid import UUID
import math

from app.core.database import get_db
from app.core.security import get_current_user, get_optional_user, TokenPayload
from app.models.player import Player, PlayerStatistics
from app.models.club import Club
from app.models.transfer import Transfer
from app.models.medical import MedicalRecord
from app.schemas.player import (
    PlayerListResponse,
    PlayerDetailResponse,
    PlayerBriefResponse,
    PlayerFilterParams,
    PlayerStatisticsResponse,
    TransferResponse,
    MedicalRecordResponse,
    ClubBrief,
)

router = APIRouter(prefix="/players", tags=["Players"])


def _apply_filters(query, filters: PlayerFilterParams):
    """Apply dynamic filters to a player query."""

    if filters.search:
        search_term = f"%{filters.search}%"
        query = query.where(
            or_(
                Player.name.ilike(search_term),
                Player.full_name.ilike(search_term),
                Player.nationality.ilike(search_term),
            )
        )

    if filters.position:
        query = query.where(Player.position == filters.position)
    if filters.tactical_role:
        query = query.where(Player.tactical_role == filters.tactical_role)
    if filters.playing_style:
        query = query.where(Player.playing_style == filters.playing_style)
    if filters.nationality:
        query = query.where(Player.nationality == filters.nationality)
    if filters.preferred_foot:
        query = query.where(Player.preferred_foot == filters.preferred_foot)
    if filters.min_age is not None:
        query = query.where(Player.age >= filters.min_age)
    if filters.max_age is not None:
        query = query.where(Player.age <= filters.max_age)
    if filters.min_height is not None:
        query = query.where(Player.height >= filters.min_height)
    if filters.max_height is not None:
        query = query.where(Player.height <= filters.max_height)
    if filters.club_id:
        query = query.where(Player.club_id == filters.club_id)
    if filters.min_market_value is not None:
        query = query.where(Player.market_value >= filters.min_market_value)
    if filters.max_market_value is not None:
        query = query.where(Player.market_value <= filters.max_market_value)
    if filters.min_salary is not None:
        query = query.where(Player.salary >= filters.min_salary)
    if filters.max_salary is not None:
        query = query.where(Player.salary <= filters.max_salary)
    if filters.contract_expiry_before:
        query = query.where(Player.contract_expiry <= filters.contract_expiry_before)
    if filters.min_overall is not None:
        query = query.where(Player.overall_rating >= filters.min_overall)
    if filters.max_overall is not None:
        query = query.where(Player.overall_rating <= filters.max_overall)
    if filters.min_potential is not None:
        query = query.where(Player.potential >= filters.min_potential)
    if filters.availability:
        query = query.where(Player.availability == filters.availability)
    if filters.is_transfer_listed is not None:
        query = query.where(Player.is_transfer_listed == filters.is_transfer_listed)

    # League filter via club join
    if filters.league:
        query = query.join(Club, Player.club_id == Club.id).where(
            Club.country == filters.league
        )

    return query


def _apply_sorting(query, sort_by: str, sort_order: str):
    """Apply sorting to a player query."""
    # Map of allowed sort fields
    sort_fields = {
        "name": Player.name,
        "age": Player.age,
        "position": Player.position,
        "market_value": Player.market_value,
        "overall_rating": Player.overall_rating,
        "potential": Player.potential,
        "salary": Player.salary,
        "nationality": Player.nationality,
    }

    sort_column = sort_fields.get(sort_by, Player.overall_rating)
    order_func = desc if sort_order == "desc" else asc
    return query.order_by(order_func(sort_column))


@router.get("", response_model=PlayerListResponse)
async def list_players(
    search: Optional[str] = None,
    position: Optional[str] = None,
    tactical_role: Optional[str] = None,
    playing_style: Optional[str] = None,
    nationality: Optional[str] = None,
    min_age: Optional[int] = Query(None, ge=15, le=45),
    max_age: Optional[int] = Query(None, ge=15, le=45),
    preferred_foot: Optional[str] = None,
    min_height: Optional[int] = Query(None, ge=150, le=210),
    max_height: Optional[int] = Query(None, ge=150, le=210),
    club_id: Optional[UUID] = None,
    league: Optional[str] = None,
    min_market_value: Optional[float] = None,
    max_market_value: Optional[float] = None,
    min_salary: Optional[float] = None,
    max_salary: Optional[float] = None,
    contract_expiry_before: Optional[str] = None,
    min_overall: Optional[float] = None,
    max_overall: Optional[float] = None,
    min_potential: Optional[float] = None,
    availability: Optional[str] = None,
    is_transfer_listed: Optional[bool] = None,
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    sort_by: str = "overall_rating",
    sort_order: str = "desc",
    db: AsyncSession = Depends(get_db),
):
    """
    List players with advanced filtering, pagination, and sorting.
    Supports instant search by name, nationality, or position.
    """
    filters = PlayerFilterParams(
        search=search, position=position, tactical_role=tactical_role,
        playing_style=playing_style, nationality=nationality,
        min_age=min_age, max_age=max_age, preferred_foot=preferred_foot,
        min_height=min_height, max_height=max_height, club_id=club_id,
        league=league, min_market_value=min_market_value,
        max_market_value=max_market_value, min_salary=min_salary,
        max_salary=max_salary, min_overall=min_overall,
        max_overall=max_overall, min_potential=min_potential,
        availability=availability, is_transfer_listed=is_transfer_listed,
        page=page, page_size=page_size, sort_by=sort_by, sort_order=sort_order,
    )

    # Count total matching players
    count_query = select(func.count(Player.id))
    count_query = _apply_filters(count_query, filters)
    total_result = await db.execute(count_query)
    total = total_result.scalar() or 0

    # Get paginated results
    query = select(Player).options(selectinload(Player.club))
    query = _apply_filters(query, filters)
    query = _apply_sorting(query, filters.sort_by, filters.sort_order)

    offset = (filters.page - 1) * filters.page_size
    query = query.offset(offset).limit(filters.page_size)

    result = await db.execute(query)
    players = result.scalars().all()

    # Build response
    player_list = []
    for p in players:
        club_brief = None
        if p.club:
            club_brief = ClubBrief(
                id=p.club.id,
                name=p.club.name,
                logo_url=p.club.logo_url,
                country=p.club.country,
            )
        player_list.append(
            PlayerBriefResponse(
                id=p.id,
                name=p.name,
                age=p.age,
                nationality=p.nationality,
                position=p.position,
                club=club_brief,
                market_value=p.market_value,
                overall_rating=p.overall_rating,
                potential=p.potential,
                image_url=p.image_url,
                preferred_foot=p.preferred_foot,
                availability=p.availability,
                is_transfer_listed=p.is_transfer_listed,
            )
        )

    return PlayerListResponse(
        players=player_list,
        total=total,
        page=filters.page,
        page_size=filters.page_size,
        total_pages=math.ceil(total / filters.page_size) if total > 0 else 0,
    )


@router.get("/positions", response_model=list[str])
async def get_positions(db: AsyncSession = Depends(get_db)):
    """Get all distinct player positions in the database."""
    result = await db.execute(
        select(Player.position).distinct().order_by(Player.position)
    )
    return [row[0] for row in result.all()]


@router.get("/nationalities", response_model=list[str])
async def get_nationalities(db: AsyncSession = Depends(get_db)):
    """Get all distinct nationalities in the database."""
    result = await db.execute(
        select(Player.nationality).distinct().order_by(Player.nationality)
    )
    return [row[0] for row in result.all()]


@router.get("/stats/overview")
async def get_overview_stats(db: AsyncSession = Depends(get_db)):
    """Get aggregate statistics for the dashboard."""
    total_players = await db.execute(select(func.count(Player.id)))
    avg_age = await db.execute(select(func.avg(Player.age)))
    avg_value = await db.execute(select(func.avg(Player.market_value)))
    total_value = await db.execute(select(func.sum(Player.market_value)))

    # Position distribution
    position_dist = await db.execute(
        select(Player.position, func.count(Player.id))
        .group_by(Player.position)
        .order_by(func.count(Player.id).desc())
    )

    # Nationality distribution (top 10)
    nationality_dist = await db.execute(
        select(Player.nationality, func.count(Player.id))
        .group_by(Player.nationality)
        .order_by(func.count(Player.id).desc())
        .limit(10)
    )

    # Age distribution
    age_dist = await db.execute(
        select(Player.age, func.count(Player.id))
        .group_by(Player.age)
        .order_by(Player.age)
    )

    return {
        "total_players": total_players.scalar() or 0,
        "average_age": round(avg_age.scalar() or 0, 1),
        "average_market_value": round(avg_value.scalar() or 0, 0),
        "total_market_value": round(total_value.scalar() or 0, 0),
        "position_distribution": [
            {"position": row[0], "count": row[1]}
            for row in position_dist.all()
        ],
        "nationality_distribution": [
            {"nationality": row[0], "count": row[1]}
            for row in nationality_dist.all()
        ],
        "age_distribution": [
            {"age": row[0], "count": row[1]}
            for row in age_dist.all()
        ],
    }


@router.get("/{player_id}", response_model=PlayerDetailResponse)
async def get_player(
    player_id: UUID,
    db: AsyncSession = Depends(get_db),
):
    """
    Get full player profile including statistics, transfers, and medical records.
    """
    result = await db.execute(
        select(Player)
        .options(
            selectinload(Player.club),
            selectinload(Player.statistics),
            selectinload(Player.transfers),
            selectinload(Player.medical_records),
        )
        .where(Player.id == player_id)
    )
    player = result.scalar_one_or_none()

    if not player:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Player not found",
        )

    club_brief = None
    if player.club:
        club_brief = ClubBrief(
            id=player.club.id,
            name=player.club.name,
            logo_url=player.club.logo_url,
            country=player.club.country,
        )

    return PlayerDetailResponse(
        id=player.id,
        name=player.name,
        full_name=player.full_name,
        date_of_birth=player.date_of_birth,
        age=player.age,
        nationality=player.nationality,
        second_nationality=player.second_nationality,
        image_url=player.image_url,
        height=player.height,
        weight=player.weight,
        preferred_foot=player.preferred_foot,
        position=player.position,
        secondary_positions=player.secondary_positions,
        playing_style=player.playing_style,
        tactical_role=player.tactical_role,
        club=club_brief,
        jersey_number=player.jersey_number,
        contract_start=player.contract_start,
        contract_expiry=player.contract_expiry,
        on_loan=player.on_loan,
        loan_club=player.loan_club,
        market_value=player.market_value,
        salary=player.salary,
        release_clause=player.release_clause,
        agent=player.agent,
        overall_rating=player.overall_rating,
        potential=player.potential,
        form=player.form,
        availability=player.availability,
        is_transfer_listed=player.is_transfer_listed,
        pace=player.pace,
        shooting=player.shooting,
        passing=player.passing,
        dribbling=player.dribbling,
        defending=player.defending,
        physical=player.physical,
        vision=player.vision,
        creativity=player.creativity,
        aggression=player.aggression,
        leadership=player.leadership,
        heading=player.heading,
        finishing=player.finishing,
        strength=player.strength,
        weak_foot=player.weak_foot,
        skill_moves=player.skill_moves,
        strengths=player.strengths,
        weaknesses=player.weaknesses,
        ai_summary=player.ai_summary,
        statistics=[
            PlayerStatisticsResponse.model_validate(s) for s in player.statistics
        ],
        transfers=[
            TransferResponse.model_validate(t) for t in player.transfers
        ],
        medical_records=[
            MedicalRecordResponse.model_validate(m) for m in player.medical_records
        ],
    )
