import k from "../main";
import { Player, getPlayer } from "./player";
import { isGamePaused, togglePause } from "./pause";
import { monsterBow } from "./bowWeapon";

let playerDirection = "right";
let attackingDirection = "right";

let tripleAttack = false;

export function toggleTripleAttack() {
  tripleAttack = !tripleAttack;
}

export function staff() {
  const player = Player();
  let playerDirection = "right";
  let canThrust = true;
  let thrustState = "idle";
  let movingSpikeExists = false;
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
      attackingDirection = playerDirection;
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
          this.angle = playerDirection === "right" ? 0 : 0;
        }

        switch (thrustState) {
          case "raising":
            this.angle =
              attackingDirection === "right"
                ? 90 * (actionProgress / raiseLowerDuration)
                : 270 - 90 * (actionProgress / raiseLowerDuration);
            if (actionProgress >= raiseLowerDuration) {
              this.angle = attackingDirection === "right" ? 90 : 270;
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

              if (!movingSpikeExists) {
                movingSpikeExists = true;

                const spikeAngles = tripleAttack ? [0, 1, -1] : [0];
                const speed = 300;
                const spikeDamage = tripleAttack ? 15 : 30;

                for (let i = 0; i < spikeAngles.length; i++) {
                  let angle = spikeAngles[i];

                  if (attackingDirection === "left") {
                    angle = 180 - angle;
                  }

                  const stationarySpike = k.add([
                    k.sprite("iceSpike", { anim: "spike" }),
                    k.pos(this.pos.x, this.pos.y - 24),
                    k.origin("center"),
                    k.rotate(angle),
                    k.scale(1),
                    k.opacity(0.5),
                    k.lifespan(0.4),
                    "spell",
                  ]);

                  k.wait(0.4, () => {
                    const angleRad = ((angle - 90) * Math.PI) / 180;

                    const movingSpike = k.add([
                      k.sprite("iceSpike", { anim: "spike" }),
                      k.pos(stationarySpike.pos.x, stationarySpike.pos.y),
                      k.origin("center"),
                      k.rotate(angle),
                      k.area({ width: 12, height: 5 }),
                      k.outview({ destroy: true }),
                      k.move(
                        speed * Math.cos(angleRad),
                        -speed * Math.sin(angleRad)
                      ),
                      k.scale(1),
                      {
                        hitMonsters: new Set(),
                        damage: spikeDamage,
                      },
                      "spelld",
                    ]);

                    movingSpike.on("destroy", () => {
                      movingSpikeExists = false;
                    });

                    movingSpike.play("spike");
                    k.onCollide("spelld", "enemy", (s, e) => {
                      if (e.dead != true) {
                        if (!s.hitMonsters.has(e)) {
                          e.hurt(s.damage);
                          s.hitMonsters.add(e);
                          const damageText = k.add([
                            k.text(`-${s.damage}`, {
                              size: 8,
                              font: "sinko",
                            }),
                            k.pos(e.pos.x, e.pos.y - 20),
                            k.lifespan(1),
                            k.color(0, 100, 100),
                            {
                              value: -s.damage,
                            },
                          ]);
                          damageText.onUpdate(() => {
                            damageText.move(0, -40 * k.dt());
                          });
                          s.damage -= 5;
                          if (s.damage <= 0) {
                            k.destroy(s);
                            movingSpikeExists = false;
                          }
                        }
                      }
                    });
                  });
                }
              }
            }
            break;

          case "lowering":
            this.angle =
              attackingDirection === "right"
                ? 90 - 90 * (actionProgress / raiseLowerDuration)
                : 270 + 90 * (actionProgress / raiseLowerDuration);
            if (actionProgress >= raiseLowerDuration) {
              this.angle = attackingDirection === "right" ? 0 : 0;
              actionProgress = 0;
              thrustState = "idle";
              canThrust = true;
            }
            break;
        }
      },
    };
  }
}
