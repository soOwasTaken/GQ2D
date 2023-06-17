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

export function mainScene() {
  k.layers(
    [
      "game", // your game layer
      "ui", // your UI layer
    ],
    "game"
  ); // "game" is the default layer
  map();
  // createMonster(); // to spawn a single monster
  Player();
  initUI();
  hallebarde();
  playCircleOfFireAnimation();
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
