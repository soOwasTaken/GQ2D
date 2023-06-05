import k from "../main";
import { Player } from "../objects/player";
import { spawnMonsters } from "../objects/monster";

const PlayerBaseHealth = 100;

function createHealthBar() {
  const player = Player();

  const maxHealthBar = add([
    rect(width() / 2, 12),
    pos(10, 10),
    outline(2),
    color(0, 0, 0),
    fixed(),
    layer("ui"),
    scale(0.3),
  ]);

  const healthbar = add([
    rect(width() / 2, 12),
    pos(10, 10),
    color(107, 201, 108),
    fixed(),
    scale(0.3),
    {
      max: PlayerBaseHealth,
      set(hp) {
        const percentage = hp / this.max;
        this.width = (width() / 2) * percentage;
        this.color = getColorByPercentage(percentage);
        this.flash = true;
      },
    },
    layer("ui"),
  ]);

  const healthText = add([
    text(player.hp().toString(), maxHealthBar.width, {
      size: maxHealthBar.height,
      width: maxHealthBar.width,
      textAlign: "top",
    }),
    pos((maxHealthBar.pos.x + 25), (maxHealthBar.pos.y - 10)),
    fixed(),
    layer("ui"),
    scale(0.3),
    {
      update() {
        this.text = player.hp().toString();
      },
    },
  ]);

  player.onHurt(() => {
    healthbar.set(player.hp());
  });
}


function createTimer() {
  let seconds = 0;
  let minutes = 0;

  const timerLabel = add([
    text("00:00", 4),
    pos(10, 30),
    layer("ui"),
    fixed(),
    scale(0.3),
  ]);

  loop(1, () => {
    seconds += 1;
    if (seconds >= 60) {
      seconds = 0;
      minutes += 1;
    }
    const formattedTime = `${padZero(minutes)}:${padZero(seconds)}`;
    timerLabel.text = formattedTime;
  });

  action(() => debug.log("FPS: " + debug.fps()));

  return timerLabel;
}

function padZero(num) {
  return num.toString().padStart(2, "0");
}

function getColorByPercentage(percentage) {
  const startColor = [107, 201, 108]; // Green color
  const endColor = [201, 107, 107]; // Red color

  const color = [];

  for (let i = 0; i < 3; i++) {
    const startValue = startColor[i];
    const endValue = endColor[i];
    const value = Math.round(startValue + (endValue - startValue) * percentage);
    color.push(value);
  }

  return rgb(...color);
}

export function initUI() {
  layers(["game", "ui"], "ui");
  createHealthBar();
  const timerLabel = createTimer();
  spawnMonsters(timerLabel);
}
