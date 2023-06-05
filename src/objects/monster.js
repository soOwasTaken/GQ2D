import k from "../main";
import { Player } from "../objects/player";
import { monsterWeapon } from "./monsterWeapon";
export let monsters = [];

export function createMonster() {
  const ENEMY_SPEED = 75;
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
    k.area({ scale: 0.3 }),
    k.scale(1),
    k.origin("center"),
    k.health(30),
    "enemy",
    { direction: 1, isAttacking: false },
  ]);

  monsters.push(monster);

  let isMonsterAttacking = false;

  function euclideanDistance(p, q) {
    const dx = p.x - q.x;
    const dy = p.y - q.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  monster.onUpdate(() => {
    if (!player.exists()) return;
    if (isMonsterAttacking || monster.isAttacking) return;

    for (let otherMonster of monsters) {
      if (monster === otherMonster) continue;
      const diff = monster.pos.sub(otherMonster.pos);
      if (euclideanDistance(monster.pos, otherMonster.pos) < minDistance) {
        monster.move(diff.unit().scale(ENEMY_SPEED));
        return;
      }
    }

    const dir = player.pos.sub(monster.pos).unit();
    monster.move(dir.scale(ENEMY_SPEED));

    if (monster.pos.x > player.pos.x) {
      monster.flipX(true);
      monster.direction = -1;
    }
    if (monster.pos.x < player.pos.x) {
      monster.flipX(false);
      monster.direction = 1;
    }
  });

  monsterWeapon(monster);
  return monster;
}

export function spawnMonsters(timerLabel) {
  const maxMonsters = 250; // Maximum number of monsters
  let count = 0;

  function spawn() {
    createMonster();
    count++;

    k.on("death", "enemy", (e) => {
      const index = monsters.indexOf(e);
      if (index > -1) {
        monsters.splice(index, 1);
      }
      count--;
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
      2 * Math.pow(0.9, Math.floor(totalSeconds / 10))
    );

    k.wait(spawnInterval, spawn);
  }

  spawn();
}

