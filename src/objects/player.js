import k from "../main";

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
    k.health(1),
  ]);

  player.on("destroy", () => {
    player = null;
  });

  player.onUpdate(() => {
    camPos(player.pos);
  });

  const SPEED = 120;

  onKeyDown("right", () => {
    player.flipX(false);
    player.move(SPEED, 0);
  });

  onKeyDown("left", () => {
    player.flipX(true);
    player.move(-SPEED, 0);
  });

  onKeyDown("up", () => {
    player.move(0, -SPEED);
  });

  onKeyDown("down", () => {
    player.move(0, SPEED);
  });

  onKeyPress(["left", "right", "up", "down"], () => {
    player.play("run");
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

  return player;
}

export function getPlayer() {
  return player;
}
