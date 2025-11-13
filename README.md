# Dota 2 Analytics Pipeline

A comprehensive data pipeline for analyzing Dota 2 matches, processing statistics across matches, heroes, factions, and player positions.

## 📊 Analytics Features

### Match-Level Statistics
Track and analyze overall match performance metrics:

- ✅ Total matches played
- ✅ Average match duration
- ✅ Average kills/assists/deaths per match
- ✅ Stats segmented by game mode (Turbo/All Pick/Ranked)
- ✅ Match type distribution (percentages and counts)

### Hero-Level Statistics
Deep dive into individual hero performance:

- ✅ **Pick Rate** - Frequency each hero is selected
- ✅ **Win Rate** - Success rate when hero is picked
- ✅ **Average KDA** - Kills, deaths, and assists per hero
- ✅ **Economy Metrics** - Average gold, XP, and creep score
- ✅ **Position Analysis** - Most common positions per hero
- ✅ **Role Performance** - KDA and CS/DN breakdown by position

### Faction-Level Statistics
Compare Radiant vs Dire performance:

- ✅ Average kills per faction
- ✅ Average gold per faction
- ✅ Average creep score per faction
- ✅ Win rate comparison (Radiant vs Dire)
- ✅ Stats segmented by game mode

### Position-Level Statistics
Analyze performance by player role:

- ✅ Average gold per position
- ✅ Average creep score per position
- ✅ Cross-position performance comparison

## 🗄️ Database Schema

### Hero
Stores information about Dota 2 heroes.

| Column | Type    | Constraints | Description |
|--------|---------|-------------|-------------|
| ID     | INTEGER | NOT NULL, PK | Unique hero identifier |
| NAME   | TEXT    | NOT NULL     | Hero name |

### Faction
Represents the two teams in Dota 2.

| Column | Type    | Constraints | Description |
|--------|---------|-------------|-------------|
| ID     | INTEGER | NOT NULL, PK | Faction identifier (0 = Radiant, 1 = Dire) |
| NAME   | TEXT    | NOT NULL     | Faction name |

### Match
Core match information and results.

| Column   | Type         | Constraints | Description |
|----------|--------------|-------------|-------------|
| ID       | INTEGER      | NOT NULL, PK | Unique match identifier |
| TYPE     | INTEGER      | NOT NULL     | Game mode (0 = All Pick, 2 = Ranked, 3 = Turbo) |
| DURATION | INTEGER      | NOT NULL     | Match duration in seconds |
| WINNERID | INTEGER      | NOT NULL, FK | Winning faction (references Faction.ID) |
| DATE     | TIMESTAMP(3) | NOT NULL     | Match timestamp |

### Position
Player positions/roles in the game.

| Column   | Type    | Constraints | Description |
|----------|---------|-------------|-------------|
| POSITION | INTEGER | NOT NULL, PK | Position number (1-5) |
| NAME     | TEXT    | NOT NULL     | Position name (Midlane, Hard Carry, Offlane, Support, Hard Support) |

### MatchHero
Links heroes to matches with detailed performance statistics.

| Column     | Type    | Constraints | Description |
|------------|---------|-------------|-------------|
| MATCHID    | INTEGER | NOT NULL, FK | References Match.ID |
| HEROID     | INTEGER | NOT NULL, FK | References Hero.ID |
| FACTIONID  | INTEGER | NOT NULL, FK | References Faction.ID |
| POSITION   | INTEGER | NOT NULL, FK | References Position.POSITION |
| KILLS      | INTEGER | NOT NULL     | Number of kills |
| ASSISTS    | INTEGER | NOT NULL     | Number of assists |
| DEATHS     | INTEGER | NOT NULL     | Number of deaths |
| GOLD       | INTEGER | NOT NULL     | Total gold earned |
| CREEPSCORE | INTEGER | NOT NULL     | Creeps killed (last hits) |
| DENYSCORE  | INTEGER | NOT NULL     | Creeps denied |

## 📝 Notes

- **Match Types**:
  - `0` = All Pick (standard unranked)
  - `2` = Ranked (competitive matchmaking)
  - `3` = Turbo (accelerated game mode)

- **Factions**:
  - `0` = Radiant (bottom-left team)
  - `1` = Dire (top-right team)

- **Positions**: Numbered 1-5 following standard Dota 2 conventions
  - Position 1: Hard Carry (Safelane)
  - Position 2: Midlane
  - Position 3: Offlane
  - Position 4: Soft Support
  - Position 5: Hard Support
