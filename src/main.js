import kaboom from "kaboom";
import { loadAssets } from "./loader";
import { loadMainScene } from "./scenes/mainScene";
import { loadStartScene } from "./scenes/mainScene";
import { Player } from "./objects/player";
import { setCircleEnabled } from "./objects/spells/circleOfFire";
import { setFreezingEnabled } from "./objects/spells/freeze";
import { getScore } from "./scenes/score";
const urlParams = new URLSearchParams(window.location.search);
const level = urlParams.has("level") ? parseInt(urlParams.get("level")) : 1;

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
    k.text('Press "r" to restart, press "s" to save your score\nOr you can press "q" to return to space.'), // Change the size as necessary
    k.pos(k.width() / 2, k.height() / 2 + 70), // Center the button
    k.origin("center"),
    k.scale(0.2),
  ]);
  onKeyPress("s", () => {
    const playerName = prompt("Enter your name:");
    if (playerName !== null) {
      const playerScore = getScore();

      // Include the session ID when sending the score
      if (level === 1) {
        fetch("/game-2d/score", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            sessionId: localStorage.getItem("sessionId"),
            name: playerName,
            score: playerScore,
            map: "map1",
          }),
        })
          .then((response) => {
            // Handle response
            return response.json();
          })
          .then((data) => {
            // Use data
          })
          .catch((error) => {
            console.error("Error:", error);
          });
      } else if (level === 2) {
        fetch("/game-2d/score", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            sessionId: localStorage.getItem("sessionId"),
            name: playerName,
            score: playerScore,
            map: "map2",
          }),
        })
          .then((response) => {
            // Handle response
            return response.json();
          })
          .then((data) => {
            // Use data
          })
          .catch((error) => {
            console.error("Error:", error);
          });
      }
    }
  });
  onKeyPress("r", () => location.reload());
  keyPress("q", () => {
    window.location.href = new URL("/3D_scene.html", window.location.href).href;
  });
});

let gameIsPaused = false;

k.go("start");
