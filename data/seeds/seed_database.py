"""
ScoutAI - Realistic Seed Data Generator

Generates ~500 realistic football player records with:
- Real-world-inspired player profiles
- Position-appropriate stat distributions
- Transfer histories
- Medical records
- Club and competition data

Run: python -m data.seeds.seed_database
"""

import json
import random
import uuid
from datetime import date, timedelta
from pathlib import Path

# ─── Constants ────────────────────────────────────────────────────────────────

NATIONALITIES = [
    "England", "France", "Spain", "Germany", "Brazil", "Argentina",
    "Portugal", "Netherlands", "Italy", "Belgium", "Colombia",
    "Uruguay", "Norway", "Denmark", "Sweden", "Croatia", "Serbia",
    "Poland", "Switzerland", "Japan", "South Korea", "Nigeria",
    "Ghana", "Senegal", "Morocco", "Egypt", "Ivory Coast",
    "USA", "Mexico", "Canada", "Australia", "Scotland", "Wales",
    "Austria", "Czech Republic", "Turkey", "Greece", "Ukraine",
]

FIRST_NAMES = [
    "Marcus", "James", "Alexander", "Lucas", "Gabriel", "Mohammed",
    "Daniel", "Samuel", "Thomas", "Robert", "Michael", "David",
    "Antonio", "Rafael", "Hugo", "Bruno", "Leo", "Mateo",
    "Pablo", "Carlos", "João", "Pedro", "André", "Diego",
    "Luka", "Ivan", "Nikola", "Adam", "Youssef", "Omar",
    "Keita", "Sadio", "Victor", "Emmanuel", "Kylian", "Antoine",
    "Julian", "Florian", "Kevin", "Timo", "Joshua", "Kai",
    "Mason", "Declan", "Jack", "Harry", "Bukayo", "Callum",
    "Phil", "Erling", "Martin", "Federico", "Nicolò", "Gianluca",
]

LAST_NAMES = [
    "Silva", "Santos", "Martinez", "Rodriguez", "Garcia", "Lopez",
    "Hernandez", "Gonzalez", "Wilson", "Anderson", "Taylor", "Brown",
    "Smith", "Johnson", "Williams", "Jones", "Davis", "Miller",
    "Müller", "Schmidt", "Weber", "Wagner", "Fischer", "Becker",
    "Rossi", "Ferrari", "Romano", "Colombo", "Ricci", "Conti",
    "van Dijk", "de Jong", "Bakker", "Jansen", "Peters", "Visser",
    "Fernandes", "Pereira", "Almeida", "Costa", "Ribeiro", "Lopes",
    "Diallo", "Touré", "Konaté", "Camara", "Traoré", "Dembélé",
    "Kim", "Park", "Lee", "Tanaka", "Nakamura", "Watanabe",
]

