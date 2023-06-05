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
    "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  ];

  k.addLevel(levelData, {
    width: 16,
    height: 16,
    "X": () => [
      k.sprite("grass"),
      k.pos(0,0),
      k.solid(),
      k.area(),],
  });

  return levelData;
}
