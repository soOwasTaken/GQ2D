import k from "../main";
import { Player } from "../objects/player";
import { monsterWeapon } from "./monsterWeapon";
export let monsters = [];

export function createMonster() {
  const ENEMY_SPEED = 50; // Adjust the speed as desired

  const player = Player(); // Get the player object

  const playerPos = player.pos;
  const minDistance = 40; // Minimum distance from player

  // Generate a random position that is outside the range around the player
  let randomX, randomY;
  do {
    randomX = Math.random() * k.width();
    randomY = Math.random() * k.height();
  } while (playerPos.dist({ x: randomX, y: randomY }) < minDistance);

  const monster = k.add([
    k.sprite("skel1", { anim: "run" }),
    k.pos(randomX, randomY),
    k.area({ scale: 0.3 }),
    k.scale(1),
    k.origin("center"),
    k.health(30),
    "enemy",
    k.solid(), // Add this line
    { direction: 1, isAttacking: false },
  ]);

  // Update function to move the monster towards the player
  let isMonsterAttacking = false; // Add this flag

  monster.onUpdate(() => {
    if (!player.exists()) return;
    if (isMonsterAttacking || monster.isAttacking) return;

    const dir = player.pos.sub(monster.pos).unit();
    monster.move(dir.scale(ENEMY_SPEED));

    if (monster.pos.x > player.pos.x) {
      monster.flipX(true);
      monster.direction = -1; // the monster is facing left
    }
    if (monster.pos.x < player.pos.x) {
      monster.flipX(false);
      monster.direction = 1; // the monster is facing right
    }
  });

  // Handle interactions with the player or other logic here
  monsterWeapon(monster);
  return monster;
}

export function spawnMonsters() {
  const maxMonsters = 30; // Maximum number of monsters
  const interval = 2; // Spawn interval in seconds
  let count = 0;

  function spawn() {
    createMonster();
    count++;

    if (count >= maxMonsters) {
      return; // Stop spawning if the maximum number of monsters is reached
    }

    k.wait(interval, spawn);
  }

  spawn();
}
