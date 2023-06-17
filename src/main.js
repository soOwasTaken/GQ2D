import kaboom from "kaboom";
import { loadAssets } from "./loader";
import { loadMainScene } from "./scenes/mainScene";
import { loadStartScene } from "./scenes/mainScene";
import { Player } from "./objects/player";
import { setCircleEnabled } from "./objects/spells/circleOfFire";
import { setFreezingEnabled } from "./objects/spells/freeze";
import { getScore } from "./scenes/score";
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
    k.pos(k.width() / 2, k.height() / 2 - 10), // Center the button
    k.origin("center"),
  ]);
        k.add([
          k.text(`Your score was: ${getScore()}`), // Change the size as necessary
          k.pos(k.width() / 2, k.height() / 2 + 40), // Center the button
          k.origin("center"),
          k.scale(0.3),
        ]);
  k.add([
    k.text("Press space to restart, or press \"s\" to save your score"), // Change the size as necessary
    k.pos(k.width() / 2, k.height() / 2 + 70), // Center the button
    k.origin("center"),
    k.scale(0.2),
  ]);
  onKeyPress("s", () => {
    const playerName = prompt("Enter your name:");

    if (playerName !== null) {
      const playerScore = getScore();

      // Send the score to the server
      fetch("/game-2d/score", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: playerName, score: playerScore }),
      })
        .then((response) => {
          if (response.ok) {
            console.log("Score saved successfully");
          } else {
            console.error("Error saving score", response);
          }
        })
        .catch((error) => console.error("Error sending score:", error));
    }
  });
  onKeyPress("space", () => location.reload());
});

k.on("death", "player", (e) => {
  clearInterval(timerInterval); // Stop the timer
  finalTime = timerLabel.text; // Store the final time in the finalTime variable
  k.go("lose");
});

let gameIsPaused = false;

k.go("start");
