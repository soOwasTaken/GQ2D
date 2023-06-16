import k from "../main";
import { monsterWeapon } from "./monsterWeapon";

let gameIsPaused = false;
let levelUpPause = false;
let allowSpawning = true;

export function togglePause() {
  gameIsPaused = !gameIsPaused;
  debug.paused = isGamePaused();
}

export function isGamePaused() {
  return gameIsPaused;
}

export function setGamePaused(value) {
  gameIsPaused = value;
}

export function toggleLevelUpPause() {
  gameIsPaused = !gameIsPaused;
  let objs = get();
  objs.forEach((element) => {
    element.paused = gameIsPaused;
  });
}

export function isLevelUpPaused() {
  return levelUpPause;
}

export function setLevelUpPaused(value) {
  levelUpPause = value;
}

export function setSpawningTo(value) {
  allowSpawning = value;
}

export function isSpawningAllowed() {
  return allowSpawning;
}
