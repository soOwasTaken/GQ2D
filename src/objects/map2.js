import k from "../main";
import { Player } from "./player";


export function map2() {
  const levelData = [
    "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
    "X                                                  X",
    "X                                                  X",
    "X                                                  X",
    "X                                                  X",
    "X                                                  X",
    "X            XXX  XX      XX                       X",
    "X           X   XX  X    X  X                      X",
    "X          X         X  X   X                      X",
    "X          X          XX     X                     X",
    "X          X                 X                     X",
    "X         X                 XX                     X",
    "X        X                  X                      X",
    "X        X                                         X",
    "X       X                                          X",
    "X       X                                          X",
    "X      X                                           X",
    "X      X                                           X",
    "X       X                                          X",
    "X        X                                         X",
    "X         XX                                       X",
    "X                                                  X",
    "X                                                  X",
    "X                                                  X",
    "X                                                  X",
    "X                                                  X",
    "X                                                  X",
    "X                                                  X",
    "X                                                  X",
    "X                                                  X",
    "X                                                  X",
    "X                                                  X",
    "X                                                  X",
    "X                                                  X",
    "X                                                  X",
    "X                                                  X",
    "X                                                  X",
    "X                                                  X",
    "X                                                  X",
    "X                                                  X",
    "X                                                  X",
    "X                                                  X",
    "X                                                  X",
    "X                                                  X",
    "X                                                  X",
    "X                                                  X",
    "X                                                  X",
    "X                                                  X",
    "X                                                  X",
    "X                                                  X",
    "X                                                  X",
    "X                                                  X",
    "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  ];

  k.addLevel(levelData, {
    width: 16,
    height: 16,
    "X": () => [
      k.sprite("transparent"),
      k.pos(0, 0),
      k.solid(),
      k.origin("center"),
      k.area({ scale :0.5 })],
  });

    let background = k.add([
      k.sprite("map2"),
      // Make the background centered on the screen
      k.pos(16, 16),
      // Allow the background to be scaled
      k.scale(1),
      // Keep the background position fixed even when the camera moves
    ]);

  return levelData;
}
