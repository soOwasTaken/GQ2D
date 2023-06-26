import k from "../main";
import { Player, getPlayer } from "./player";
import { isGamePaused, togglePause } from "./pause";
import { monsterBow } from "./bowWeapon";

let playerDirection = "right";
let shotCount = 0;
let lastShot = 0;
let reloadBar;
let reloadBarBg;

export function gun() {
  const player = Player();

  const gun = k.add([
    k.pos(player.pos.x, player.pos.y + 5),
    k.sprite("gun"),
    k.origin("center"),
    k.scale(0.9),
    "weapon",
  ]);

  k.onKeyDown(["right", "d"], () => {
    if (!isGamePaused()) {
      gun.flipX(false);
    }
    playerDirection = "right";
  });

  k.onKeyDown(["left", "q"], () => {
    if (!isGamePaused()) {
      gun.flipX(true);
    }
    playerDirection = "left";
  });

  let shootAnim;

  k.onUpdate(() => {
    gun.pos.x = player.pos.x;
    gun.pos.y = player.pos.y + 3.5;
    const currentTime = k.time();

    if (shootAnim) {
      shootAnim.pos.x =
        playerDirection == "right" ? gun.pos.x + 17 : gun.pos.x - 17;
      shootAnim.pos.y = gun.pos.y;
    }

    // Update the position and width of the reload bar above the player
    if (reloadBar && reloadBarBg) {
      reloadBar.pos.x = reloadBarBg.pos.x = player.pos.x - 15;
      reloadBar.pos.y = reloadBarBg.pos.y = player.pos.y - 20;

      if (shotCount === 2 && currentTime - lastShot < 1) {
        reloadBar.width = 30 * ((currentTime - lastShot) / 1); // Update the width
      }

      // Destroy both reloading bars after cooldown
      if (currentTime - lastShot >= 1) {
        reloadBar.destroy();
        reloadBar = null;
        reloadBarBg.destroy();
        reloadBarBg = null;
      }
    }
  });

  k.onKeyPress("space", () => {
    const currentTime = k.time();
    if (shotCount < 2 || currentTime - lastShot >= 1) {
      if (shotCount >= 2) {
        shotCount = 0;
      }
      lastShot = currentTime;
      shotCount++;

      // Create the reloading bar when player shoots
      if (shotCount === 2) {
        reloadBarBg = k.add([
          k.pos(player.pos.x - 15, player.pos.y - 20),
          k.rect(30, 3),
          k.color(200, 200, 200),
          k.origin("left"),
        ]);

        reloadBar = k.add([
          k.pos(player.pos.x - 15, player.pos.y - 20),
          k.rect(0, 3), // Set initial width to 0
          k.color(255, 0, 0),
          k.origin("left"),
        ]);
      }

      if (shootAnim) {
        shootAnim.destroy();
      }

      shootAnim = k.add([
        k.pos(
          playerDirection == "right" ? gun.pos.x + 17 : gun.pos.x - 17,
          gun.pos.y
        ),
        k.sprite("shooting", { anim: "shoot" }),
        k.origin("center"),
        k.scale(0.3),
        k.lifespan(0.5),
      ]);

      if (playerDirection == "left") {
        shootAnim.flipX(true);
      }

      // angles in degrees for the bullets
      let angles = [-10, -5, 0, 5, 10];

      angles.forEach((angle) => {
        let bullet = k.add([
          k.pos(
            playerDirection == "right" ? gun.pos.x + 17 : gun.pos.x - 17,
            gun.pos.y
          ),
          k.rect(2, 2), // the bullet size
          k.color(255, 0, 0), // red color
          k.area({ scale: 1 }),
          k.outview({ destroy: true }),
          "bullet",
          {
            speed: 300, // bullet speed
            angle: playerDirection == "right" ? angle : 180 - angle, // reverse the angles for left direction
          },
        ]);
      });
    }
  });

  k.onUpdate("bullet", (b) => {
    const angleInRadians = b.angle * (Math.PI / 180);
    b.move(
      Math.cos(angleInRadians) * b.speed,
      Math.sin(angleInRadians) * b.speed
    );
  });
  k.onCollide("bullet", "enemy", (b, e) => {
    e.hurt(4);

    const randomX = k.rand(-10, 10);
    const randomY = k.rand(-10, 10);

    const damageText = k.add([
      k.text(`-4`, {
        size: 8,
        font: "sinko",
      }),
      k.pos(e.pos.x + randomX, e.pos.y + randomY - 20), // Add the random offsets here
      k.lifespan(1),
      k.color(255, 0, 0),
      {
        value: -4,
      },
    ]);

    damageText.onUpdate(() => {
      damageText.move(0, -40 * k.dt());
    });

    k.destroy(b);
  });
}
