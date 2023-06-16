import k from "../main";
import { Player } from "./player";

export function map() {
  const levelData = [
    "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
    "X                                                 X",
    "X                                                 X",
    "X                                                 X",
    "X                                                 X",
    "X                                                 X",
    "X                                                 X",
    "X                                                 X",
    "X                                                 X",
    "X                                                 X",
    "X                                                 X",
    "X                                                 X",
    "X                                                 X",
    "X                                                 X",
    "X                                                 X",
    "X                                                 X",
    "X                                                 X",
    "X                                                 X",
    "X                                                 X",
    "X                                                 X",
    "X                                                 X",
    "X                                                 X",
    "X                                                 X",
    "X                                                 X",
    "X                                                 X",
    "X                                                 X",
    "X                                                 X",
    "X                                                 X",
    "X                                                 X",
    "X                                                 X",
    "X                                                 X",
    "X                                                 X",
    "X                                                 X",
    "X                                                 X",
    "X                                                 X",
    "X                                                 X",
    "X                                                 X",
    "X                                                 X",
    "X                                                 X",
    "X                                                 X",
    "X                                                 X",
    "X                                                 X",
    "X                                                 X",
    "X                                                 X",
    "X                                                 X",
    "X                                                 X",
    "X                                                 X",
    "X                                                 X",
    "X                                                 X",
    "X                                                 X",
    "X                                                 X",
    "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  ];

  k.addLevel(levelData, {
    width: 16,
    height: 16,
    "X": () => [
      k.sprite("grass"),
      k.pos(0, 0),
      k.solid(),
      k.area()],
  });

  let background = k.add([
    k.sprite("TEST"),
    // Make the background centered on the screen
    k.pos(16, 16),
    // Allow the background to be scaled
    k.scale(1),
    // Keep the background position fixed even when the camera moves
  ]);

  return levelData;
}
