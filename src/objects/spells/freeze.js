import k from "../../main";
import { Player } from "../player";
import { getEnemySpeed, monsters } from "../monster";

let freezingEnabled = false;

export function getFreezingEnabled() {
  return freezingEnabled;
}

export function setFreezingEnabled(value) {
  freezingEnabled = value;
}

export function playFreezingAnimation(hitPos) {
  const freezingAnimation = k.add([
    k.pos(hitPos), // Use the passed hitPos for the fire animation position
    k.sprite("Freeze", {
      anim: "freezing",
    }),
    k.origin("center"),
    k.scale(1),
    k.area(0.3),
    "FreezingEnemy",
    k.lifespan(3),
  ]);
  k.on("death", "enemy", (e) => {
    destroy(freezingAnimation.destroy());
  });
}

