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

const io = socketIO(server);

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
      if (player) {
        res.status(201).json(player);
      } else {
        res.status(404).json({ error: 'invalid game code' });
      }
    })
    .catch(err => next(err));
});

server.listen(process.env.PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`server listening on port ${process.env.PORT}`);
});

const nsDesktop = io.of('/desktop');

nsDesktop.on('connection', socket => {
  socket.on('create room', roomCode => {
    socket.join(`room-${roomCode}`);
  });
});

const nsMobile = io.of('/mobile');

nsMobile.on('connection', socket => {
  const { gameId } = socket.handshake.query;
  const arr = Array.from(nsDesktop.adapter.rooms);
  const validRooms = [];
  for (let i = 0; i < arr.length; i++) {
    validRooms.push(arr[i][0]);
  }
  socket.on('create player', data => {
    if (validRooms.includes(`room-${gameId}`)) {
      socket.emit('valid id', true);
      socket.join(`room-${gameId}`);
      nsDesktop.to(`room-${gameId}`).emit('new player', data);
    } else {
      socket.emit('valid id', false);
    }
  });
});
