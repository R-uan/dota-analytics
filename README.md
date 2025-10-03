# Dota-Analitics

Pipeline to analyse dota 2 matches and process match, heroes, factions and position stats.

#### Analytic's targets

##### Match-Level Stats
- [x] Total matches played
- [x] Average match duration
- [x] Average kills/assists/deaths per match
- [x] Stats split by gamemode (Turbo/All Pick/Competitive)
- [x] Distribution of match types (percentages, not just counts)

##### Hero-Level Stats
- [x] Pick rate per hero
- [x] Win rate per hero (wins when picked vs losses when picked)
- [x] Average KDA (kills, deaths, assists) per hero
- [x] Average gold, XP, and creep score per hero
- [x] Most popular position(s) a hero is played in
- [x] Average KDA and CS/DN per position played

##### Faction-Level Stats
- [x] Average kills/gold/CS per faction
- [x] Win rate per faction (Radiant vs Dire)
- [x] Stats split by gamemode (Turbo/All Pick/Competitive)

##### Role-Level Stats (if you model positions)
- [x] Average gold/CS per position

#### Database Schema
```SQL
-- Hero Table
ID   INTEGER NOT NULL (PK)
NAME TEXT    NOT NULL -- Hero's name

-- Faction Table
ID   INTEGER NOT NULL (PK) -- 0 = Radiant; 1 = Dire
NAME TEXT    NOT NULL      -- Faction Name (Radiant, Dire)

-- Match
ID       INTEGER      NOT NULL (PK)
TYPE     INTEGER      NOT NULL      -- 0 = All Picks; 2 = Ranked; 3 = Turbo
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

