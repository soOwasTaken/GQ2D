import k from "../main";

let player;

export function Player() {
  if (player) {
    return player;
  }

  player = k.add([
    k.pos(120, 80),
    k.sprite("rogue", { anim: "idle" }),
    k.area({ width: 39, height: 81, offset: k.vec2(0, 6) }),
    k.solid(),
    k.scale(0.8),
    k.origin("bot"),
    "player", // this is a tag that we can get using k.get
    k.health(100),
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
