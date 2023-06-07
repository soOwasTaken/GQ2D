import k from "../main";
import { Player } from "./player";
import { isGamePaused, togglePause } from "./pause";

let currentLevel = 1;
let currentXP = 0;

export function getPlayerLevel() {
  return currentLevel;
}

export function getPlayerXP() {
  return currentXP;
}

export function increasePlayerXP(amount) {
  const player = Player();
  currentXP += amount;
  // Check if the player has reached enough XP to level up
  // You can implement your own logic here based on your game's leveling system
  // For example, if the player reaches 100 XP, they level up
  if (currentXP >= 100) {
    currentLevel++;
    currentXP = 0; // Reset XP for the next level
    // Trigger any additional level-up logic or effects

    levelUpAnimation = k.add([
      k.sprite("LevelUp", { anim: "LevelUp" }),
      k.origin("center"),
      k.pos(),
      k.scale(0.6),
      k.lifespan(1),
      k.follow(player, vec2(0, -15)),
    ]);
      togglePause();
  }
}
