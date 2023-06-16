import k from "../main";
import { Player } from "./player";
import { monsterWeapon } from "./monsterWeapon";
import { increasePlayerXP } from "./levelup";
import { isGamePaused, isSpawningAllowed, isLevelUpPaused } from "./pause";
import { monsterBow } from "./BowWeapon";
export let monsters = [];

export let ENEMY_SPEED = 70;

export function setEnemySpeed(value) {
  ENEMY_SPEED = value;
}

export function getEnemySpeed() {
  return ENEMY_SPEED;
}

export function createMonster() {
  const player = Player();
  const playerPos = player.pos;
  const minDistance = 40;

  let randomX, randomY;
  do {
    randomX = Math.random() * 780;
    randomY = Math.random() * 780;
  } while (playerPos.dist({ x: randomX, y: randomY }) < minDistance);

  const monster = k.add([
    k.sprite("skel1", { anim: "run" }),
    k.pos(randomX, randomY),
    k.area({ height: 55, weight: 40 }),
    k.scale(1),
    k.origin("center"),
    k.health(30),
    "enemy",
    {
      direction: 1,
      isAttacking: false,
      enemySpeed: getEnemySpeed(),
      isAffectedByTornado: false,
      isFrozen: false,
      bowEquiped: false,
    },
  ]);
  // Create hitbox with reduced opacity
  // const hitbox = k.add([
  //   k.rect(30, 40),
  //   k.pos(monster.pos.x, monster.pos.y),
  //   k.color(1, 0, 0), // Adjust color and opacity as needed (this is red with 20% opacity)
  //   k.origin("center"),
  //   k.opacity(0.2),
  // ]);
  monsters.push(monster);

  let isMonsterAttacking = false;

  function euclideanDistance(p, q) {
    const dx = p.x - q.x;
    const dy = p.y - q.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  monster.onUpdate(() => {
    getEnemySpeed();
    if (!player.exists()) return;
    if (isMonsterAttacking || monster.isAttacking) return;
    // hitbox.pos.x = monster.pos.x;
    // hitbox.pos.y = monster.pos.y;

    for (let otherMonster of monsters) {
      if (monster === otherMonster) continue;
      const diff = monster.pos.sub(otherMonster.pos);
      if (euclideanDistance(monster.pos, otherMonster.pos) < minDistance) {
        monster.move(diff.unit().scale(monster.enemySpeed));
        return;
      }
    }
    if (!isGamePaused()) {
      const dir = player.pos.sub(monster.pos).unit();
      monster.move(dir.scale(monster.enemySpeed));
    }

    if (monster.pos.x > player.pos.x) {
      monster.flipX(true);
      monster.direction = -1;
    }
    if (monster.pos.x < player.pos.x) {
      monster.flipX(false);
      monster.direction = 1;
    }
  });
  if (player.level >= 2 && Math.random() < 0.15)
  {
    monsterBow(monster);
    monster.bowEquiped = true; // range with bow monster only one can be enabled at time
  } else {
  monsterWeapon(monster); // melee monster
  }
  if (monster.bowEquiped == true) {
    monster.onDestroy(() => {
      monster.bowEquiped = false;
    });
  }
    return monster;
}

export function spawnMonsters(timerLabel) {
  const maxMonsters = 100; // Maximum number of monsters
  let count = 0;

  function spawn() {
    if (isSpawningAllowed()) {
      createMonster();
      count++;

      k.on("death", "enemy", (e) => {
        const index = monsters.indexOf(e);
        if (index > -1) {
          increasePlayerXP(25);
          monsters.splice(index, 1);
          count--;
        }
      });

      if (count >= maxMonsters) {
        return; // Stop spawning if the maximum number of monsters is reached
      }

      const seconds = Number(timerLabel.text.split(":")[1]);
      const minutes = Number(timerLabel.text.split(":")[0]);
      const totalSeconds = minutes * 60 + seconds;

      // Adjust spawn interval based on elapsed time
      // E.g., halve the spawn interval every 10 seconds
      const spawnInterval = Math.max(
        0.1,
      1.5 * Math.pow(0.6, Math.floor(totalSeconds / 20)) * 2.5
      );
      k.wait(spawnInterval, spawn);
    } else {
      // Wait a short period of time and then try spawning again
      k.wait(0.1, spawn);
    }
  }
  spawn();
}
