export default function createGameId() {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let gameId = '';
  for (let i = 0; i < 4; i++) {
    gameId += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return gameId;
}
