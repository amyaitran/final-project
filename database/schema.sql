set client_min_messages to warning;

-- DANGER: this is NOT how to do it in the real world.
-- `drop schema` INSTANTLY ERASES EVERYTHING.
drop schema "public" cascade;

create schema "public";

CREATE TABLE "players" (
	"playerId" serial NOT NULL,
	"name" TEXT NOT NULL,
	"roundScore" integer NOT NULL,
	"gameScore" integer NOT NULL,
	"gameId" TEXT NOT NULL,
	CONSTRAINT "players_pk" PRIMARY KEY ("playerId")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "game" (
	"gameId" TEXT NOT NULL UNIQUE,
	"questionsPerRound" int NOT NULL,
	"roundsPerGame" int NOT NULL,
	"minutesPerRound" int NOT NULL,
	"endTime" timestamptz,
	CONSTRAINT "game_pk" PRIMARY KEY ("gameId")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "playerAnswers" (
  "playerId" int NOT NULL,
	"firstAnswer" TEXT,
	"secondAnswer" TEXT,
	"promptId" int NOT NULL,
	"gameId" TEXT NOT NULL
) WITH (
  OIDS=FALSE
);



CREATE TABLE "prompts" (
	"promptId" serial NOT NULL,
	"question" TEXT NOT NULL,
	CONSTRAINT "prompts_pk" PRIMARY KEY ("promptId")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "gamePrompts" (
	"randomLetter" TEXT NOT NULL,
	"promptId" int NOT NULL,
	"gameId" TEXT NOT NULL
) WITH (
  OIDS=FALSE
);



ALTER TABLE "players" ADD CONSTRAINT "players_fk0" FOREIGN KEY ("gameId") REFERENCES "game"("gameId");


ALTER TABLE "playerAnswers" ADD CONSTRAINT "playerAnswers_fk0" FOREIGN KEY ("promptId") REFERENCES "prompts"("promptId");
ALTER TABLE "playerAnswers" ADD CONSTRAINT "playerAnswers_fk1" FOREIGN KEY ("gameId") REFERENCES "game"("gameId");
ALTER TABLE "playerAnswers" ADD CONSTRAINT "playerAnswers_fk2" FOREIGN KEY ("playerId") REFERENCES "players"("playerId");


ALTER TABLE "gamePrompts" ADD CONSTRAINT "gamePrompts_fk0" FOREIGN KEY ("promptId") REFERENCES "prompts"("promptId");
ALTER TABLE "gamePrompts" ADD CONSTRAINT "gamePrompts_fk1" FOREIGN KEY ("gameId") REFERENCES "game"("gameId");
