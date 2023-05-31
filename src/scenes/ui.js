import k from "../main";
import { Player } from "../objects/player";

let healthBar; // Declare the health bar variable globally

function createHealthBar() {
  const player = Player();

  if (!player) {
    return; // Return if player does not exist
  }

  if (!healthBar) {
    const healthBarWidth = player.health * 2; // Adjust the width based on player's health
    healthBar = k.add([
      k.rect(healthBarWidth, 10),
      k.pos(10, 10),
      k.color(0, 1, 0),
      k.layer("ui"),
      k.fixed(),
      {
        width: healthBarWidth, // Set the initial width based on player's health
      },
    ]);
  }

  // Update the width and color of the health bar based on player's health
  healthBar.width = player.health * 2;
  if (player.health > 50) {
    healthBar.color = k.rgb(0, 1, 0); // Green
  } else if (player.health > 20) {
    healthBar.color = k.rgb(1, 1, 0); // Yellow
  } else {
    healthBar.color = k.rgb(1, 0, 0); // Red
  }
}

function createTimer() {
  let time = 0;

  const timerLabel = k.add([
    k.text("0", 4),
    k.pos(10, 30),
    k.layer("ui"),
    k.fixed(),
    k.scale(0.3),
  ]);

  k.loop(1, () => {
    time += 1;
    timerLabel.text = time.toString();
  });

  return timerLabel;
}

export function initUI() {
  k.layers(["game", "ui"], "ui"); // Switch to the "ui" layer as the active layer
  createHealthBar();
  createTimer();
}
