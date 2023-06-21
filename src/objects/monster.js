import k from "../main";
import { Player } from "./player";
import { monsterWeapon, ShieldAndAxe } from "./monsterWeapon";
import { increasePlayerXP } from "./levelup";
import { isGamePaused, isSpawningAllowed, isLevelUpPaused } from "./pause";
import { monsterBow } from "./bowWeapon";
import { incrementScore } from "../scenes/score";
export let monsters = [];
export let ENEMY_SPEED = 70;
const urlParams = new URLSearchParams(window.location.search);
const level = urlParams.get("level") || 1;

export function setEnemySpeed(value) {
  ENEMY_SPEED = value;
}

export function getEnemySpeed() {
  return ENEMY_SPEED;
}

export function createMonster(extraHealth) {
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
    k.health(20 + extraHealth),
    "enemy",
    {
      direction: 1,
      isAttacking: false,
      enemySpeed: getEnemySpeed(),
      isAffectedByTornado: false,
      isFrozen: false,
      bowEquiped: false,
      damage: 10,
      dead : false,
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
      // Add separation behavior
      let separation = k.vec2(0, 0);
      let count = 0;
      for (let otherMonster of monsters) {
        if (monster === otherMonster) continue;
        const distance = euclideanDistance(monster.pos, otherMonster.pos);
        if (distance < 50) {
          // radius of separation
          const diff = normalizeVec2(monster.pos.sub(otherMonster.pos));
          separation = separation.add(diff);
          count++;
        }
      }
      if (count > 0) {
        separation = { x: separation.x / count, y: separation.y / count };
        const len = Math.sqrt(
          separation.x * separation.x + separation.y * separation.y
        );
        if (len > 0) {
          separation = normalizeVec2(separation)
            .scale(monster.enemySpeed)
            .sub(monster.speed);
          if (
            Math.sqrt(
              separation.x * separation.x + separation.y * separation.y
            ) > monster.enemySpeed
          ) {
            separation = normalizeVec2(separation).scale(monster.enemySpeed);
          }
        }
        let proposedPosition = monster.pos.add(separation);
        // Check if the proposed position is within game bounds (change 780 to your game dimensions)
        if (
          proposedPosition.x >= 0 &&
          proposedPosition.y >= 0 &&
          proposedPosition.x <= 780 &&
          proposedPosition.y <= 780
        ) {
          monster.move(separation);
        }
      }
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
  if (player.level >= 1 && Math.random() < 0.2) {
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
export function createMonsterLv2(extraHealth) {
  const player = Player();
  const playerPos = player.pos;
  const minDistance = 40;
  setEnemySpeed(30);

  let randomX, randomY;
  do {
    randomX = Math.random() * 780;
    randomY = Math.random() * 780;
  } while (playerPos.dist({ x: randomX, y: randomY }) < minDistance);

  const monster = k.add([
    k.sprite("mommy", { anim: "run" }),
    k.pos(randomX, randomY),
    k.area({ height: 55, weight: 40 }),
    k.scale(1),
    k.origin("center"),
    k.health(20 + extraHealth),
    "enemy",
    {
      direction: 1,
      isAttacking: false,
      enemySpeed: getEnemySpeed(),
      isAffectedByTornado: false,
      isFrozen: false,
      bowEquiped: false,
      damage: 10,
      corpse: false,
      revives: 1,
      dead: false,
    },
  ]);
  monsters.push(monster);

  let isMonsterAttacking = false;

  function euclideanDistance(p, q) {
    const dx = p.x - q.x;
    const dy = p.y - q.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  monster.onUpdate(() => {
        if (monster.dead) {
          return; // Skip update if the monster is dead
        }
    getEnemySpeed();
    if (!player.exists()) return;
    if (isMonsterAttacking || monster.isAttacking) return;

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
      let separation = k.vec2(0, 0);
      let count = 0;
      for (let otherMonster of monsters) {
        if (monster === otherMonster) continue;
        const distance = euclideanDistance(monster.pos, otherMonster.pos);
        if (distance < 50) {
          // radius of separation
          const diff = normalizeVec2(monster.pos.sub(otherMonster.pos));
          separation = separation.add(diff);
          count++;
        }
      }
      if (count > 0) {
        separation = { x: separation.x / count, y: separation.y / count };
        const len = Math.sqrt(
          separation.x * separation.x + separation.y * separation.y
        );
        if (len > 0) {
          separation = normalizeVec2(separation)
            .scale(monster.enemySpeed)
            .sub(monster.speed);
          if (
            Math.sqrt(
              separation.x * separation.x + separation.y * separation.y
            ) > monster.enemySpeed
          ) {
            separation = normalizeVec2(separation).scale(monster.enemySpeed);
          }
        }
        let proposedPosition = monster.pos.add(separation);
        // Check if the proposed position is within game bounds (change 780 to your game dimensions)
        if (
          proposedPosition.x >= 0 &&
          proposedPosition.y >= 0 &&
          proposedPosition.x <= 780 &&
          proposedPosition.y <= 780
        ) {
          monster.move(separation);
        }
      }
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
  monster.on("death", () => {
    if (monster.revives > 0) {
      monster.revives--;
      monster.dead = true;
      monster.play("death");
      k.wait(3.5, () => {
        monster.heal(20);
        monster.dead = false;
        monster.play("falling");
        k.wait(0.2, () => {
          monster.play("run");
          monsterWeapon(monster);
        })
      });
    } else {
      monster.destroy();
      const index = monsters.indexOf(monster);
      if (index > -1) {
        monsters.splice(index, 1);
        increasePlayerXP(25);
        incrementScore(10);
      }
    }
  });
  monsterWeapon(monster);
  return monster;
}
export function createWarrior(extraHealth) {
  const player = Player();
  const playerPos = player.pos;
  const minDistance = 40;
  setEnemySpeed(50);

  let randomX, randomY;
  do {
    randomX = Math.random() * 780;
    randomY = Math.random() * 780;
  } while (playerPos.dist({ x: randomX, y: randomY }) < minDistance);

  const monster = k.add([
    k.sprite("warriorMommy", { anim: "run" }),
    k.pos(randomX, randomY),
    k.area({ scale : 1.3 }),
    k.scale(1.5),
    k.origin("center"),
    k.health(100 + extraHealth),
    "enemy",
    {
      direction: 1,
      isAttacking: false,
      enemySpeed: getEnemySpeed(),
      isAffectedByTornado: false,
      isFrozen: false,
      bowEquiped: false,
      damage: 30,
      corpse: false,
      revives: 0,
      dead: false,
    },
  ]);
  monsters.push(monster);

  let isMonsterAttacking = false;

  function euclideanDistance(p, q) {
    const dx = p.x - q.x;
    const dy = p.y - q.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  monster.onUpdate(() => {
    if (monster.dead) {
      return; // Skip update if the monster is dead
    }
    getEnemySpeed();
    if (!player.exists()) return;
    if (isMonsterAttacking || monster.isAttacking) return;

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
      let separation = k.vec2(0, 0);
      let count = 0;
      for (let otherMonster of monsters) {
        if (monster === otherMonster) continue;
        const distance = euclideanDistance(monster.pos, otherMonster.pos);
        if (distance < 50) {
          // radius of separation
          const diff = normalizeVec2(monster.pos.sub(otherMonster.pos));
          separation = separation.add(diff);
          count++;
        }
      }
      if (count > 0) {
        separation = { x: separation.x / count, y: separation.y / count };
        const len = Math.sqrt(
          separation.x * separation.x + separation.y * separation.y
        );
        if (len > 0) {
          separation = normalizeVec2(separation)
            .scale(monster.enemySpeed)
            .sub(monster.speed);
          if (
            Math.sqrt(
              separation.x * separation.x + separation.y * separation.y
            ) > monster.enemySpeed
          ) {
            separation = normalizeVec2(separation).scale(monster.enemySpeed);
          }
        }
        let proposedPosition = monster.pos.add(separation);
        // Check if the proposed position is within game bounds (change 780 to your game dimensions)
        if (
          proposedPosition.x >= 0 &&
          proposedPosition.y >= 0 &&
          proposedPosition.x <= 780 &&
          proposedPosition.y <= 780
        ) {
          monster.move(separation);
        }
      }
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
  monster.on("death", () => {
    if (monster.revives > 0) {
      monster.revives--;
      monster.dead = true;
      monster.play("death");
      k.wait(3.5, () => {
        monster.heal(20);
        monster.dead = false;
        monster.play("falling");
        k.wait(0.2, () => {
          monster.play("run");
          monsterWeapon(monster);
        });
      });
    } else {
      monster.destroy();
      monster.isAttacking = false;
      const index = monsters.indexOf(monster);
      if (index > -1) {
        monsters.splice(index, 1);
        increasePlayerXP(50);
        incrementScore(50);
      }
    }
  });
  ShieldAndAxe(monster);
  return monster;
}

export function resetMonsterAI() {
  for (let monster of monsters) {
    // Reset any relevant properties or variables here
    monster.direction = 1;
    monster.isAttacking = false;
    // Reset any other properties or variables that control movement behavior
  }
}

export function spawnMonsters(timerLabel) {
  const maxMonsters = 100; // Maximum number of monsters
  let count = 0;
  let waveNumber = 0;

  function spawnWave() {
    if (isSpawningAllowed()) {
      const seconds = Number(timerLabel.text.split(":")[1]);
      const minutes = Number(timerLabel.text.split(":")[0]);
      const totalMinutes = minutes + Math.floor(seconds / 60);
      let extraHealth = 5 * totalMinutes;

      const monstersInWave = 5 + 2 * waveNumber;
      for (let i = 0; i < monstersInWave; i++) {
        if (level == 1) {
          createMonster(extraHealth);
        } else if (level == 2) {
          createMonsterLv2(extraHealth);
        }
        count++;
      }
      waveNumber++;
      if (count >= maxMonsters) {
        return;
      }
    }

    // wait for 60s then spawn the next wave
    k.wait(60, spawnWave);
  }

  function spawn() {
    if (isSpawningAllowed()) {
      if (level == 1) {
        createMonster(0);
      } else if (level == 2) {
        //createWarrior(0);
        createMonsterLv2(0);
        if (count % 5 === 0 && count !== 0) {
          createWarrior(0);
        }
      }
      count++;
      if (level == 1) {
        k.on("death", "enemy", (e) => {
          const index = monsters.indexOf(e);
          if (index > -1) {
            increasePlayerXP(25);
            incrementScore(10);
            monsters.splice(index, 1);
            count--;
          }
        });
      }

      if (count >= maxMonsters) {
        return;
      }

      const seconds = Number(timerLabel.text.split(":")[1]);
      const minutes = Number(timerLabel.text.split(":")[0]);
      const totalSeconds = minutes * 60 + seconds;
      const baseSpawnInterval = 3;
      const increaseInterval = 60;

      const spawnInterval = Math.max(
        0.1,
        baseSpawnInterval *
          Math.pow(0.9, Math.floor(totalSeconds / increaseInterval))
      );
      k.wait(spawnInterval, spawn);
    } else {
      k.wait(0.1, spawn);
    }
  }
  spawn();
  spawnWave();
}

function normalizeVec2(v) {
  const len = Math.sqrt(v.x * v.x + v.y * v.y);
  if (len === 0) {
    return { x: 0, y: 0 };
  }
  return { x: v.x / len, y: v.y / len };
}
