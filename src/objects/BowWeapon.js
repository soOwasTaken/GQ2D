import k from "../main";
import { Player } from "./player";
import { isGamePaused } from "./pause";

export function monsterBow(monster) {
  const ATTACK_DISTANCE = 230; // Distance threshold for attacking the player
  let ATTACK_COOLDOWN = 2; // Cooldown duration between attacks in seconds
  const ATTACK_DAMAGE = 10; // Damage inflicted on the player

  const player = Player(); // Get the player object

  let monsterDirection = "left"; // Default monster direction
  let canAttack = true; // Flag to track if the monster can attack
  let attackCooldown = false; // Flag to track if the monster is on attack cooldown

  const bow = k.add([
    k.pos(),
    k.sprite("bow", { anim: "idle" }),
    k.origin("bot"),
    k.rotate(0),
    k.scale(0.8),
    k.follow(monster, vec2(-14, -14)), // Adjust the bow's position relative to the monster
    "monsterBow",
    k.area({ scale: 1 }),
  ]);

  let isCharging = false; // Flag to track if the monster is charging the bow
  let isReleasing = false; // Flag to track if the monster is releasing the arrow

  function updateMonsterDirection() {
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
      monster.play("idle");

      // Set monster.isAttacking to true when the monster starts attacking
      monster.isAttacking = true;

      const direction = player.pos.sub(bow.pos).unit();

      // Define the arrow outside the wait function
      let arrow;

      // In the charging phase
      k.wait(1, () => {
        // Start the charging animation
        isCharging = true;
        bow.play("charging"); // Play the charging animation

        // Create a "charging arrow" without the k.move property, which will make it stationary
        let chargingArrow = k.add([
          k.pos(bow.pos.x, bow.pos.y - 12), // Set the initial position of the arrow
          k.sprite("arrow"), // Replace with the sprite for the arrow
          k.origin("center"),
          k.scale(1),
          // no k.move(), this arrow is stationary
          k.area({ width: 8, height: 16 }), // Adjust the arrow's collision area as needed
          "chargingArrow",
        ]);
        if (monsterDirection === "left") {
          chargingArrow.flipX(true);
        }
        // In the releasing phase
        k.wait(1, () => {
          // Destroy the "charging arrow"
          k.destroy(chargingArrow);

          // Set the releasing flag to true
          isReleasing = true;
          // Change the sprite to the release state
          bow.play("idle"); // Set the bow sprite to the charged frame

          // Create a "flying arrow" with the k.move property
          let flyingArrow = k.add([
            k.pos(bow.pos.x, bow.pos.y - 12), // Set the initial position of the arrow
            k.sprite("arrow"), // Replace with the sprite for the arrow
            k.origin("center"),
            k.scale(0.8),
            k.rotate(Math.atan2(direction.y, direction.x) * (180 / Math.PI)),
            k.move(direction, 100), // This arrow will move
            k.outview({ destroy: true }),
            k.area({ width: 8, height: 16 }), // Adjust the arrow's collision area as needed
            "flyingArrow",
          ]);
            
            flyingArrow.onUpdate(() => {
                if (isGamePaused()) {
                    destroy(flyingArrow);
                }
            })

          // Inflict damage on the player when the "flying arrow" hits
          k.onCollide("flyingArrow", "player", (a, p) => {
            p.hurt(ATTACK_DAMAGE);
            k.destroy(a);
          });

          // Set a cooldown before the monster can attack again
          k.wait(2, () => {
            canAttack = true;
            attackCooldown = false;
            monster.isAttacking = false;
            //
            // Resume the monster's movement
            monster.move(0, 0);
            monster.play("run");
          });
        });
      });
    }
  }

  // Check for attacks on every frame
    k.loop(5, () => {
        if (!isGamePaused()) {
            attack();
        }
  });

  // Cleanup function when the monster is destroyed
  monster.onDestroy(() => {
    k.destroy(bow);
  });

  k.loop(1, () => {
    if (!isCharging && !isReleasing) {
      // Add this condition to prevent movement when charging or releasing
      let direction = player.pos.sub(monster.pos).unit();
      monster.move(direction.scale(monster.speed));
    }
    updateMonsterDirection();
    attack();
  });
}
