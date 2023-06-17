import kaboom from "kaboom";
import { loadAssets } from "./loader";
import { loadMainScene } from "./scenes/mainScene";
import { loadStartScene } from "./scenes/mainScene";
import { Player } from "./objects/player";
import { setCircleEnabled } from "./objects/spells/circleOfFire";
import { setFreezingEnabled } from "./objects/spells/freeze";
const k = kaboom({
  scale: 2.5,
  height: 800,
  weight: 800,
  background: [0, 0, 0],
});

export default k;

loadAssets();
loadStartScene();

let finalTime; // Declare finalTime variable outside of the initUI function

scene("lose", (score) => {
  // Add the "Game Over" text object with text() component and options
  const gameOverText = k.add([
    k.text("Game Over", 32), // Change the size as necessary
    k.pos(k.width() / 2, k.height() / 2), // Center the button
    k.origin("center"),
  ]);
  k.add([
    k.text("Press any key to restart"), // Change the size as necessary
    k.pos(k.width() / 2, k.height() / 2 + 50), // Center the button
    k.origin("center"),
    k.scale(0.3),
  ]);

  // Go back to the main scene when space is pressed
  onKeyPress("space", () => location.reload());
  onClick(() => location.reload());
});

k.on("death", "player", (e) => {
  clearInterval(timerInterval); // Stop the timer
  finalTime = timerLabel.text; // Store the final time in the finalTime variable
  k.go("lose");
});

let gameIsPaused = false;

k.go("start");
