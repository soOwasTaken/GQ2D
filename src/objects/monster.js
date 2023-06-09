import k from "../main";
import { Player } from "./player";
import { monsterWeapon, ShieldAndAxe } from "./monsterWeapon";
import { increasePlayerXP } from "./levelup";
import { isGamePaused, isSpawningAllowed, isLevelUpPaused } from "./pause";
import { monsterBow } from "./bowWeapon";
import { incrementScore } from "../scenes/score";
export let monsters = [];
export let ENEMY_SPEED = 55;
const urlParams = new URLSearchParams(window.location.search);
const level = urlParams.has("level") ? parseInt(urlParams.get("level")) : 1;

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
  } while (playerPos.dist({ x: randomX, y: randomY }) < 350);

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
      dead: false,
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
      if (euclideanDistance(monster.pos, otherMonster.pos) < 40) {
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
  if (player.level >= 3 && Math.random() < 0.15) {
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

function map3Spritev1() {
  if (level == 2) {
    return "mommy";
  } else if (level == 3) {
    return "lavaMob";
  }
}

export function createMonsterLv2(extraHealth) {
  const player = Player();
  const playerPos = player.pos;
  const minDistance = 40;
  setEnemySpeed(60);

  let randomX, randomY;
  do {
    randomX = Math.random() * 780;
    randomY = Math.random() * 780;
  } while (playerPos.dist({ x: randomX, y: randomY }) < 350);

  const monster = k.add([
    k.sprite(map3Spritev1(), { anim: "run" }),
    k.pos(randomX, randomY),
    k.area({ height: 55, weight: 40 }),
    k.scale(1),
    k.origin("center"),
    k.health(40 + extraHealth),
    "enemy",
    {
      direction: 1,
      isAttacking: false,
      enemySpeed: getEnemySpeed(),
      isAffectedByTornado: false,
      isFrozen: false,
      bowEquiped: false,
      damage: 15,
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
    monster.destroy();
    monster.isAttacking = false;
    increasePlayerXP(15);
    incrementScore(10);
  });

  if (Math.random() < 0.2) {
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

function map3Sprite() {
  if (level == 2) {
    return "warriorMommy";
  } else if (level == 3) {
    return "golem";
  }
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
  } while (playerPos.dist({ x: randomX, y: randomY }) < 350);

  const monster = k.add([
    k.sprite(map3Sprite(), { anim: "run" }),
    k.pos(randomX, randomY),
    k.area({ scale: 1.3 }),
    k.scale(1.5),
    k.origin("center"),
    k.health(90 + extraHealth),
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
      increasePlayerXP(30);
      incrementScore(50);
    }
  });
  ShieldAndAxe(monster);
  return monster;
}

export function resetMonsterAI() {
  for (let monster of monsters) {
    monster.direction = 1;
    monster.isAttacking = false; // function to debug monster when they struggle moving
  }
}

export function spawnMonsters(timerLabel) {
  let maxMonsters;

  if (level === 1) {
    maxMonsters = 70;
    console.log("level 1, max monster =", maxMonsters);
  } else if (level === 2) {
    maxMonsters = 35;
    console.log("level 1, max monster =", maxMonsters);
  }
  let count = 0;
  let waveNumber = 1;
  let spawnIntervalId = null;
  let maxMonsterReached = false;

  if (level === 1) {
    k.on("destroy", "enemy", (e) => {
      const index = monsters.indexOf(e);
      if (index > -1) {
        increasePlayerXP(15);
        incrementScore(10);
        monsters.splice(index, 1);
        count--;
        //console.log("monster died count reduced to =", count);
      }
    });
  } else {
    k.on("destroy", "enemy", (e) => {
      const index = monsters.indexOf(e);
      monsters.splice(index, 1);
      if (index > -1) {
        count--;
        console.log("monster died count reduced to =", count);
      }
    });
  }

  function spawnWave() {
    if (isSpawningAllowed()) {
      let extraHealth;
      const seconds = Number(timerLabel.text.split(":")[1]);
      const minutes = Number(timerLabel.text.split(":")[0]);
      const totalMinutes = minutes + Math.floor(seconds / 60);
      if (level == 1) {
        extraHealth = 5 * totalMinutes;
      } else if (level == 2) {
        extraHealth = 7 * totalMinutes;
      } else if (level == 3) {
        extraHealth = 10 * totalMinutes;
      }

      const monstersInWave = 1 + 2 * waveNumber;
      for (let i = 0; i < monstersInWave; i++) {
        if (level == 1) {
          createMonster(extraHealth);
        } else if (level == 2) {
          createMonsterLv2(extraHealth);
        } else if (level == 3) {
          //createMonsterLv2(extraHealth);
        }
        count++;
      }
      waveNumber++;
      if (count >= maxMonsters) {
        return;
      }
    }

    k.wait(60, spawnWave);
  }

  function spawn() {
    let extraHealth;
    const seconds = Number(timerLabel.text.split(":")[1]);
    const minutes = Number(timerLabel.text.split(":")[0]);
    const totalMinutes = minutes + Math.floor(seconds / 60);
    if (level == 1) {
      extraHealth = 5 * totalMinutes;
    } else if (level == 2) {
      extraHealth = 7 * totalMinutes;
    } else if (level == 3) {
      extraHealth = 10 * totalMinutes;
    }
    if (isSpawningAllowed()) {
      if (level == 1) {
        createMonster(extraHealth);
      } else {
        createMonsterLv2(extraHealth);
        if (count % 5 === 0 && count !== 0) {
          createWarrior(extraHealth * 2);
          count++;
        }
      }
      count++;
      console.log("count =", count);

      if (count >= maxMonsters) {
        console.log("max monster reached, looping...");
        maxMonsterReached = true;
        clearInterval(spawnIntervalId);
        spawnIntervalId = setInterval(checkMonsterCount, 5000);
        return;
      }

      const seconds = Number(timerLabel.text.split(":")[1]);
      const minutes = Number(timerLabel.text.split(":")[0]);
      const totalSeconds = minutes * 60 + seconds;
      const baseSpawnInterval = 2;
      const increaseInterval = 120;

      const spawnInterval = Math.max(
        0.1,
        baseSpawnInterval *
          Math.pow(0.8, Math.floor(totalSeconds / increaseInterval))
      );
      k.wait(spawnInterval, spawn);
    } else {
      k.wait(0.1, spawn);
    }
  }

  function checkMonsterCount() {
    if (count < maxMonsters && maxMonsterReached) {
      maxMonsterReached = false;
      clearInterval(spawnIntervalId);
      spawn();
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
