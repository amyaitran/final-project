require('dotenv/config');
const pg = require('pg');
const express = require('express');
const app = express();
const jsonMiddleware = express.json();
const errorMiddleware = require('./error-middleware');
const staticMiddleware = require('./static-middleware');

const { createServer } = require('http');
const server = createServer(app);

const socketIO = require('socket.io');
const io = socketIO(server);

const db = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

app.use(staticMiddleware);
app.use(errorMiddleware);
app.use(jsonMiddleware);

app.post('/api/game', (req, res, next) => {
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

app.get('/api/prompts', (req, res, next) => {
  const sql = `
    select *
    from "prompts"
    order by random()
    limit 8;
    `;
  db.query(sql)
    .then(result => {
      const prompts = result.rows;
      res.json(prompts);
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: 'An unexpected error occurred.' });
    });
});

server.listen(process.env.PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`server listening on port ${process.env.PORT}`);
});

const nsDesktop = io.of('/desktop');

nsDesktop.on('connection', socket => {
  const { gameId } = socket.handshake.query;

  socket.on('create room', roomCode => {
    socket.join(`room-${roomCode}`);
  });

  socket.on('random letter', letter => {
    socket.join(`room-${gameId}`);
    nsMobile.to(`room-${gameId}`).emit('random letter', letter);
  });

  socket.on('random prompts', data => {
    socket.join(`room-${gameId}`);
    nsMobile.to(`room-${gameId}`).emit('random prompts', data);
  });

  socket.on('timer end', () => {
    socket.join(`room-${gameId}`);
    nsMobile.to(`room-${gameId}`).emit('timer end');
  });

  socket.on('valid name', data => {
    nsMobile.to(data.socketId).emit('valid name', data.isUniqueName);
  });
});

const nsMobile = io.of('/mobile');

nsMobile.on('connection', socket => {
  const { gameId } = socket.handshake.query;
  socket.join(`room-${gameId}`);

  socket.on('create player', data => {
    const arr = Array.from(nsDesktop.adapter.rooms);
    const validRooms = [];
    for (let i = 0; i < arr.length; i++) {
      validRooms.push(arr[i][0]);
    }
    const isCodeValid = validRooms.includes(`room-${gameId}`);
    socket.emit('valid id', isCodeValid);
    if (isCodeValid) {
      nsDesktop.to(`room-${gameId}`).emit('new player', { name: data.name, socketId: socket.id });
    }
  });

  socket.on('start game', () => {
    nsDesktop.to(`room-${gameId}`).emit('start game');
    nsMobile.to(`room-${gameId}`).emit('start game');
  });

  socket.on('submit answers', data => {
    nsMobile.to(`room-${gameId}`).emit('submit answers', data);
  });
});
