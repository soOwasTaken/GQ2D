import k from "../main";
import { Player } from "./player";
const urlParams = new URLSearchParams(window.location.search);
const level = urlParams.get("level") || 1;

function weaponSprite() {
  if (level == 1) {
    return ("bone_axe");
  }
  else if (level == 2) {
    return ("gold_sword");
  }
}

export function monsterWeapon(monster) {
  const ATTACK_DISTANCE = 35;
  const ATTACK_COOLDOWN = 1;
  const ATTACK_DAMAGE = 10;

  const player = Player();

  let monsterDirection = "left";
  let canAttack = true;
  let attackCooldown = false;

  const weapon = k.add([
    k.pos(),
    k.sprite(weaponSprite()),
    k.origin("bot"),
    k.rotate(0),
    k.scale(1),
    k.follow(monster, vec2(-8, 0)), // Adjust the weapon's position relative to the monster
    "monsterWeapon",
    k.area({ scale: 1 }),
    swing(),
  ]);

  weapon.isSwinging = false;

  function swing() {
    let swingDuration = 0.3;
    let swingAngle = 160;
    let swingProgress = 0;
    let hitPlayer = false; // Flag to track if the player has been hit by the swing

    let initialAngle = monster.flipX() ? -swingAngle : swingAngle;

    return {
      id: "swing",
      startSwing() {
        swingProgress = 0;
        hitPlayer = false;
      },
      update() {
        if (this.isSwinging) {
          let angleChange = (initialAngle / swingDuration) * k.dt();
          this.angle +=
            monsterDirection === "right" ? angleChange : -angleChange;
          swingProgress += k.dt();

          if (swingProgress < swingDuration) {
            if (!hitPlayer) {
              hitPlayer = true;

              // Inflict damage on the player
              player.hurt(ATTACK_DAMAGE);

              // Display debug text "hit" above the player
              const hitText = k.add([
                k.text("hit", { size: 20, font: "sinko" }),
                k.pos(player.pos.x, player.pos.y - 50), // Adjust the position as needed
                k.lifespan(1), // Set the lifespan of the text
              ]);

              // Adjust the hit text's position on update
              hitText.onUpdate(() => {
                hitText.pos.x = player.pos.x;
                hitText.pos.y = player.pos.y - 50;
              });
            }
          }

          if (swingProgress >= swingDuration) {
            this.isSwinging = false;
            this.angle = 0;
            swingProgress = 0;
            hitPlayer = false;
          }
        }
      },
    };
  }

  function updateMonsterDirection() {
    if (player.pos.x > monster.pos.x) {
      monsterDirection = "right";
      weapon.follow.offset = vec2(-8, 0);
      weapon.flipX(false);
    } else {
      monsterDirection = "left";
      weapon.follow.offset = vec2(8, 0);
      weapon.flipX(true);
    }
  }
  k.loop(1, () => {
    updateMonsterDirection();
  });

  // Function to handle the monster's attack logic
  function attack() {
    if (
      canAttack &&
      !attackCooldown &&
      player.pos.dist(monster.pos) <= ATTACK_DISTANCE
    ) {
      canAttack = false;
      attackCooldown = true;

      // Stop the monster's movement
      monster.move(0, 0);

      // Set monster.isAttacking to true when the monster starts attacking
      monster.isAttacking = true;

      // Start the swing animation
      weapon.isSwinging = true;
      weapon.startSwing();

      // Set a cooldown before the monster can attack again
      k.wait(ATTACK_COOLDOWN, () => {
        canAttack = true;
        attackCooldown = false;
        monster.isAttacking = false;

        // Resume the monster's movement
        monster.move(0, 0);
      });
    }
  }
  // Check for attacks on every frame
  k.loop(1, () => {
    attack();
  });

  // Cleanup function when the monster is destroyed
  if (level == 1) {
    monster.onDestroy(() => {
      k.destroy(weapon);
    });
  } else if (level == 2) {
    monster.on("death", () => {
      k.destroy(weapon);
    });
  }

  k.loop(1, () => {
    if (!weapon.isSwinging) {
      // Add this condition to prevent movement when attacking
      let direction = player.pos.sub(monster.pos).unit();
      monster.move(direction.scale(monster.speed));
    }
    updateMonsterDirection();
    attack();
  });
}


