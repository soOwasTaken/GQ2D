import k from "../main";
import { Player, getPlayer } from "./player";
import { isGamePaused, togglePause } from "./pause";
import { monsterBow } from "./bowWeapon";

let playerDirection = "right";
let shotCount = 0;
let lastShot = 0;
let maxShotCount = 2;
let reloadBar;
let reloadBarBg;
let fastReload = false;
let extraLoad = false;
let moreDamage = false;
let moreBullets = false;

export function toggleFastReload() {
  fastReload = !fastReload;
}

export function toggleMoreDamage() {
  moreDamage = !moreDamage;
}

export function toggleMoreBullets() {
  moreBullets = !moreBullets;
}

export function toggleExtraLoad() {
  extraLoad = !extraLoad;
  maxShotCount = extraLoad ? 3 : 2;
}

function getMaxShotCount() {
  return extraLoad ? 3 : 2;
}

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
    const reloadSpeed = fastReload ? 0.7 : 1; 

    if (shootAnim) {
      shootAnim.pos.x =
        playerDirection == "right" ? gun.pos.x + 17 : gun.pos.x - 17;
      shootAnim.pos.y = gun.pos.y;
    }

    if (reloadBar && reloadBarBg) {
      reloadBar.pos.x = reloadBarBg.pos.x = player.pos.x - 15;
      reloadBar.pos.y = reloadBarBg.pos.y = player.pos.y - 20;

    if (
      shotCount === getMaxShotCount() &&
      currentTime - lastShot < reloadSpeed
    ) {
      reloadBar.width = 30 * ((currentTime - lastShot) / reloadSpeed);
    }

      // Destroy both reloading bars after cooldown
      if (currentTime - lastShot >= reloadSpeed) {
        reloadBar.destroy();
        reloadBar = null;
        reloadBarBg.destroy();
        reloadBarBg = null;
      }
    }
  });

k.onKeyPress("space", () => {
  const currentTime = k.time();
  const reloadSpeed = fastReload ? 0.7 : 1;

  if (shotCount < getMaxShotCount() || currentTime - lastShot >= reloadSpeed) {
    if (shotCount >= getMaxShotCount()) {
      shotCount = 0;
    }
    lastShot = currentTime;
    shotCount++;

    if (shotCount === getMaxShotCount()) {
      reloadBarBg = k.add([
        k.pos(player.pos.x - 15, player.pos.y - 20),
        k.rect(30, 3),
        k.color(200, 200, 200),
        k.origin("left"),
      ]);

      reloadBar = k.add([
        k.pos(player.pos.x - 15, player.pos.y - 20),
        k.rect(0, 3),
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

    if (moreBullets) {
      angles = [-10, -5, -2, 2, 5, 10];
    }

    angles.forEach((angle) => {
      let bullet = k.add([
        k.pos(
          playerDirection == "right" ? gun.pos.x + 17 : gun.pos.x - 17,
          gun.pos.y
        ),
        k.rect(2, 2),
        k.color(255, 0, 0),
        k.area({ scale: 1 }),
        k.outview({ destroy: true }),
        "bullet",
        {
          speed: 300,
          angle: playerDirection == "right" ? angle : 180 - angle,
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
    const bulletDamage = moreDamage ? 8 : 6;
    e.hurt(bulletDamage);

    const randomX = k.rand(-10, 10);
    const randomY = k.rand(-10, 10);

    const damageText = k.add([
      k.text(`-${bulletDamage}`, {
        size: 8,
        font: "sinko",
      }),
      k.pos(e.pos.x + randomX, e.pos.y + randomY - 20),
      k.lifespan(1),
      k.color(255, 0, 0),
      {
        value: -bulletDamage,
      },
    ]);

    damageText.onUpdate(() => {
      damageText.move(0, -40 * k.dt());
    });

    k.destroy(b);
  });
}
