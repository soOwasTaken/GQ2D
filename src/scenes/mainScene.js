import k from "../main";
import { Player } from "../objects/player";
import { spawnMonsters } from "../objects/monster";
import { playAttackAnimation } from "../objects/spells/attack";
import { map } from "../objects/map";
import { map2 } from "../objects/map2";
import { hallebarde } from "../objects/hallebarde";
import { createMonster } from "../objects/monster";
import { initUI } from "./ui";
import { playCircleOfFireAnimation } from "../objects/spells/circleOfFire";
import { spawnTornadoes } from "../objects/spells/tornados";
import { isGamePaused } from "../objects/pause";
import { resetScore } from "./score";
import { resetMonsterAI } from "../objects/monster";

const urlParams = new URLSearchParams(window.location.search);
const level = urlParams.get("level") || 1; // Default to level 1 if no level parameter is provided
console.log(`Loading level ${level}`);

export function mainScene() {
  k.layers(
    [
      "game", // your game layer
      "ui", // your UI layer
    ],
    "game"
  ); // "game" is the default layer
  if (level == 1) {
    console.log("Loading map for level 1");
    map();
    hallebarde();
    playCircleOfFireAnimation();
  } else if (level == 2) {
    console.log("Loading map for level 2");
    map2();
  }
  // createMonster(); // to spawn a single monster
  Player();
  initUI();
}

export function loadMainScene() {
  resetScore();
  return k.scene("main", mainScene);
}

export function startScene() {
  k.add([
    k.text("Play", 32), // Change the size as necessary
    k.pos(k.width() / 2, k.height() / 2), // Center the button
    k.origin("center"),
  ]);
  k.add([
    k.text("Press any key to start"), // Change the size as necessary
    k.pos(k.width() / 2, k.height() / 2 + 50), // Center the button
    k.origin("center"),
    k.scale(0.3),
  ]);

  // Start game when any key is pressed
  k.onKeyPress(() => {
    loadMainScene();
    k.go("main");
    resetMonsterAI();
  });
}

export function loadStartScene() {
  return k.scene("start", startScene);
}
