import k from "../main";
import { Player } from "../objects/player";
import { spawnMonsters } from "../objects/monster";
import { playAttackAnimation } from "../objects/attack";
import { map } from "../objects/map";
import { hallebarde } from "../objects/hallebarde";
import { createMonster } from "../objects/monster";
import { initUI } from "./ui";

export function mainScene() {
  k.layers(
    [
      "game", // your game layer
      "ui", // your UI layer
    ],
    "game"
  ); // "game" is the default layer
  map();
  spawnMonsters();
  //   createMonster(); // to spawn a single monster
  Player();
  initUI();
  hallebarde();
}

export function loadMainScene() {
  return k.scene("main", mainScene);
}
