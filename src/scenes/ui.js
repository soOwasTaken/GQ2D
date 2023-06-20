import k from "../main";
import { Player } from "../objects/player";
import { spawnMonsters } from "../objects/monster";
import { isGamePaused } from "../objects/pause";
import { getScore } from "./score";
const PlayerBaseHealth = 100;

const urlParams = new URLSearchParams(window.location.search);
const level = urlParams.get("level") || 1;

function createScoreDisplay() {
  const scoreLabel = add([
    text(`Score: ${getScore()}`, 4),
    pos(10, 50), // Adjust this as needed
    layer("ui"),
    fixed(),
    scale(0.15),
    {
      update() {
        this.text = `Score: ${getScore()}`; // Update the score display each frame
      },
    },
  ]);
}

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

  const healthLabel = add([
    text("Health", 4),
    pos(10, 2),
    layer("ui"),
    fixed(),
    scale(0.1),
  ]);

  const healthText = add([
    text(player.hp().toString(), maxHealthBar.width, {
      size: maxHealthBar.height,
      width: maxHealthBar.width,
      textAlign: "top",
    }),
    pos(maxHealthBar.pos.x + 45, maxHealthBar.pos.y - 5),
    fixed(),
    layer("ui"),
    scale(0.2),
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

function createExperienceBar() {
  const player = Player();

  const maxExpBar = add([
    rect(width() / 2, 12),
    pos(10, 30),
    outline(2),
    color(0, 0, 0),
    fixed(),
    layer("ui"),
    scale(0.3),
  ]);

  const expBar = add([
    rect(0, 12),
    pos(10, 30),
    color(128, 0, 128),
    fixed(),
    scale(0.3),
    {
      set(xp) {
        if (player.level < player.maxLevel) {
          const percentage = xp / player.maxXP;
          this.width = (width() / 2) * percentage;
          this.color = rgb(128, 0, 128); // keep original color
        }
      },
    },
    layer("ui"),
  ]);

  const expLabel = add([
    text("XP", 4),
    pos(10, 22),
    layer("ui"),
    fixed(),
    scale(0.1),
  ]);

  const expText = add([
    text(player.xp.toString(), maxExpBar.width, {
      size: maxExpBar.height,
      width: maxExpBar.width,
      textAlign: "top",
    }),
    pos(maxExpBar.pos.x + 45, maxExpBar.pos.y - 5),
    fixed(),
    layer("ui"),
    scale(0.2),
    {
      update() {
        this.text = player.xp.toString();
      },
    },
  ]);
  // New text for "Level Max"
  const levelMaxText = add([
    text("", 10), // initialize with empty string
    pos(20, 30), // you can adjust the position as needed
    layer("ui"),
    fixed(),
    scale(0.15),
  ]);

  player.onUpdate(() => {
    if (player.level < 9) {
      expBar.set(player.xp);
      levelMaxText.text = ""; // clear the text
    } else {
      // If level is 3 or more, hide the XP bar and show "Level Max"
      destroy(expBar);
      destroy(maxExpBar);
      destroy(expText);
      levelMaxText.text = "Level Max"; // Show "Level Max"
    }
  });
}

function createTimer() {
  let seconds = 0;
  let minutes = 0;

  const timerLabel = add([
    text("00:00", 4),
    pos(10, 70),
    layer("ui"),
    fixed(),
    scale(0.15),
  ]);

  loop(1, () => {
    if (!isGamePaused()) {
      seconds += 1;
      if (seconds >= 60) {
        seconds = 0;
        minutes += 1;
      }
      const formattedTime = `${padZero(minutes)}:${padZero(seconds)}`;
      timerLabel.text = formattedTime;
    }
  });

  action(() => debug.log("FPS: " + debug.fps())); //comment for fps show
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
  createScoreDisplay();
  createExperienceBar();
  const timerLabel = createTimer();
  spawnMonsters(timerLabel);
}
