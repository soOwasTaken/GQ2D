import k from "../main";
import { Player } from "../objects/player";

export function hallebarde() {
  const player = Player();
  let playerDirection = "right";
  let canSwing = true; // Flag to track if the sword can be swung

  const sword = k.add([
    k.pos(),
    k.sprite("bone_sword"),
    origin("bot"),
    k.rotate(0),
    k.scale(0.8),
    k.follow(player, vec2(-4, 0)),
    "weapon",
    k.area({ scale: 1 }),
    swing(),
  ]);

  sword.isSwinging = false;

  k.onKeyPress("space", () => {
    if (canSwing) {
      // Check if swinging is allowed
      sword.isSwinging = true;
      sword.startSwing();
      canSwing = false; // Disable swinging temporarily
      startCooldown(0.5); // Start cooldown for 0.5 seconds
    }
  });

  k.onKeyDown("right", () => {
    sword.flipX(true);
    sword.follow.offset = vec2(-4, 0);
    playerDirection = "right";
  });

  k.onKeyDown("left", () => {
    sword.flipX(false);
    sword.follow.offset = vec2(4, 0);
    playerDirection = "left";
  });

  function swing() {
    let swingDuration = 0.5;
    let swingAngle = 90;
    let swingProgress = 0;
    let hitMonsters = new Set();

    return {
      id: "swing",
      startSwing() {
        swingProgress = 0;
        hitMonsters.clear();
      },
      update() {
        if (this.isSwinging) {
          let angleChange = (swingAngle / swingDuration) * k.dt();
          this.angle +=
            playerDirection === "right" ? angleChange : -angleChange;
          swingProgress += k.dt();

          if (swingProgress < swingDuration) {
            k.every("enemy", (enemy) => {
              let dist = enemy.pos.sub(this.pos).len();
              if (dist < swingAngle) {
                let angle = Math.atan2(
                  enemy.pos.y - this.pos.y,
                  enemy.pos.x - this.pos.x
                );
                if (
                  (playerDirection === "right" &&
                    angle >= -Math.PI / 4 &&
                    angle <= Math.PI / 4) ||
                  (playerDirection === "left" &&
                    (angle >= (3 * Math.PI) / 4 || angle <= (-3 * Math.PI) / 4))
                ) {
                  if (!hitMonsters.has(enemy)) {
                    hitMonsters.add(enemy);
                    const damage = 10;
                    enemy.hurt(damage);
                    const damageText = k.add([
                      k.text(`-${damage}`, {
                        size: 8, // text size
                        font: "sinko",
                      }),
                      k.pos(enemy.pos.x, enemy.pos.y - 20), // Adjusted position to be above the monster
                      k.lifespan(1),
                      k.color(255, 0, 0),
                      {
                        value: -damage,
                      },
                    ]);

                    damageText.onUpdate(() => {
                      damageText.move(0, -40 * k.dt());
                    });
                  }
                }
              }
            });
          }

          if (swingProgress >= swingDuration) {
            this.isSwinging = false;
            this.angle = 0;
            swingProgress = 0;
            canSwing = true; // Enable swinging again
          }
        }
      },
    };
  }

  k.on("hurt", "enemy", (e) => {
    shake(3);
  });
  k.on("death", "enemy", (e) => {
    destroy(e);
  });

  // Cooldown function to enable swinging after a certain duration
  function startCooldown(duration) {
    k.wait(duration, () => {
      canSwing = true;
    });
  }
}