CLUBS_DATA = [
    # Premier League
    {"name": "Manchester City", "short": "MCI", "country": "England", "league": "Premier League", "budget": 150000000},
    {"name": "Arsenal", "short": "ARS", "country": "England", "league": "Premier League", "budget": 120000000},
    {"name": "Liverpool", "short": "LIV", "country": "England", "league": "Premier League", "budget": 100000000},
    {"name": "Chelsea", "short": "CHE", "country": "England", "league": "Premier League", "budget": 130000000},
    {"name": "Manchester United", "short": "MUN", "country": "England", "league": "Premier League", "budget": 110000000},
    {"name": "Tottenham Hotspur", "short": "TOT", "country": "England", "league": "Premier League", "budget": 80000000},
    {"name": "Newcastle United", "short": "NEW", "country": "England", "league": "Premier League", "budget": 90000000},
    {"name": "Aston Villa", "short": "AVL", "country": "England", "league": "Premier League", "budget": 70000000},
    {"name": "Brighton", "short": "BHA", "country": "England", "league": "Premier League", "budget": 60000000},
    {"name": "West Ham United", "short": "WHU", "country": "England", "league": "Premier League", "budget": 65000000},
    # La Liga
    {"name": "Real Madrid", "short": "RMA", "country": "Spain", "league": "La Liga", "budget": 200000000},
    {"name": "FC Barcelona", "short": "BAR", "country": "Spain", "league": "La Liga", "budget": 120000000},
    {"name": "Atletico Madrid", "short": "ATM", "country": "Spain", "league": "La Liga", "budget": 80000000},
    {"name": "Real Sociedad", "short": "RSO", "country": "Spain", "league": "La Liga", "budget": 40000000},
    {"name": "Villarreal", "short": "VIL", "country": "Spain", "league": "La Liga", "budget": 35000000},
    # Bundesliga
    {"name": "Bayern Munich", "short": "BAY", "country": "Germany", "league": "Bundesliga", "budget": 150000000},
    {"name": "Bayer Leverkusen", "short": "B04", "country": "Germany", "league": "Bundesliga", "budget": 70000000},
    {"name": "Borussia Dortmund", "short": "BVB", "country": "Germany", "league": "Bundesliga", "budget": 80000000},
    {"name": "RB Leipzig", "short": "RBL", "country": "Germany", "league": "Bundesliga", "budget": 60000000},
    {"name": "VfB Stuttgart", "short": "VFB", "country": "Germany", "league": "Bundesliga", "budget": 40000000},
    # Serie A
    {"name": "Inter Milan", "short": "INT", "country": "Italy", "league": "Serie A", "budget": 90000000},
    {"name": "AC Milan", "short": "ACM", "country": "Italy", "league": "Serie A", "budget": 80000000},
    {"name": "Juventus", "short": "JUV", "country": "Italy", "league": "Serie A", "budget": 100000000},
    {"name": "Napoli", "short": "NAP", "country": "Italy", "league": "Serie A", "budget": 60000000},
    {"name": "Atalanta", "short": "ATA", "country": "Italy", "league": "Serie A", "budget": 50000000},
    # Ligue 1
    {"name": "Paris Saint-Germain", "short": "PSG", "country": "France", "league": "Ligue 1", "budget": 200000000},
    {"name": "AS Monaco", "short": "MON", "country": "France", "league": "Ligue 1", "budget": 55000000},
    {"name": "Olympique Lyonnais", "short": "OL", "country": "France", "league": "Ligue 1", "budget": 50000000},
    {"name": "Olympique Marseille", "short": "OM", "country": "France", "league": "Ligue 1", "budget": 45000000},
    {"name": "LOSC Lille", "short": "LIL", "country": "France", "league": "Ligue 1", "budget": 40000000},
]

POSITIONS = ["GK", "CB", "LB", "RB", "LWB", "RWB", "CDM", "CM", "CAM", "LM", "RM", "LW", "RW", "CF", "ST"]

TACTICAL_ROLES = {
    "GK": ["Sweeper Keeper", "Shot Stopper", "Ball Playing Keeper"],
    "CB": ["Ball Playing Defender", "Stopper", "Cover", "Libero"],
    "LB": ["Inverted Full-Back", "Attacking Full-Back", "Defensive Full-Back"],
    "RB": ["Inverted Full-Back", "Attacking Full-Back", "Defensive Full-Back"],
    "LWB": ["Wing Back", "Complete Wing-Back"],
    "RWB": ["Wing Back", "Complete Wing-Back"],
    "CDM": ["Ball Winning Midfielder", "Deep Lying Playmaker", "Anchor Man", "Half-Back"],
    "CM": ["Box-to-Box", "Mezzala", "Roaming Playmaker", "Carrilero"],
    "CAM": ["Advanced Playmaker", "Shadow Striker", "Enganche", "Trequartista"],
    "LM": ["Wide Midfielder", "Wide Playmaker"],
    "RM": ["Wide Midfielder", "Wide Playmaker"],
    "LW": ["Inverted Winger", "Inside Forward", "Wide Attacker"],
    "RW": ["Inverted Winger", "Inside Forward", "Wide Attacker"],
    "CF": ["False Nine", "Deep Lying Forward", "Complete Forward"],
    "ST": ["Target Man", "Poacher", "Pressing Forward", "Advanced Forward"],
}

PLAYING_STYLES = ["Counter-Attacking", "Possession-Based", "Direct", "High Pressing", "Tiki-Taka", "Wing Play", "Physical", "Technical"]

