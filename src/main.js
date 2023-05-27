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

  k.on("death", "player", (e) => {
    k.go("lose");
  });

k.go("main");
