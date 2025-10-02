# Dota-Analitics

Pipeline to analyse dota 2 matches and process match, heroes, factions and position stats.

###### Analytic's targets
The stats should be separated by: type (turbo, all picks, ranked), individually (single match)
- Heroes stats: K/D/A, gold, creep score, deny score, level, position, pick rate, win rate.
- Match stats: total, duration, type.
- Faction stats: kills, gold, creep score, deny score.
- Position stats: most picked heroes, 

#### Database Schema
```SQL
-- Hero Table
ID   INTEGER NOT NULL (PK)
NAME TEXT    NOT NULL -- Hero's name

-- Faction Table
ID   INTEGER NOT NULL (PK)
NAME TEXT    NOT NULL -- Faction Name (Radiant, Dire)

-- Match
ID       INTEGER      NOT NULL (PK)
TYPE     INTEGER      NOT NULL      -- 1: Turbo; 2: All Picks; 3 Ranked.
DURATION INTEGER      NOT NULL      -- Match duration in seconds.
WINNERID INTEGER      NOT NULL (FK) -- Foreign key of the winner side.
DATE     TIMESTAMP(3) NOT NULL      -- When the match took place.

-- Position
POSITION   INTEGER NOT NULL (PK) -- (POS)1-(POS)5
NAME       TEXT    NOT NULL      -- Midlane, Hard Carry, Offlane, Sup, Hard-Sup 

-- MatchHero (Heroes present in the match)
MATCHID    INTEGER NOT NULL (FK) -- Match foreign key.
HEROID     INTEGER NOT NULL (FK) -- Hero foreign key.
FACTIONID  INTEGER NOT NULL (FK) -- Which side the hero was on.
POSITION   INTEGER NOT NULL (FK) -- Which position the hero was played.
KILLS      INTEGER NOT NULL
ASSISTS    INTEGER NOT NULL
DEATHS     INTEGER NOT NULL
GOLD       INTEGER NOT NULL
CREEPSCORE INTEGER NOT NULL
DENYSCORE  INTEGER NOT NULL      -- Creeps denied
```

