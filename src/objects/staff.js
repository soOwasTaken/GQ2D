import k from "../main";
import { Player, getPlayer } from "./player";
import { isGamePaused, togglePause } from "./pause";

let playerDirection = "right";
let attackingDirection = "right"; // Default attacking direction

export function staff() {
  const player = Player();
  let playerDirection = "right";
  let canThrust = true;
  let thrustState = "idle";

  const staff = k.add([
    k.pos(player.pos.x, player.pos.y),
    k.sprite("staff"),
    k.origin("center"),
    k.rotate(0),
    k.scale(0.87),
    "weapon",
    thrust(),
  ]);

  k.onKeyPress("space", () => {
    if (canThrust && thrustState === "idle") {
      canThrust = false;
      thrustState = "raising";
      attackingDirection = playerDirection; // Save the player direction when starting an attack
    }
  });

  k.onKeyDown(["right", "d"], () => {
    if (!isGamePaused()) {
      if (thrustState === "idle") {
        staff.rotate = 0;
        staff.flipX(true);
      }
    }
    playerDirection = "right";
  });

  k.onKeyDown(["left", "q"], () => {
    if (!isGamePaused()) {
      if (thrustState === "idle") {
        staff.flipX(false);
        staff.rotate = 0;
      }
    }
    playerDirection = "left";
  });

  function thrust() {
    const raiseLowerDuration = 0.15;
    const thrustDuration = 0.15;
    const thrustDistance = 135;
    let actionProgress = 0;

    return {
      id: "thrust",
      update() {
        this.pos.x = player.pos.x + (playerDirection === "left" ? 8 : -8);
        this.pos.y = player.pos.y;

        if (thrustState !== "idle") {
          actionProgress += k.dt();
        } else {
          this.angle = playerDirection === "right" ? 0 : 0; // Reset the staff rotation based on the player's direction
        }

        switch (thrustState) {
          case "raising":
            this.angle =
              attackingDirection === "right"
                ? 90 * (actionProgress / raiseLowerDuration)
                : 270 - 90 * (actionProgress / raiseLowerDuration); // Adjust the rotation for left-facing direction
            if (actionProgress >= raiseLowerDuration) {
              this.angle = attackingDirection === "right" ? 90 : 270; // Force the angle to be exactly 90 (or 270)
              actionProgress = 0;
              thrustState = "thrusting";
            }
            break;

          case "thrusting":
            let distanceChange = (thrustDistance / thrustDuration) * k.dt();
            this.pos.x +=
              attackingDirection === "right" ? distanceChange : -distanceChange;
            if (actionProgress >= thrustDuration) {
              actionProgress = 0;
              thrustState = "lowering";
              const stationarySpike = k.add([
                k.sprite("iceSpike", { anim: "spike" }),
                k.pos(this.pos.x, this.pos.y - 24),
                k.origin("center"),
                k.rotate(0),
                k.scale(0.4),
                k.opacity(0.5),
                k.lifespan(0.4),
                "spell",
              ]);
              if (attackingDirection === "left") {
                stationarySpike.flipX(true);
              }
              k.wait(0.4, () => {
                const movingSpike = k.add([
                  k.sprite("iceSpike", { anim: "spike" }),
                  k.pos(stationarySpike.pos.x, stationarySpike.pos.y),
                  k.origin("center"),
                  k.rotate(0),
                  k.area({ width: 12, height: 5 }),
                  k.outview({ destroy: true }),
                  attackingDirection === "right"
                    ? k.move(0, 200)
                    : k.move(0, -200),
                  k.scale(0.4),
                  {
                    hitMonsters: new Set(),
                    damage: 10,
                  },
                  "spelld",
                ]);
                if (attackingDirection === "left") {
                  movingSpike.flipX(true);
                }

                movingSpike.play("spike");
                k.every("enemy", (enemy) => {
                  k.onCollide("spelld", "enemy", (s, e) => {
                    if (!s.hitMonsters.has(e)) {
                      e.hurt(s.damage);
                      s.hitMonsters.add(e);
                      const damageText = k.add([
                        k.text(`-${s.damage}`, {
                          size: 8, // text size
                          font: "sinko",
                        }),
                        k.pos(e.pos.x, e.pos.y - 20), // Adjusted position to be above the monster
                        k.lifespan(1),
                        k.color(0, 100, 100),
                        {
                          value: -s.damage,
                        },
                      ]);
                      damageText.onUpdate(() => {
                        damageText.move(0, -40 * k.dt());
                      });
                      // Reduce the damage after each hit.
                      s.damage -= 2;
                      // If the damage is zero or less, destroy the moving spike.
                      if (s.damage <= 0) {
                        k.destroy(s);
                      }
                    }
                  });
                });
              });
            }
            break;

          case "lowering":
            this.angle =
              attackingDirection === "right"
                ? 90 - 90 * (actionProgress / raiseLowerDuration)
                : 270 + 90 * (actionProgress / raiseLowerDuration);
            if (actionProgress >= raiseLowerDuration) {
              this.angle = attackingDirection === "right" ? 0 : 0; // Force the angle to be exactly 0 (or 180)
              actionProgress = 0;
              thrustState = "idle";
              canThrust = true;
            }
            break;
        }
      },
    };
  }
  k.on("death", "enemy", (e) => {
    destroy(e);
  });
}