INJURY_TYPES = [
    ("Hamstring Strain", "Hamstring", "Minor"),
    ("Hamstring Tear", "Hamstring", "Moderate"),
    ("ACL Tear", "Knee", "Severe"),
    ("MCL Sprain", "Knee", "Moderate"),
    ("Ankle Sprain", "Ankle", "Minor"),
    ("Ankle Ligament", "Ankle", "Moderate"),
    ("Groin Strain", "Groin", "Minor"),
    ("Groin Injury", "Groin", "Moderate"),
    ("Calf Strain", "Calf", "Minor"),
    ("Calf Tear", "Calf", "Moderate"),
    ("Quadriceps Strain", "Thigh", "Minor"),
    ("Foot Fracture", "Foot", "Severe"),
    ("Shoulder Dislocation", "Shoulder", "Moderate"),
    ("Back Strain", "Back", "Minor"),
    ("Concussion", "Head", "Moderate"),
]

AGENTS = [
    "Jorge Mendes", "Mino Raiola Agency", "CAA Base", "Stellar Group",
    "Wasserman", "ICM Stellar", "Rafaela Pimenta", "Pini Zahavi",
    "Volker Struth", "Fali Ramadani", "Jonathan Barnett", "Kia Joorabchian",
]

STRENGTHS_POOL = {
    "ST": ["Clinical Finishing", "Aerial Dominance", "Movement Off Ball", "Penalty Area Presence", "Counter-Attack Speed", "Hold-Up Play", "Link Play", "Poacher Instinct"],
    "CAM": ["Vision", "Through Balls", "Creativity", "Dribbling", "Set Pieces", "Long Shots", "Final Third Passes", "Ball Retention"],
    "CM": ["Box-to-Box Engine", "Ball Recovery", "Passing Range", "Work Rate", "Tactical Intelligence", "Press Resistance", "Ball Progression"],
    "CDM": ["Tackling", "Interceptions", "Positioning", "Ball Winning", "Screen Play", "Aerial Ability", "Distribution", "Defensive Reading"],
    "LW": ["Pace", "Dribbling", "Cut Inside", "1v1 Ability", "Crossing", "Direct Running", "Beat Defender", "Creativity"],
    "RW": ["Pace", "Dribbling", "Cut Inside", "1v1 Ability", "Crossing", "Direct Running", "Beat Defender", "Creativity"],
    "CB": ["Aerial Dominance", "Tackling", "Positioning", "Ball Playing", "Leadership", "Strength", "Recovery Speed", "Reading the Game"],
    "LB": ["Overlapping", "Crossing", "Pace", "Stamina", "Defensive Solidity", "1v1 Defending"],
    "RB": ["Overlapping", "Crossing", "Pace", "Stamina", "Defensive Solidity", "1v1 Defending"],
    "GK": ["Shot Stopping", "Distribution", "Command of Area", "Reflexes", "1v1 Saving", "Sweeping"],
}

WEAKNESSES_POOL = [
    "Inconsistency", "Injury Prone", "Weak Foot", "Aerial Duels", "Defensive Contribution",
    "Pressing Intensity", "Decision Making", "Composure Under Pressure", "Physical Battles",
    "Tracking Back", "Set Piece Defending", "Concentration", "Build-Up Involvement",
    "Passing Range", "Long Shots", "First Touch Under Pressure", "Pace in Recovery",
]


# ─── Stat Generation (position-dependent) ────────────────────────────────────

