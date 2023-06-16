import k from "../../main";
import { Player } from "../player";
import { monsters } from "../monster";
import { isGamePaused } from "../pause";

export function playAttackAnimation() {
    const player = Player();

    const attackAnim = k.add([
        k.pos(player.pos),
        k.sprite("attack", {
            anim: "1",
        }),
        k.origin("center"),
        k.scale(1),
        "attackAnimation",
        k.follow(player, vec2(-4, 9)),
        k.rotate(0),
        k.area({ scale: 0.5 }),
    ]);

    k.onKeyDown("left", () => {
        attackAnim.flipX(true);
    });
    k.onKeyDown("right", () => {
        attackAnim.flipX(false);
    });

    // Play the animation
    attackAnim.play("1", { loop: true });
    
    // Check collision with monsters and deal damage
    k.onCollide("attackAnimation", "enemy", (p, e) => {
      const damage = 5;
      e.hurt(damage);
      const damageText = k.add([
        k.text(`-${damage}`, {
          size: 8, // text size
          font: "sinko",
        }),
        k.pos(e.pos.x, e.pos.y - 20), // Adjusted position to be above the monster
        k.lifespan(1),
        k.color(255, 0, 0),
        {
          value: -damage,
        },
      ]);

      damageText.onUpdate(() => {
        damageText.move(0, -40 * k.dt());
      });
    });
}
