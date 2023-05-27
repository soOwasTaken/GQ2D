import k from "../main";

export function map() {

  k.addLevel(
    [
      "                                                  ",
      "                                                  ",
      "                                                  ",
      "                                                  ",
      "                                                  ",
      "                                                  ",
      "                                                  ",
      "                                                  ",
      "                                                  ",
      "                                                  ",
      "                                                  ",
      "                                                  ",
      "                                                  ",
      "                                                  ",
      "                                                  ",
      "                                                  ",
      "                                                  ",
      "                                                  ",
      "                                                  ",
      "                                                  ",
      "                                                  ",
      "                                                  ",
      "                                                  ",
      "                                                  ",
      "                                                  ",
      "                                                  ",
      "                                                  ",
      "                                                  ",
      "                                                  ",
      "                                                  ",
      "                                                  ",
      "                                                  ",
      "                                                  ",
      "                                                  ",
    ],
    {
      width: 16,
      height: 16,
      " ": () => [k.sprite("grass", { frame: ~~rand(0, 20) })],
    }
  );

    return map;
}
