import k from "../../main";
import { Player } from "../player";
import { monsters } from "../monster";

let circleEnabled = false;

export function getCircleEnabled() {
  return circleEnabled;
}

export function setCircleEnabled(value) {
  circleEnabled = value;
}

export function playCircleOfFireAnimation(hitPos) {
  const fireAnim = k.add([
    k.pos(hitPos), // Use the passed hitPos for the fire animation position
    k.sprite("circleOfFire", {
      anim: "Circle",
    }),
    k.origin("center"),
    k.scale(2),
    "circleOfFireAnimation",
    k.area({ scale: 0.5 }),
    k.lifespan(0.5),
  ]);

  // Check collision with monsters and deal damage
  k.onCollide("circleOfFireAnimation", "enemy", (p, e) => {
    // Randomize the damage value between 10 to 15
    const damage = 20;

    e.hurt(damage);
  });
}
