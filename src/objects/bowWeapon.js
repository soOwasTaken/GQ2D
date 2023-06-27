import k from "../main";
import { Player } from "./player";
import { isGamePaused } from "./pause";
import { ENEMY_SPEED } from "./monster";

const urlParams = new URLSearchParams(window.location.search);
const level = urlParams.has("level") ? parseInt(urlParams.get("level")) : 1;

function bowSprite() {
  if (level == 1) {
    return "bow";
  } else if (level == 2) {
    return "bow_gold";
  } else if (level == 3) {
    return "bow_fire";
  }
}

function arrowSprite() {
  if (level == 1) {
    return "arrow";
  } else if (level == 2) {
    return "arrow_gold";
  } else if (level == 3) {
    return "arrow_fire";
  }
}

export function monsterBow(monster) {
  const ATTACK_DISTANCE = 160;
  let ATTACK_COOLDOWN = 1;
  const ATTACK_DAMAGE = monster.damage;

  const player = Player();

  let monsterDirection = "left";
  let canAttack = true;
  let attackCooldown = false;

  const bow = k.add([
    k.pos(),
    k.sprite(bowSprite(), { anim: "idle" }),
    k.origin("bot"),
    k.rotate(0),
    k.scale(0.8),
    k.follow(monster, vec2(14, 14)), // Adjust the bow's position relative to the monster
    "monsterBow",
    k.area({ scale: 1 }),
  ]);

  let isCharging = false;
  let isReleasing = false;

  function updateMonsterDirection() {
    if (!isGamePaused()) {
      if (player.pos.x > monster.pos.x) {
        monsterDirection = "right";
        monster.flipX(false);
        bow.flipX(false);
        bow.follow.offset = vec2(14, 14);
      } else {
        monsterDirection = "left";
        monster.flipX(true);
        bow.flipX(true);
        bow.follow.offset = vec2(-14, 14);
      }
    }
  }
  monster.onDestroy(() => {
    k.destroy(bow);
  });

  function attack() {
    if (canAttack && !attackCooldown) {
      canAttack = false;
      attackCooldown = true;
      monster.move(0, 0);
      if (!isGamePaused()) {
        monster.play("idle");
      }

      monster.isAttacking = true;
      let initialPlayerPos = player.pos.clone();
      let arrow;
      k.wait(1, () => {
        isCharging = true;
        bow.play("charging");

        let chargingArrow = k.add([
          k.pos(bow.pos.x, bow.pos.y - 12),
          k.sprite(arrowSprite()),
          k.origin("center"),
          k.scale(1),
          k.area({ width: 8, height: 16 }),
          "chargingArrow",
        ]);
        if (monsterDirection === "left") {
          chargingArrow.flipX(true);
        }
        // In the releasing phase
        function attackSpeedBow() {
          if (level == 1) {
            return 0.5;
          } else {
            return 0.3;
          }
        }

        k.wait(attackSpeedBow(), () => {
          // Check if player has moved too far
          if (initialPlayerPos.dist(player.pos) > 120) {
            // Player has moved too far, cancel shot
            k.destroy(chargingArrow);
            canAttack = true;
            attackCooldown = false;
            monster.isAttacking = false;
            bow.play("idle");
            monster.play("run");
            return;
          }
          k.destroy(chargingArrow);
          isReleasing = true;
          // Change the sprite to the release state
          bow.play("idle"); // Set the bow sprite to the charged frame

          const direction = player.pos.sub(bow.pos).unit();

          function arrowSpeedperLevel() {
            if (level == 1) {
              return 150;
            } else {
              return 200;
            }
          }

          // Create a "flying arrow" with the k.move property
          let flyingArrow = k.add([
            k.pos(bow.pos.x, bow.pos.y - 12), // Set the initial position of the arrow
            k.sprite(arrowSprite()), // Replace with the sprite for the arrow
            k.origin("center"),
            k.scale(0.8),
            k.rotate(Math.atan2(direction.y, direction.x) * (180 / Math.PI)),
            k.move(direction, arrowSpeedperLevel()),
            k.outview({ destroy: true }),
            k.lifespan(3.9, { destroy: true }),
            k.area({ width: 8, height: 16 }), // Adjust the arrow's collision area as needed
            "flyingArrow",
          ]);

          function hitboxlevelcolorChanger() {
            if (level == 1) {
              return k.rgb(180, 0, 0);
            } else {
              return k.rgb(0, 180, 180);
            }
          }

          let followCircle = k.add([
            k.pos(flyingArrow.pos.x, flyingArrow.pos.y), // Set the initial position of the circle
            k.color(hitboxlevelcolorChanger()),
            k.circle(8), //
            k.follow(flyingArrow, vec2(0, 0)),
            k.opacity(0.2),
            k.area({ width: 8, height: 8 }),
            k.outview({ destroy: true }),
            k.lifespan(4, {destroy: true} ),
            "followCircle",
            { hit: false },
          ]);
          if (isGamePaused()) {
            flyingArrow.onUpdate(() => {
              k.destroy(flyingArrow);
              k.destroy(followCircle);
            });
          }
          flyingArrow.onUpdate(() => {
            if (flyingArrow.pos.dist(player.pos) <= 30) {
              k.onCollide("flyingArrow", "player", (a, p) => {
                if (!a.hit) {
                  p.hurt(ATTACK_DAMAGE);
                  a.hit = true;
                }
                k.destroy(a);
                k.destroy(followCircle);
              });
            }
          });

          // Set a cooldown before the monster can attack again
          function levelCooldown() {
            if (level == 1) {
              return 2;
            } else {
              return 1;
            }
          }
          k.wait(levelCooldown(), () => {
            canAttack = true;
            attackCooldown = false;
            monster.isAttacking = false;
            //
            // Resume the monster's movement
            monster.move(0, 0);
            monster.play("run");
          });
          // Cleanup function when the monster is destroyed
          monster.onDestroy(() => {
            k.destroy(flyingArrow);
            k.destroy(followCircle);
          });
        });
      });
    }
  }

  function decideAction() {
    if (monster.bowEquiped == true) {
      if (!isCharging && !isReleasing) {
        let direction = player.pos.sub(monster.pos).unit();
        monster.move(direction.scale(monster.speed));
      }
      updateMonsterDirection();
      if (player.pos.dist(monster.pos) <= ATTACK_DISTANCE && !attackCooldown) {
        attack();
      }
    }
  }

  player.onUpdate(() => {
    decideAction();
  });

  monster.on("equipBow", () => {
    decideAction();
  });
}
