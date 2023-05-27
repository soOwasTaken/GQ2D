import k from "../main"
import { Player } from "../objects/player"
import { spawnMonsters } from "../objects/monster";
import { playAttackAnimation } from "../objects/attack";
import { map } from "../objects/map";
import { hallebarde } from "../objects/hallebarde";

export function mainScene() {
    map()
    spawnMonsters();
    Player();
    hallebarde();
}


export function loadMainScene() { return k.scene("main", mainScene)}