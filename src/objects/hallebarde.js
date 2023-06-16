import k from "../main";
import { Player, getPlayer } from "./player";
import { isGamePaused, togglePause } from "./pause";
import { getFreezingEnabled, playFreezingAnimation } from "./spells/freeze";
import {
  getCircleEnabled,
  playCircleOfFireAnimation,
} from "./spells/circleOfFire";

let playerDirection = "right";

function getAttackArea(playerDirection) {
  const player = Player();
  const playerPos = player.pos;
  const width = 90; // Width of the attack area
  const height = 30; // Height of the attack area

  if (playerDirection === "right") {
    return {
      x: playerPos.x,
      y: playerPos.y - height / 2,
      width: width,
      height: height,
    };
  }
  if (playerDirection === "left") {
    return {
      x: playerPos.x - width,
      y: playerPos.y - height / 2,
      width: width,
      height: height,
    };
  }
}

export function hallebarde() {
  const player = Player();
  let playerDirection = "right";
  let canThrust = true;
  let thrustState = "idle";
  let circleEnabled = false;

  const spear = k.add([
    k.pos(player.pos.x, player.pos.y),
    k.sprite("bone_spear"),
    k.origin("center"),
    k.rotate(0), // Start with spear held horizontally
    k.scale(0.8),
    "weapon",
    thrust(),
  ]);

  k.onKeyPress("space", () => {
    if (canThrust && thrustState === "idle") {
      canThrust = false;
      thrustState = "raising";
    }
  });

  k.onKeyDown("right", () => {
    if (!isGamePaused()) {
      if (thrustState === "idle") {
        spear.rotate = 0;
        spear.flipX(true);
      }
    }
    playerDirection = "right";
  });

  k.onKeyDown("left", () => {
    if (!isGamePaused()) {
      if (thrustState === "idle") {
        spear.flipX(false);
        spear.rotate = 0; // Flip the spear manually instead of using flipX*
      }
    }
    playerDirection = "left";
  });

  function thrust() {
    const raiseLowerDuration = 0.15;
    const thrustDuration = 0.15;
    const thrustDistance = 135;
    const hitMonsters = new Set();
    let actionProgress = 0;

    return {
      id: "thrust",
      update() {
        this.pos.x = player.pos.x + (playerDirection === "right" ? 10 : -10);
        this.pos.y = player.pos.y;

        if (thrustState !== "idle") {
          actionProgress += k.dt();
        } else {
          this.angle = playerDirection === "right" ? 0 : 0; // Reset the spear rotation based on the player's direction
        }

        switch (thrustState) {
          case "raising":
            this.angle =
              playerDirection === "right"
                ? 90 * (actionProgress / raiseLowerDuration)
                : 180 + 90 * (actionProgress / raiseLowerDuration);
            if (actionProgress >= raiseLowerDuration) {
              this.angle = playerDirection === "right" ? 90 : 270; // Force the angle to be exactly 90 (or 270)
              actionProgress = 0;
              thrustState = "thrusting";
            }
            break;

          case "thrusting":
            let distanceChange = (thrustDistance / thrustDuration) * k.dt();
            this.pos.x +=
              playerDirection === "right" ? distanceChange : -distanceChange;

            const attackArea = getAttackArea(playerDirection);
            //  const hitbox = k.add([
            //    k.rect(attackArea.width, attackArea.height),
            //    k.pos(attackArea.x, attackArea.y),
            //    k.color(255, 0, 0),
            //    k.lifespan(0.1), // Set lifespan to 0.1s
            //    k.opacity(0.3),
            //  ]);

            const thrustSfx = k.add([
              k.sprite("ThrustSfx", { anim: "hit" }),
              k.pos(this.pos.x, this.pos.y),
              k.origin("center"),
              k.scale(1),
              k.opacity(0.4),
              k.lifespan(0.25),
            ]);

            if (playerDirection === "left") {
              thrustSfx.flipX();
            }

            // deal damage to enemies in a front line where the player is facing
            k.every("enemy", (enemy) => {
              const attackArea = getAttackArea(playerDirection);
              const isWithinXBounds =
                enemy.pos.x >= attackArea.x &&
                enemy.pos.x <= attackArea.x + attackArea.width;
              const isWithinYBounds =
                enemy.pos.y >= attackArea.y &&
                enemy.pos.y <= attackArea.y + attackArea.height;

              if (isWithinXBounds && isWithinYBounds) {
                if (
                  (playerDirection === "right" && enemy.pos.x > this.pos.x) ||
                  (playerDirection === "left" && enemy.pos.x < this.pos.x)
                ) {
                  if (!hitMonsters.has(enemy)) {
                    hitMonsters.add(enemy);
                    const damage = 10;
                    enemy.hurt(damage);
                    if (getFreezingEnabled()) {
                      const randomChance = Math.random();
                      if (randomChance <= 0.5) {
                        playFreezingAnimation(enemy.pos);
                        enemy.isFrozen = true;
                        if (enemy.isFrozen == true) {
                          enemy.originalEnemySpeed = enemy.enemySpeed;
                          enemy.enemySpeed = 0;
                          setTimeout(() => {
                            enemy.isFrozen = false;
                            enemy.enemySpeed = enemy.originalEnemySpeed;
                          }, 3000);
                        }
                      }
                    }
                    if (getCircleEnabled()) {
                      const randomChance = Math.random();
                      if (randomChance <= 0.2) {
                        playCircleOfFireAnimation(enemy.pos);
                      }
                    }

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
                    shake(3);
                    k.add([
                      k.sprite("hit_thrust", { anim: "hit" }),
                      k.pos(
                        playerDirection === "right"
                          ? this.pos.x + 30
                          : this.pos.x - 30,
                        this.pos.y
                      ),
                      k.origin("center"),
                      k.lifespan(0.3), // Adjust as necessary
                    ]);
                  }
                }
              }
            });
            if (actionProgress >= thrustDuration) {
              actionProgress = 0;
              thrustState = "lowering";
              hitMonsters.clear();
            }
            break;

          case "lowering":
            this.angle =
              playerDirection === "right"
                ? 90 - 90 * (actionProgress / raiseLowerDuration)
                : 270 + 90 * (actionProgress / raiseLowerDuration);
            if (actionProgress >= raiseLowerDuration) {
              this.angle = playerDirection === "right" ? 0 : 0; // Force the angle to be exactly 0 (or 180)
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
