export default function generateRandomLetter() {
  const selectedAlphabet = 'ABCDEFGHIJKLMNOPQRSTVW';
  return selectedAlphabet[Math.floor(Math.random() * selectedAlphabet.length)];
}
