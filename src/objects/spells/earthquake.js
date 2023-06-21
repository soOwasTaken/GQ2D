import k from "../../main";
import { isGamePaused } from "../pause";

export function earthquake() {
  setInterval(() => {
    if (!isGamePaused()) {
      k.shake(15);
      k.every("enemy", (enemy) => {
        if (enemy.damaged) {
          return;
        }
          enemy.damaged = true;
          if (enemy.dead != true) {
              enemy.hurt(10);
              const damageText = k.add([
                  k.text(`-10`, {
                      size: 8,
                      font: "sinko",
                  }),
                  k.pos(enemy.pos.x, enemy.pos.y - 20),
                  k.lifespan(1),
                  k.color(255, 0, 0),
                  {
                      value: -10,
                  },
              ]);
              damageText.onUpdate(() => {
                  damageText.move(0, -40 * k.dt());
              });
              k.wait(1, () => {
                  enemy.damaged = false;
              });
          }
      });
    }
  }, 20000);
}