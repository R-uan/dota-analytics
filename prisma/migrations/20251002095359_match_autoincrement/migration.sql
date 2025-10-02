-- AlterTable
CREATE SEQUENCE match_id_seq;
ALTER TABLE "Match" ALTER COLUMN "id" SET DEFAULT nextval('match_id_seq');
ALTER SEQUENCE match_id_seq OWNED BY "Match"."id";
