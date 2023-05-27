import k from "../main";

export function createGameOverScene() {
  const scene = k.scene("gameOver");

  scene.create(() => {
    const gameOverText = k.add([
      k.text("Game Over", 32),
      k.pos(k.width() / 2, k.height() / 2),
      k.origin("center"),
      k.layer("ui"),
    ]);

    const retryButton = k.add([
      k.rect(120, 40),
      k.pos(k.width() / 2, k.height() / 2 + 60),
      k.origin("center"),
      k.color(0, 0, 0),
      k.layer("ui"),
      k.scale(1),
      k.origin("center"),
      k.text("Retry", 16),
      k.color(1, 1, 1),
      k.solid(),
      k.mouseArea(),
    ]);

    retryButton.on("click", () => {
      // Restart the game or perform any desired action on retry
      // For example, you can transition back to the main game scene
      k.go("main");
    });

    retryButton.onHover(() => {
      retryButton.scale = k.vec2(1.1);
    });

    retryButton.onOut(() => {
      retryButton.scale = k.vec2(1);
    });
  });

  return k.scene("gameover");
}
