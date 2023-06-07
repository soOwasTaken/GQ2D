import k from "../main";
import { getPlayer } from "./player";
import { setSpawningTo, toggleLevelUpPause } from "./pause";

// This function increases player's xp and checks if the player levels up
export function increasePlayerXP(amount) {
  const player = getPlayer();

  // If the player doesn't exist, return
  if (!player) return;

  player.xp += amount;

  // Check if player has enough xp to level up
  if (player.xp >= 100) {
    player.level++;
    player.xp = 0; // Subtract 100 xp from player's xp
    setSpawningTo(false);
    levelUpAnimation = k.add([
      k.sprite("LevelUp", { anim: "LevelUp" }),
      k.origin("center"),
      k.pos(),
      k.scale(0.6),
      k.lifespan(1),
      k.follow(player, vec2(0, -15)),
    ]);
    k.wait(0.63, () => {
        toggleLevelUpPause();
      // Button size and spacing
      const buttonSize = 100;
      const buttonSpacing = 20;

      // Calculate button positions
      const buttonX = player.pos.x - buttonSize - buttonSpacing;
      const buttonY = player.pos.y;

      // Create Button 1
      const button1 = k.add([
        k.rect(buttonSize, buttonSize),
        k.origin("center"),
        k.pos(buttonX, buttonY),
        k.color(0, 0, 0),
        k.area(),
      ]);

      // Create Button 2
      const button2 = k.add([
        k.rect(buttonSize, buttonSize),
        k.origin("center"),
        k.pos(buttonX + buttonSize + buttonSpacing, buttonY),
        k.color(0, 0, 0),
        k.area(),
      ]);

      // Create Button 3
      const button3 = k.add([
        k.rect(buttonSize, buttonSize),
        k.origin("center"),
        k.pos(buttonX + (buttonSize + buttonSpacing) * 2, buttonY),
        k.color(0, 0, 0),
        k.area(),
      ]);
      button1.onClick(() => {
          toggleLevelUpPause();
          setSpawningTo(true);
          destroy(button1);
          destroy(button2);
          destroy(button3);
      });
    });
  }
}
