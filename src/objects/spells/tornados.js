import k from "../../main";
import { Player } from "../player";
import { monsters } from "../monster";
import { isGamePaused } from "../pause";
import { getPlayer } from "../player";

const NEAR_PLAYER_RADIUS = 200;
const TORNADO_SPEED = 15;

function euclideanDistance(p, q) {
  const dx = p.x - q.x;
  const dy = p.y - q.y;
  return Math.sqrt(dx * dx + dy * dy);
}

function isNearPlayer(monster) {
  return euclideanDistance(monster.pos, getPlayer().pos) < NEAR_PLAYER_RADIUS;
}

function createTornado() {
  // Get a list of monsters near the player
  const nearPlayerMonsters = monsters.filter(isNearPlayer);

  // If there are no monsters near the player, don't spawn a tornado
  if (nearPlayerMonsters.length === 0) {
    return;
  }

  // Choose a random monster near the player to spawn the tornado at
  const spawnMonster =
    nearPlayerMonsters[Math.floor(Math.random() * nearPlayerMonsters.length)];

  const tornado = k.add([
    k.sprite("Tornado", { anim: "spin" }),
    k.pos(spawnMonster.pos.x, spawnMonster.pos.y),
    k.scale(1.2),
    k.origin("center"),
    "tornadoAnimation",
    k.area(0.2),
    k.lifespan(8),
    { dir: { x: 0, y: 0 } }, // Initial direction
  ]);

  const directions = [
    { x: -1, y: 0 }, // left
    { x: 1, y: 0 }, // right
    { x: 0, y: -1 }, // up
    { x: 0, y: 1 }, // down
  ];

  function assignRandomDirection() {
    tornado.dir = directions[Math.floor(Math.random() * directions.length)];
  }

  assignRandomDirection();
  if (!isGamePaused()) {
    k.loop(1, () => {
      // Change direction every 1 second
      assignRandomDirection();
    });
  }

  tornado.onUpdate(() => {
    if (!isGamePaused()) {
      tornado.move(
        tornado.dir.x * TORNADO_SPEED,
        tornado.dir.y * TORNADO_SPEED
      );
    }
  });
  if (!isGamePaused()) {
    k.onCollide("tornadoAnimation", "enemy", (p, e) => {
      const now = k.time();
      //this e.enemySpeed -= 30;
      if (now - e.lastDamaged < 0.5) {
        // Less than 1 seconds have passed since the last damage, so do nothing
        return;
      }

      if (!e.isAffectedByTornado) {
        // Slow down the monster and prevent further slowing for 5 seconds
        e.originalEnemySpeed = e.enemySpeed;
        e.enemySpeed *= 0.5;
        e.isAffectedByTornado = true;

        // Set a timer to restore the original speed after 2 seconds
        setTimeout(() => {
          e.isAffectedByTornado = false;
          e.enemySpeed = e.originalEnemySpeed;
        }, 2000);
      }

      const damage = Math.floor(Math.random() * 5) + 3; // Random damage between 3 and 7
      e.hurt(damage);
      e.lastDamaged = now; // Update the last damaged time

      const damageText = k.add([
        k.text(`-${damage}`, { size: 8, font: "sinko" }),
        k.pos(e.pos.x, e.pos.y - 20),
        k.lifespan(1),
        k.color(255, 0, 0),
        { value: -damage },
      ]);

      damageText.onUpdate(() => {
        damageText.move(0, -40 * k.dt());
      });
    });

    return tornado;
  }
}

export function spawnTornadoes() {
  if (isGamePaused()) {
    return;
  }
  k.loop(5, () => {
    if (!isGamePaused()) {
      createTornado();
    }
  });
}
