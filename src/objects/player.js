import k from "../main";
import { isGamePaused, togglePause, isLevelUpPaused } from "./pause";
let player;


export function Player() {
  if (player) {
    return player;
  }

  player = k.add([
    k.pos(400, 400),
    k.sprite("rogue", { anim: "idle" }),
    k.area({ width: 15, height: 40, offset: k.vec2(0, 6) }),
    k.scale(0.96),
    k.solid(),
    k.origin("center"),
    "player", // this is a tag that we can get using k.get
    k.health(100),
    {
      xp: 0,
      level: 1,
      maxXP: 200,
      speed: 120,
      maxLevel: 7,
    },
  ]);

  player.on("destroy", () => {
    player = null;
  });

  player.onUpdate(() => {
    camPos(player.pos);
  });

  onKeyDown(["right", "d"], () => {
    if (!isGamePaused()) {
      player.flipX(false);
      player.move(player.speed, 0);
    }
  });

  onKeyDown(["left", "q"], () => {
    if (!isGamePaused()) {
      player.flipX(true);
      player.move(-player.speed, 0);
    }
  });

  onKeyDown(["up", "z"], () => {
    if (!isGamePaused()) {
      player.move(0, -player.speed);
    }
  });

  onKeyDown(["down", "s"], () => {
    if (!isGamePaused()) {
      player.move(0, player.speed);
    }
  });
    onKeyDown("x", () => {
      debug.log("pos: " + mousePos());
    });

  onKeyPress(["left", "right", "up", "down", "z", "q", "s", "d"], () => {
    if (!isGamePaused()) {
      player.play("run");
    }
  });

  onKeyRelease(
    ["left", "right", "up", "down", "z", "q", "s", "d"],
    () => {
      if (
        !isKeyDown("left") &&
        !isKeyDown("right") &&
        !isKeyDown("up") &&
        !isKeyDown("down") &&
        !isKeyDown("z") &&
        !isKeyDown("q") &&
        !isKeyDown("s") &&
        !isKeyDown("d")
      ) {
        player.play("idle");
      }
    }
  );

  k.on("death", "player", (e) => {
    go("lose");
  });
  let gameIsPaused = false;

k.onKeyPress("p", () => {
  if (!isLevelUpPaused()) {
    togglePause();
  }
});

  return player;
}

export function getPlayer() {
  return player;
}
