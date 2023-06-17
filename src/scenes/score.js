let score = 0;

export function incrementScore(value) {
  score += value;
}

export function getScore() {
  return score;
}

export function resetScore() {
  score = 0;
}