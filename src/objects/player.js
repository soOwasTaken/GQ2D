import k from "../main";
import { isGamePaused, togglePause, isLevelUpPaused } from "./pause";
let player;


export function Player() {
  if (player) {
    return player;
  }

  player = k.add([
    k.pos(width() / 2, height() / 2),
    k.sprite("rogue", { anim: "idle" }),
    k.area({ width: 15, height: 40, offset: k.vec2(0, 6) }),
    k.solid(),
    k.scale(0.96),
    k.origin("center"),
    "player", // this is a tag that we can get using k.get
    k.health(100),
    {
      xp: 0,
      level: 1,
    },
  ]);

  player.on("destroy", () => {
    player = null;
  });

  player.onUpdate(() => {
    camPos(player.pos);
  });

  const SPEED = 120;

  onKeyDown("right", () => {
    if (!isGamePaused()) {
      player.flipX(false);
      player.move(SPEED, 0);
    }
  });

  onKeyDown("left", () => {
    if (!isGamePaused()) {
      player.flipX(true);
      player.move(-SPEED, 0);
    }
  });

  onKeyDown("up", () => {
    if (!isGamePaused()) {
      player.move(0, -SPEED);
    }
  });

  onKeyDown("down", () => {
    if (!isGamePaused()) {
      player.move(0, SPEED);
    }
  });

  onKeyPress(["left", "right", "up", "down"], () => {
    if (!isGamePaused()) {
      player.play("run");
    }
  });

  onKeyRelease(["left", "right", "up", "down"], () => {
    if (
      !isKeyDown("left") &&
      !isKeyDown("right") &&
      !isKeyDown("up") &&
      !isKeyDown("down")
    ) {
      player.play("idle");
    }
  });

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
