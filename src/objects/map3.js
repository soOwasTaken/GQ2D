import k from "../main";
import { Player } from "./player";


export function map3() {
  const levelData = [
    "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
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
      k.sprite("map3"),
      k.pos(16, 16),
      k.scale(1),
    ]);

  return levelData;
}
