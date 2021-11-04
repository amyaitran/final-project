require('dotenv/config');
const pg = require('pg');
const express = require('express');
const app = express();
const jsonMiddleware = express.json();
const errorMiddleware = require('./error-middleware');
const staticMiddleware = require('./static-middleware');

const { createServer } = require('http');
const socketIO = require('socket.io');
const server = createServer(app);

const io = socketIO(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
});

const db = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

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
    select $1, $2, $3, $4
    where exists (select 1
                  from "game"
                  where "gameId" = $2)
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

server.listen(process.env.PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`express server listening on port ${process.env.PORT}`);
});

io.on('connection', socket => {
  console.log('New client connected');

  // socket.on('incoming data', data => {
  //   socket.broadcast.emit('outgoing data', { num: data });
  // });

  socket.on('disconnect', () => console.log('Client disconnected'));
});
