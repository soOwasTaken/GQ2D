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
  debug.paused = true;
};

export function loadMainScene() {
  return k.scene("main", mainScene);
}

