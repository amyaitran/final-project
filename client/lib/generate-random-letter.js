export default function createGameId() {
  const selectedAlphabet = 'ABCDEFGHIJKLMNOPQRSTUVWY';
  return selectedAlphabet[Math.floor(Math.random() * selectedAlphabet.length)];
}
