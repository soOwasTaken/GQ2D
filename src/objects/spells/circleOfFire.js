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
    const damage = 8;

    e.hurt(damage);
    const damageText = k.add([
      k.text(`-${damage}`, {
        size: 8, // text size
        font: "sinko",
      }),
      k.pos(e.pos.x, e.pos.y - 27), // Adjusted position to be above the monster
      k.lifespan(1),
      k.color(160, 0, 160),
      {
        value: -damage,
      },
    ]);

    damageText.onUpdate(() => {
      damageText.move(0, -40 * k.dt());
    });
  });
}
