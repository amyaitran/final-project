export default function generateRandomLetter() {
  const selectedAlphabet = 'ABCDEFGHIJKLMNOPQRSTUVWY';
  return selectedAlphabet[Math.floor(Math.random() * selectedAlphabet.length)];
}
