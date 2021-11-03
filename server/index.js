require('dotenv/config');
const pg = require('pg');
const express = require('express');
const jsonMiddleware = express.json();
const errorMiddleware = require('./error-middleware');
const staticMiddleware = require('./static-middleware');

const db = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

const app = express();
app.use(staticMiddleware);
app.use(errorMiddleware);
app.use(jsonMiddleware);

app.post('/api/create-game', (req, res, next) => {
  const { gameId } = req.body;
  const questionsPerRound = 8;
  const roundsPerGame = 5;
  const minutesPerRound = 2;
  const sql = `
    insert into "game" ("gameId", "questionsPerRound", "roundsPerGame", "minutesPerRound", "endTime")
    values ($1, $2, $3, $4, $5)
    returning *
    `;
  const params = [gameId, questionsPerRound, roundsPerGame, minutesPerRound, null];
  db.query(sql, params)
    .then(result => {
      const [game] = result.rows;
      res.status(201).json(game);
    })
    .catch(err => next(err));
});

app.post('/api/join-game', (req, res, next) => {
  const { name, gameId } = req.body;
  const roundScore = 0;
  const gameScore = 0;
  const sql = `
    insert into "players" ("name", "gameId", "roundScore", "gameScore")
    values ($1, $2, $3, $4)
    returning *
    `;
  const params = [name, gameId, roundScore, gameScore];
  db.query(sql, params)
    .then(result => {
      const [player] = result.rows;
      res.status(201).json(player);
    })
    .catch(err => next(err));
});

app.listen(process.env.PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`express server listening on port ${process.env.PORT}`);
});
