import kaboom from "kaboom";
import { loadAssets } from "./loader";
import { loadMainScene } from "./scenes/mainScene";
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
loadMainScene();

let finalTime; // Declare finalTime variable outside of the initUI function

scene("lose", (score) => {
  // Add the "Game Over" text object with text() component and options
  const gameOverText = add([
    text("Game Over", {
      font: "apl386",
      size: 96,
      color: rgb(255, 0, 0),
      origin: "center",
      anchor: "centertop",
    }),
  ]);

  // Add finalTime text object below the "Game Over" text
  const finalTimeText = add([
    text(finalTime, {
      font: "apl386",
      size: 48,
      color: rgb(255, 255, 255),
      origin: "center",
      anchor: "center",
    }),
  ]);
  setCircleEnabled(false);
  setFreezingEnabled(false);

  // Go back to the main scene when space is pressed
  onKeyPress("space", () => go("main"));
  onClick(() => go("main"));
});

k.on("death", "player", (e) => {
  clearInterval(timerInterval); // Stop the timer
  finalTime = timerLabel.text; // Store the final time in the finalTime variable
  k.go("lose");
});

let gameIsPaused = false;

k.go("main");
