"""
ScoutAI Database Seeding Script

Generates realistic mock data and inserts it into the database.
"""

import asyncio
import sys
import uuid
from datetime import date, datetime
from pathlib import Path

# Add python paths
sys.path.append(str(Path(__file__).resolve().parents[2]))  # Workspace root
sys.path.append(str(Path(__file__).resolve().parents[2] / "backend"))  # Backend root

from app.core.database import get_db, init_db, async_session_factory
from app.models.club import Club, Competition
from app.models.player import Player, PlayerStatistics
from app.models.transfer import Transfer
from app.models.medical import MedicalRecord
from app.models.user import User
from app.core.security import hash_password

from data.seeds.seed_database import generate_players

async def seed_data():
    print("Initializing database tables...")
    await init_db()
    print("Database tables created/verified.")

    print("Generating 500 players and club data...")
    seed_data = generate_players(500)
    print("Generation complete.")

    async with async_session_factory() as session:
        # 1. Create Default Users (Scout, Analyst, Director)
        print("Creating demo users...")
        demo_users = [
            User(
                id=uuid.UUID("11111111-1111-1111-1111-111111111111"),
                email="scout@scoutai.com",
                password_hash=hash_password("password123"),
                full_name="Alex Mercer",
                role="scout",
                is_active=True,
            ),
            User(
                id=uuid.UUID("22222222-2222-2222-2222-222222222222"),
                email="analyst@scoutai.com",
                password_hash=hash_password("password123"),
                full_name="Sarah Connor",
                role="analyst",
                is_active=True,
            ),
            User(
                id=uuid.UUID("33333333-3333-3333-3333-333333333333"),
                email="director@scoutai.com",
                password_hash=hash_password("password123"),
                full_name="Thomas Muller",
                role="sporting_director",
                is_active=True,
            ),
        ]
        for user in demo_users:
            await session.merge(user)

        # 2. Insert Competitions
        print("Inserting competitions...")
        comp_map = {}
        for comp in seed_data["competitions"]:
            c_id = uuid.UUID(comp["id"])
            c_obj = Competition(
                id=c_id,
                name=comp["name"],
                country=comp["country"],
                tier=comp["tier"],
            )
            await session.merge(c_obj)
            comp_map[comp["name"]] = c_id

        # 3. Insert Clubs
        print("Inserting clubs...")
        club_map = {}
        for club in seed_data["clubs"]:
            cl_id = uuid.UUID(club["id"])
            cl_obj = Club(
                id=cl_id,
                name=club["name"],
                short_name=club["short_name"],
                country=club["country"],
                competition_id=uuid.UUID(club["competition_id"]),
                budget=club["budget"],
                wage_budget=club["wage_budget"],
            )
            await session.merge(cl_obj)
            club_map[club["name"]] = cl_id

        # Commit competitions & clubs first to avoid foreign key errors
        await session.commit()

        # 4. Insert Players
        print("Inserting players...")
        player_map = {}
        for p in seed_data["players"]:
            p_id = uuid.UUID(p["id"])
            
            # Map default fields
            p_obj = Player(
                id=p_id,
                name=p["name"],
                full_name=p["full_name"],
                date_of_birth=datetime.strptime(p["date_of_birth"], "%Y-%m-%d").date(),
                age=p["age"],
                nationality=p["nationality"],
                height=p["height"],
                weight=p["weight"],
                preferred_foot=p["preferred_foot"],
                position=p["position"],
                secondary_positions=p["secondary_positions"],
                playing_style=p["playing_style"],
                tactical_role=p["tactical_role"],
                club_id=uuid.UUID(p["club_id"]),
                jersey_number=p["jersey_number"],
                contract_expiry=datetime.strptime(p["contract_expiry"], "%Y-%m-%d").date(),
                market_value=p["market_value"],
                salary=p["salary"],
                release_clause=p["release_clause"],
                agent=p["agent"],
                overall_rating=p["overall_rating"],
                potential=p["potential"],
                form=p["form"],
                availability=p["availability"],
                is_transfer_listed=p["is_transfer_listed"],
                
                # Core attributes
                pace=p["pace"],
                shooting=p["shooting"],
                passing=p["passing"],
                dribbling=p["dribbling"],
                defending=p["defending"],
                physical=p["physical"],
                vision=p["vision"],
                creativity=p["creativity"],
                aggression=p["aggression"],
                leadership=p["leadership"],
                heading=p["heading"],
                finishing=p["finishing"],
                strength=p["strength"],
                weak_foot=p["weak_foot"],
                skill_moves=p["skill_moves"],
                strengths=p["strengths"],
                weaknesses=p["weaknesses"],
            )
            await session.merge(p_obj)
            player_map[p["id"]] = p_id

        await session.commit()

        # 5. Insert Player Statistics
        print("Inserting player season statistics...")
        for stats in seed_data["player_statistics"]:
            s_obj = PlayerStatistics(
                id=uuid.UUID(stats["id"]),
                player_id=uuid.UUID(stats["player_id"]),
                season=stats["season"],
                competition=stats["competition"],
                matches=stats["matches"],
                starts=stats["starts"],
                minutes=stats["minutes"],
                goals=stats["goals"],
                assists=stats["assists"],
                xg=stats["xg"],
                xg_assist=stats["xg_assist"],
                xg_per_90=stats["xg_per_90"],
                xa_per_90=stats["xa_per_90"],
                pass_completion_pct=stats["pass_completion_pct"],
                progressive_passes=stats["progressive_passes"],
                progressive_carries=stats["progressive_carries"],
                key_passes=stats["key_passes"],
                successful_dribbles=stats["successful_dribbles"],
                touches=stats["touches"],
                shots=stats["shots"],
                shots_on_target=stats["shots_on_target"],
                shot_creating_actions=stats["shot_creating_actions"],
                tackles=stats["tackles"],
                tackles_won=stats["tackles_won"],
                interceptions=stats["interceptions"],
                blocks=stats["blocks"],
                aerial_wins=stats["aerial_wins"],
                pressures=stats["pressures"],
                successful_pressures=stats["successful_pressures"],
                defensive_actions=stats["defensive_actions"],
                yellow_cards=stats["yellow_cards"],
                red_cards=stats["red_cards"],
                average_rating=stats["average_rating"],
            )
            await session.merge(s_obj)

        # 6. Insert Transfers
        print("Inserting transfers...")
        for t in seed_data["transfers"]:
            t_obj = Transfer(
                id=uuid.UUID(t["id"]),
                player_id=uuid.UUID(t["player_id"]),
                from_club_name=t["from_club_name"],
                to_club_name=t["to_club_name"],
                date=datetime.strptime(t["date"], "%Y-%m-%d").date(),
                fee=t["fee"],
                transfer_type=t["transfer_type"],
                season=t["season"],
            )
            await session.merge(t_obj)

        # 7. Insert Medical Records
        print("Inserting medical injury history...")
        for m in seed_data["medical_records"]:
            m_obj = MedicalRecord(
                id=uuid.UUID(m["id"]),
                player_id=uuid.UUID(m["player_id"]),
                injury_type=m["injury_type"],
                body_part=m["body_part"],
                severity=m["severity"],
                start_date=datetime.strptime(m["start_date"], "%Y-%m-%d").date(),
                end_date=datetime.strptime(m["end_date"], "%Y-%m-%d").date() if m["end_date"] else None,
                matches_missed=m["matches_missed"],
                days_out=m["days_out"],
                is_recurring=m["is_recurring"],
            )
            await session.merge(m_obj)

        await session.commit()
    print("Database successfully seeded with 500 players!")

if __name__ == "__main__":
    asyncio.run(seed_data())
