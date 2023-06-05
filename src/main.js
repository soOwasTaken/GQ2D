import kaboom from "kaboom";
import { loadAssets } from "./loader";
import { loadMainScene } from "./scenes/mainScene";
import { Player } from "./objects/player";

const k = kaboom({
  scale: 4,
  height: 800,
  weight: 800,
  background: [0, 0, 0],
});

export default k;

loadAssets();
loadMainScene();

scene("lose", (score) => {

  // Add the "Game Over" text object with text() component and options
  const gameOverText = add([
    text("Game Over", {
      font: "apl386",
      size: 96,
      color: rgb(255, 0, 0),
      origin: "center",
      anchor:("centertop")
    }),
  ]);

  // go back to game with space is pressed
  onKeyPress("space", () => go("main"));
  onClick(() => go("main"));
});

k.on("death", "player", (e) => {
  k.go("lose");
});

k.go("main");
