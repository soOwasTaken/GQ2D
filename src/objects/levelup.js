import k from "../main";
import { getPlayer } from "./player";
import { setSpawningTo, toggleLevelUpPause } from "./pause";
import { playAttackAnimation } from "./spells/attack";
import { setCircleEnabled } from "./spells/circleOfFire";
import { spawnTornadoes } from "./spells/tornados";
import { monsterWeapon } from "./monsterWeapon";
import { setEnemySpeed, getEnemySpeed } from "./monster";
import { setFreezingEnabled } from "./spells/freeze";
import { resetMonsterAI } from "./monster";

const levelUpButtons = [];
// Define the available actions the player can choose from
const actions = [
  {
    id: 1,
    action: playAttackAnimation,
    icon: "fireArcIcon",
    available: true,
    description:
      "Attach to the player:\nA fire aura for close enemies\nDamage : 5",
  },
  {
    id: 2,
    action: setCircleEnabled,
    icon: "explosionIcon",
    available: true,
    description:
      "20% chance on hit :\nExplosion that deal area damage\nDamage : 10 to 15",
  },
  {
    id: 3,
    action: spawnTornadoes,
    icon: "tornadoIcon",
    available: true,
    description:
      "Every 5s :\nSpawn Tornadoes on close monster\nDamage :3 to 7, also slow enemy",
  },
  {
    id: 4,
    action: increasePlayerSpeed,
    icon: "moveSpeed",
    available: true,
    description: "Buff :\nIncrease Player Speed\nMovespeed 120 -> 160",
  },
  {
    id: 5,
    action: decreaseEnemySpeed,
    icon: "enemySpeed",
    available: true,
    description:
      "Debuff :\nNew spawning monster are slower\nMovespeed 70 -> 50",
  },
  {
    id: 6,
    action: setFreezingEnabled,
    icon: "freezeIcon",
    available: true,
    description:
      "50% chance on hit from weapon :\nFreeze Enemy for a time\nFreeze duration : 3s",
  },
];

function increasePlayerSpeed() {
  const player = getPlayer();
  player.speed += 40;
}

function decreaseEnemySpeed() {
  const value = getEnemySpeed() - 20;
  setEnemySpeed(value);
}

function showTooltip(button, description) {
  const existingTooltip = button.tooltip;
  if (existingTooltip) {
    existingTooltip.destroy();
  }

  const tooltip = k.add([
    k.text(description),
    k.pos(button.pos.x - 60, button.pos.y - 100),
    k.color(255, 255, 255),
    k.scale(0.15),
    "tooltipTag",
    k.lifespan(0.000001),
  ]);

  return button.tooltip;
}

// This function increases player's xp and checks if the player levels up
export function increasePlayerXP(amount) {
  const player = getPlayer();
  if (!player) return;

  player.xp += amount;
  if (player.level < 7) {
    if (player.xp >= player.maxXP) {
      // Check if player has enough xp to level up
      player.level++;
      player.xp = 0; // Subtract max xp from player's xp
      if (player.level === 2) {
        player.maxXP = 500;
      }
      if (player.level === 3) {
        player.maxXP = 800;
      }
      if (player.level === 4) {
        player.maxXP = 1200;
      }
      if (player.level === 5) {
        player.maxXP = 1800;
      }
      if (player.level === 6) {
        player.maxXP = 2400;
      }

      levelUpAnimation = k.add([
        k.sprite("LevelUp", { anim: "LevelUp" }),
        k.origin("center"),
        k.pos(),
        k.scale(0.6),
        k.follow(player, vec2(0, -15)),
      ]);

      k.wait(0.63, () => {
        toggleLevelUpPause();
        setSpawningTo(false);
        // Button size and spacing
        const buttonSize = 100;
        const buttonSpacing = 20;

        k.destroy(levelUpAnimation);

        // Calculate button positions
        const buttonX = player.pos.x - buttonSize - buttonSpacing;
        const buttonY = player.pos.y;

        // Filter available actions from the actions array
        const availableActions = actions.filter((action) => action.available);

        // Randomly select available actions for the player
        const selectedActions = getRandomActions(3, availableActions); // Adjust the number of available actions as needed

        // Create buttons for the selected actions
        selectedActions.forEach((action, index) => {
          let button = k.add([
            k.rect(buttonSize, buttonSize),
            k.origin("center"),
            k.pos(buttonX + (buttonSize + buttonSpacing) * index, buttonY),
            k.area(),
            k.sprite(action.icon),
            k.scale(0.5),
            "buttonTag",
          ]);
          levelUpButtons.push(button); // Add button to the array
          button.onHover(
            () => {
              button.use(scale(0.6));
              showTooltip(button, action.description);
            },
            () => {
              button.use(scale(0.5));
              if (button.tooltip) {
                button.tooltip = null;
              }
            }
          );
          button.onClick(() => {
            const player = getPlayer();
            destroyButtons();
            k.get("tooltipTag").map((tooltip) => tooltip.destroy());
            let countdownValue = 3;
            let countdown = k.add([
              k.text(countdownValue.toString()),
              k.pos(player.pos),
              k.origin("center"),
              k.layer("ui"),
              k.scale(1.6),
              { value: countdownValue },
            ]);

            // update countdown every second
            k.wait(2, toggleLevelUpPause);
            for (let i = 0; i < 3; i++) {
              k.wait(i, () => {
                countdown.value--;
                countdown.text = countdown.value.toString();
                if (countdown.value === 0) {
                  countdown.text = countdown.value.toString();
                  countdown.destroy();
                  action.action(); // Call the selected action
                  if (action.action === setCircleEnabled) {
                    action.action(true); // Pass the argument to enable the circle
                  }
                  if (action.action === setFreezingEnabled) {
                    action.action(true); // Pass the argument to enable the circle
                  }
                  action.available = false;
                }
                resetMonsterAI();
                setSpawningTo(true);
              });
            }
          });
        });
      });
    }
  }
}

function showCountdown(count) {
  k.add([
    k.text(count.toString(), 32),
    k.pos(k.width() / 2, k.height() / 2),
    k.origin("center"),
    k.color(1, 1, 1),
    k.layer("ui"),
    {
      countdown: count,
    },
  ]);
}

function startCountdown() {
  let count = 3;

  // Display countdown numbers at regular intervals
  const countdownInterval = k.every(1, () => {
    showCountdown(count);
    count--;

    if (count < 0) {
      countdownInterval();
      toggleLevelUpPause();
    }
  });
}

// Helper function to randomly select actions from the available actions array
function getRandomActions(count, availableActions) {
  const shuffledActions = availableActions.sort(() => 0.5 - Math.random());
  return shuffledActions.slice(0, count);
}

// Helper function to destroy the level up buttons
function destroyButtons() {
  levelUpButtons.forEach((button) => {
    button.destroy();
  });

  // Clear the array of buttons
  levelUpButtons.length = 0;
}
