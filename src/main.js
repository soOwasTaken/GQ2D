import kaboom from "kaboom";
import { loadAssets } from "./loader";
import { loadMainScene } from "./scenes/mainScene";
import { Player } from "./objects/player";

const k = kaboom({
  scale: 4,
});
export default k;

loadAssets();
loadMainScene();

scene("lose", (score) => {
  add([sprite("rogue"), pos(width() / 2, height() / 2 - 108), scale(3)]);

  // go back to game with space is pressed
  onKeyPress("space", () => go("main"));
  onClick(() => go("main"));
});

k.on("death", "player", (e) => {
  k.go("lose");
});

k.go("main");