def generate_base_stats(position: str, overall: int) -> dict:
    """Generate position-appropriate attribute ratings based on overall rating."""
    noise = lambda base: max(30, min(99, base + random.randint(-8, 8)))
    base = overall

    profiles = {
        "GK": {"pace": base-25, "shooting": base-40, "passing": base-15, "dribbling": base-25, "defending": base-5, "physical": base-5, "vision": base-15, "creativity": base-30, "aggression": base-15, "leadership": base, "heading": base-20, "finishing": base-45, "strength": base-5},
        "CB": {"pace": base-15, "shooting": base-25, "passing": base-10, "dribbling": base-15, "defending": base+2, "physical": base+2, "vision": base-10, "creativity": base-20, "aggression": base+5, "leadership": base+5, "heading": base+5, "finishing": base-30, "strength": base+5},
        "LB": {"pace": base+2, "shooting": base-20, "passing": base-5, "dribbling": base-5, "defending": base-2, "physical": base-2, "vision": base-5, "creativity": base-5, "aggression": base, "leadership": base-5, "heading": base-10, "finishing": base-25, "strength": base-5},
        "RB": {"pace": base+2, "shooting": base-20, "passing": base-5, "dribbling": base-5, "defending": base-2, "physical": base-2, "vision": base-5, "creativity": base-5, "aggression": base, "leadership": base-5, "heading": base-10, "finishing": base-25, "strength": base-5},
        "CDM": {"pace": base-8, "shooting": base-15, "passing": base+2, "dribbling": base-5, "defending": base+5, "physical": base+3, "vision": base, "creativity": base-10, "aggression": base+5, "leadership": base+3, "heading": base, "finishing": base-20, "strength": base+3},
        "CM": {"pace": base-5, "shooting": base-5, "passing": base+5, "dribbling": base, "defending": base-5, "physical": base, "vision": base+5, "creativity": base+2, "aggression": base, "leadership": base, "heading": base-5, "finishing": base-8, "strength": base},
        "CAM": {"pace": base-2, "shooting": base+2, "passing": base+5, "dribbling": base+5, "defending": base-20, "physical": base-5, "vision": base+8, "creativity": base+8, "aggression": base-10, "leadership": base-5, "heading": base-10, "finishing": base, "strength": base-10},
        "LW": {"pace": base+5, "shooting": base+2, "passing": base, "dribbling": base+5, "defending": base-25, "physical": base-5, "vision": base, "creativity": base+5, "aggression": base-5, "leadership": base-10, "heading": base-15, "finishing": base, "strength": base-10},
        "RW": {"pace": base+5, "shooting": base+2, "passing": base, "dribbling": base+5, "defending": base-25, "physical": base-5, "vision": base, "creativity": base+5, "aggression": base-5, "leadership": base-10, "heading": base-15, "finishing": base, "strength": base-10},
        "ST": {"pace": base+2, "shooting": base+5, "passing": base-10, "dribbling": base, "defending": base-30, "physical": base+2, "vision": base-5, "creativity": base-8, "aggression": base+3, "leadership": base-3, "heading": base+5, "finishing": base+8, "strength": base+3},
        "CF": {"pace": base, "shooting": base+3, "passing": base+2, "dribbling": base+3, "defending": base-25, "physical": base, "vision": base+5, "creativity": base+5, "aggression": base, "leadership": base, "heading": base, "finishing": base+5, "strength": base},
    }

    profile = profiles.get(position, profiles["CM"])
    return {k: noise(v) for k, v in profile.items()}


