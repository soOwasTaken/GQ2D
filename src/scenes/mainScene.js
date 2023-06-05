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
  let background = k.add([
    k.sprite("TEST"),
    // Make the background centered on the screen
    k.pos(16,16),
    // Allow the background to be scaled
    k.scale(1),
    // Keep the background position fixed even when the camera moves
  ]);
  map();
  //   createMonster(); // to spawn a single monster
  Player();
  initUI();
  hallebarde();
}

export function loadMainScene() {
  return k.scene("main", mainScene);
}