export function ShieldAndAxe(monster) {
  const ATTACK_DISTANCE = 43;
  const ATTACK_COOLDOWN = 2;
  const ATTACK_DAMAGE = 50;

  const player = Player();

  let monsterDirection = "left";
  let canAttack = true;
  let attackCooldown = false;

  const weapon = k.add([
    k.pos(),
    k.sprite("gold_axe"),
    k.origin("bot"),
    k.rotate(0),
    k.scale(1.2),
    k.follow(monster, vec2(16, 16)), // Adjust the weapon's position relative to the monster
    "monsterWeapon",
    k.area({ scale: 1 }),
    swing(),
  ]);
  const shield = k.add([
    k.pos(),
    k.sprite("shield"),
    k.origin("bot"),
    k.rotate(0),
    k.scale(1),
    k.follow(monster, vec2(-16, 16)),
  ]);

  weapon.isSwinging = false;

  function swing() {
    let swingDuration = 0.3;
    let swingAngle = 160;
    let swingProgress = 0;
    let hitPlayer = false; // Flag to track if the player has been hit by the swing

    let initialAngle = monster.flipX() ? -swingAngle : swingAngle;

    return {
      id: "swing",
      startSwing() {
        swingProgress = 0;
        hitPlayer = false;
      },
      update() {
        if (this.isSwinging) {
          let angleChange = (initialAngle / swingDuration) * k.dt();
          this.angle +=
            monsterDirection === "right" ? angleChange : -angleChange;
          swingProgress += k.dt();

          if (swingProgress < swingDuration) {
            if (!hitPlayer) {
              hitPlayer = true;

              // Inflict damage on the player
              player.hurt(ATTACK_DAMAGE);

              // Display debug text "hit" above the player
              const hitText = k.add([
                k.text("hit", { size: 20, font: "sinko" }),
                k.pos(player.pos.x, player.pos.y - 50), // Adjust the position as needed
                k.lifespan(1), // Set the lifespan of the text
              ]);

              // Adjust the hit text's position on update
              hitText.onUpdate(() => {
                hitText.pos.x = player.pos.x;
                hitText.pos.y = player.pos.y - 50;
              });
            }
          }

          if (swingProgress >= swingDuration) {
            this.isSwinging = false;
            this.angle = 0;
            swingProgress = 0;
            hitPlayer = false;
          }
        }
      },
    };
  }

  function updateMonsterDirection() {
    if (player.pos.x > monster.pos.x) {
      monsterDirection = "right";
      shield.follow.offset = vec2(-16, 16);
      weapon.follow.offset = vec2(16, 16);
      weapon.flipX(false);
      shield.flipX(false);
    } else {
      monsterDirection = "left";
      shield.follow.offset = vec2(16, 16);
      weapon.follow.offset = vec2(-16, 16);
      weapon.flipX(true);
      shield.flipX(true);
    }
  }
  k.loop(1, () => {
    updateMonsterDirection();
  });

  // Function to handle the monster's attack logic
  function attack() {
    if (
      canAttack &&
      !attackCooldown &&
      player.pos.dist(monster.pos) <= ATTACK_DISTANCE
    ) {
      canAttack = false;
      attackCooldown = true;

      // Stop the monster's movement
      monster.move(0, 0);

      // Set monster.isAttacking to true when the monster starts attacking
      monster.isAttacking = true;

      // Start the swing animation
      weapon.isSwinging = true;
      weapon.startSwing();

      // Set a cooldown before the monster can attack again
      k.wait(ATTACK_COOLDOWN, () => {
        canAttack = true;
        attackCooldown = false;
        monster.isAttacking = false;

        // Resume the monster's movement
        monster.move(0, 0);
      });
    }
  }
  // Check for attacks on every frame
  k.loop(1, () => {
    attack();
  });

  // Cleanup function when the monster is destroyed
    monster.onDestroy(() => {
      k.destroy(weapon);
      k.destroy(shield);
    });

  k.loop(1, () => {
    if (!weapon.isSwinging) {
      // Add this condition to prevent movement when attacking
      let direction = player.pos.sub(monster.pos).unit();
      monster.move(direction.scale(monster.speed));
    }
    updateMonsterDirection();
    attack();
  });
}