def generate_season_stats(position: str, overall: int, minutes: int) -> dict:
    """Generate realistic per-season statistics based on position and quality."""
    is_attacker = position in ("ST", "CF", "LW", "RW")
    is_midfielder = position in ("CAM", "CM", "CDM", "LM", "RM")
    is_defender = position in ("CB", "LB", "RB", "LWB", "RWB")
    is_keeper = position == "GK"

    matches = max(1, minutes // 80)

    if is_attacker:
        goals = max(0, int(random.gauss(overall * 0.22 - 10, 5)))
        assists = max(0, int(random.gauss(overall * 0.08 - 3, 3)))
    elif is_midfielder:
        goals = max(0, int(random.gauss(overall * 0.08 - 3, 3)))
        assists = max(0, int(random.gauss(overall * 0.1 - 2, 3)))
    else:
        goals = max(0, int(random.gauss(1, 1.5)))
        assists = max(0, int(random.gauss(2, 2)))

    xg = max(0, goals + random.gauss(0, 2))
    xa = max(0, assists + random.gauss(0, 1.5))

    return {
        "matches": matches,
        "starts": max(0, matches - random.randint(0, 5)),
        "minutes": minutes,
        "goals": goals,
        "assists": assists,
        "xg": round(xg, 1),
        "xg_assist": round(xa, 1),
        "xg_per_90": round(xg / max(1, minutes) * 90, 2),
        "xa_per_90": round(xa / max(1, minutes) * 90, 2),
        "passes_completed": random.randint(500, 2000),
        "passes_attempted": random.randint(600, 2500),
        "pass_completion_pct": round(random.uniform(72, 92), 1),
        "progressive_passes": random.randint(20, 150),
        "key_passes": random.randint(10, 80),
        "through_balls": random.randint(0, 20),
        "progressive_carries": random.randint(20, 120),
        "successful_dribbles": random.randint(10, 80),
        "dribbles_attempted": random.randint(20, 120),
        "touches": random.randint(500, 3000),
        "shots": random.randint(10, 120) if is_attacker else random.randint(5, 40),
        "shots_on_target": random.randint(5, 60) if is_attacker else random.randint(2, 15),
        "shot_creating_actions": random.randint(15, 80),
        "tackles": random.randint(20, 100) if is_defender else random.randint(10, 50),
        "tackles_won": random.randint(10, 60),
        "interceptions": random.randint(10, 80) if is_defender else random.randint(5, 30),
        "blocks": random.randint(5, 40),
        "clearances": random.randint(20, 120) if is_defender else random.randint(2, 15),
        "aerial_wins": random.randint(10, 80),
        "pressures": random.randint(100, 400),
        "successful_pressures": random.randint(40, 160),
        "defensive_actions": random.randint(30, 120),
        "yellow_cards": random.randint(0, 10),
        "red_cards": random.randint(0, 1),
        "average_rating": round(random.uniform(6.2, 8.5), 1),
    }


def generate_players(count: int = 500) -> dict:
    """Generate complete seed data for the ScoutAI platform."""
    # Generate competitions
    leagues = list(set(c["league"] for c in CLUBS_DATA))
    competitions = []
    for league in leagues:
        country = next(c["country"] for c in CLUBS_DATA if c["league"] == league)
        competitions.append({
            "id": str(uuid.uuid4()),
            "name": league,
            "country": country,
            "tier": 1,
        })

    comp_map = {c["name"]: c["id"] for c in competitions}

    # Generate clubs
    clubs = []
    for club_data in CLUBS_DATA:
        clubs.append({
            "id": str(uuid.uuid4()),
            "name": club_data["name"],
            "short_name": club_data["short"],
            "country": club_data["country"],
            "competition_id": comp_map[club_data["league"]],
            "budget": club_data["budget"],
            "wage_budget": club_data["budget"] * 0.6,
        })

    # Generate players
    players = []
    player_stats = []
    transfers = []
    medical_records = []

    for i in range(count):
        player_id = str(uuid.uuid4())
        club = random.choice(clubs)
        position = random.choice(POSITIONS)
        age = random.choices(
            range(17, 38),
            weights=[2, 4, 6, 8, 10, 12, 14, 14, 12, 10, 8, 6, 5, 4, 3, 2, 2, 1, 1, 1, 1],
        )[0]

        # Overall rating depends on age & randomness
        if age <= 20:
            overall = random.randint(62, 80)
            potential = overall + random.randint(5, 18)
        elif age <= 25:
            overall = random.randint(68, 90)
            potential = overall + random.randint(2, 10)
        elif age <= 30:
            overall = random.randint(72, 92)
            potential = overall + random.randint(0, 3)
        else:
            overall = random.randint(65, 85)
            potential = overall

        potential = min(99, potential)
        attrs = generate_base_stats(position, overall)

        nationality = random.choice(NATIONALITIES)
        name = f"{random.choice(FIRST_NAMES)} {random.choice(LAST_NAMES)}"

        contract_years_left = random.randint(1, 5)
        contract_expiry = date.today() + timedelta(days=365 * contract_years_left)

        # Market value depends on overall, age, potential
        age_factor = max(0.3, 1 - abs(age - 26) * 0.05)
        base_value = (overall ** 2.5) * 10 * age_factor
        market_value = max(500000, int(base_value * random.uniform(0.7, 1.3)))

        salary = max(5000, int(market_value * random.uniform(0.001, 0.003)))

        strengths_pool = STRENGTHS_POOL.get(position, STRENGTHS_POOL.get("CM", []))
        player_strengths = ", ".join(random.sample(strengths_pool, min(4, len(strengths_pool))))
        player_weaknesses = ", ".join(random.sample(WEAKNESSES_POOL, random.randint(2, 4)))

        player = {
            "id": player_id,
            "name": name,
            "full_name": name,
            "date_of_birth": str(date.today() - timedelta(days=age * 365 + random.randint(0, 364))),
            "age": age,
            "nationality": nationality,
            "height": random.randint(165, 198) if position != "GK" else random.randint(182, 200),
            "weight": random.randint(65, 92) if position != "GK" else random.randint(78, 95),
            "preferred_foot": random.choices(["Right", "Left"], weights=[70, 30])[0],
            "position": position,
            "secondary_positions": random.choice(POSITIONS) if random.random() > 0.5 else None,
            "playing_style": random.choice(PLAYING_STYLES),
            "tactical_role": random.choice(TACTICAL_ROLES.get(position, ["General"])),
            "club_id": club["id"],
            "club_name": club["name"],
            "league": next(c["name"] for c in competitions if c["id"] == club["competition_id"]),
            "jersey_number": random.randint(1, 99),
            "contract_expiry": str(contract_expiry),
            "market_value": market_value,
            "salary": salary,
            "release_clause": int(market_value * random.uniform(1.5, 3)) if random.random() > 0.6 else None,
            "agent": random.choice(AGENTS),
            "overall_rating": overall,
            "potential": potential,
            "form": round(random.uniform(5.5, 9.0), 1),
            "availability": random.choices(
                ["Available", "Injured", "Suspended", "International Duty"],
                weights=[80, 12, 3, 5],
            )[0],
            "is_transfer_listed": random.random() < 0.08,
            "weak_foot": random.randint(1, 5),
            "skill_moves": random.randint(1, 5),
            "strengths": player_strengths,
            "weaknesses": player_weaknesses,
            **attrs,
        }
        players.append(player)

        # Generate 2-3 seasons of stats
        for season_offset in range(random.randint(1, 3)):
            season_year = 2025 - season_offset
            season_label = f"{season_year - 1}-{str(season_year)[2:]}"
            minutes = random.randint(500, 3200)
            stats = generate_season_stats(position, overall, minutes)
            stats["id"] = str(uuid.uuid4())
            stats["player_id"] = player_id
            stats["season"] = season_label
            stats["competition"] = player["league"]
            player_stats.append(stats)

        # Generate transfer history (0-3 transfers)
        for t in range(random.randint(0, 3)):
            transfer_year = random.randint(2018, 2025)
            transfers.append({
                "id": str(uuid.uuid4()),
                "player_id": player_id,
                "from_club_name": random.choice(CLUBS_DATA)["name"],
                "to_club_name": club["name"] if t == 0 else random.choice(CLUBS_DATA)["name"],
                "date": str(date(transfer_year, random.choice([1, 7, 8]), random.randint(1, 28))),
                "fee": random.randint(500000, market_value),
                "transfer_type": random.choice(["Permanent", "Loan", "Free Transfer"]),
                "season": f"{transfer_year}-{str(transfer_year + 1)[2:]}",
            })

        # Generate medical records (0-4 injuries)
        for _ in range(random.randint(0, 4)):
            injury_type, body_part, severity = random.choice(INJURY_TYPES)
            days_out = {"Minor": random.randint(7, 21), "Moderate": random.randint(21, 60), "Severe": random.randint(60, 270)}[severity]
            start = date.today() - timedelta(days=random.randint(30, 1000))
            medical_records.append({
                "id": str(uuid.uuid4()),
                "player_id": player_id,
                "injury_type": injury_type,
                "body_part": body_part,
                "severity": severity,
                "start_date": str(start),
                "end_date": str(start + timedelta(days=days_out)),
                "matches_missed": days_out // 7,
                "days_out": days_out,
                "is_recurring": random.random() < 0.2,
            })

    return {
        "competitions": competitions,
        "clubs": clubs,
        "players": players,
        "player_statistics": player_stats,
        "transfers": transfers,
        "medical_records": medical_records,
    }


if __name__ == "__main__":
    print("🌱 Generating ScoutAI seed data...")
    data = generate_players(500)

    output_dir = Path(__file__).parent
    output_file = output_dir / "seed_data.json"

    with open(output_file, "w") as f:
        json.dump(data, f, indent=2, default=str)

    print(f"✅ Generated:")
    print(f"   {len(data['competitions'])} competitions")
    print(f"   {len(data['clubs'])} clubs")
    print(f"   {len(data['players'])} players")
    print(f"   {len(data['player_statistics'])} season statistics")
    print(f"   {len(data['transfers'])} transfers")
    print(f"   {len(data['medical_records'])} medical records")
    print(f"📁 Saved to: {output_file}")
