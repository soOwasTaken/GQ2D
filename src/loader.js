import k from "./main";

export function loadAssets() {
  k.loadSprite("rogue", "sprites/rogue.png", {
    sliceX: 10,
    anims: {
      idle: {
        from: 0,
        to: 3,
        loop: true,
        speed: 3,
      },
      run: {
        from: 4,
        to: 9,
        loop: true,
        speed: 10,
      },
    },
  });
  k.loadSprite("hero", "sprites/1.png", {
    sliceX: 12,
    anims: {
      walkDown: {
        from: 0,
        to: 2,
        speed: 5,
        loop: 3,
      },
      idleDown: 1,
      walkLeft: {
        from: 3,
        to: 5,
        speed: 5,
        loop: 3,
      },
      idleLeft: 4,
      walkRight: {
        from: 6,
        to: 8,
        speed: 5,
        loop: 3,
      },
      idleRight: 7,
      walkUp: {
        from: 9,
        to: 11,
        speed: 5,
        loop: 3,
      },
      idleUp: 9,
    },
  });

  k.loadSprite("monster", "sprites/monster1.png");
  k.loadSprite("TEST", "sprites/TEST2.png");
  k.loadSprite("map2", "sprites/map2Colisions.png");
  k.loadSprite("attack", "sprites/attack.png", {
    sliceX: 10,
    anims: {
      1: {
        from: 0,
        to: 9,
        speed: 12,
        loop: 3,
      },
    },
  });
  k.loadSpriteAtlas("sprites/ground1.png", {
    pink_floor: {
      x: 0,
      y: 0,
      width: 288,
      height: 48,
      sliceX: 6,
    },
  });

  k.loadSpriteAtlas("sprites/grass.png", {
    grass: {
      x: 0,
      y: 0,
      width: 336,
      height: 16,
      sliceX: 21,
    },
  });

  k.loadSpriteAtlas("sprites/Bone.png", {
    bone_spear: {
      x: 0,
      y: 0,
      width: 16,
      height: 80,
    },
    bone: {
      x: 16,
      y: 16,
      width: 16,
      height: 32,
    },
    bone_axe: {
      x: 48,
      y: 16,
      width: 16,
      height: 32,
    },
    bow: {
      x: 48,
      y: 48,
      width: 48,
      height: 32,
      sliceX: 3,
        anims: {
          idle: 0,
          charging: { from: 0, to: 2 },
        },
      },
    arrow: {
      x: 32,
      y: 0,
      width: 16,
      height: 16,
    },
  });
  k.loadSprite("skel1", "sprites/skel1.png", {
    sliceX: 6,
    anims: {
      run: {
        from: 0,
        to: 5,
        loop: true,
        speed: 10,
      },
      idle: {
        from: 2,
        to: 2,
      }
    },
  });

  k.loadSprite("hit_thrust", "sprites/hit_thrust.png", {
    sliceX: 4,
    anims: {
      hit: {
        from: 0,
        to: 3,
        loop: false,
        speed: 15,
      },
    },
  });

  k.loadSprite("ThrustSfx", "sprites/ThrustSfx.png", {
    sliceX: 7,
    anims: {
      hit: {
        from: 0,
        to: 6,
        loop: false,
        speed: 100,
      },
    },
  });
  k.loadSprite("LevelUp", "sprites/LevelUp.png", {
    sliceX: 50,
    anims: {
      LevelUp: {
        from: 0,
        to: 49,
        loop: false,
        speed: 100,
      },
    },
  });
  k.loadSprite("circleOfFire", "sprites/FireCast_96x96.png", {
    sliceX: 28,
    anims: {
      Circle: {
        from: 0,
        to: 27,
        loop: false,
        speed: 70,
      },
    },
  });

  k.loadSprite("Tornado", "sprites/TornadoLoop_96x96.png", {
    sliceX: 60,
    anims: {
      spin: {
        from: 0,
        to: 59,
        loop: true,
        speed: 100,
      },
    },
  });
  k.loadSprite("tornadoIcon", "sprites/icons/tornado.png");
  k.loadSprite("fireArcIcon", "sprites/icons/FireArc.png");
  k.loadSprite("explosionIcon", "sprites/icons/explosion.png");
  k.loadSprite("moveSpeed", "sprites/icons/movespeed.png");
  k.loadSprite("enemySpeed", "sprites/icons/enemyMovespeed.png");
  k.loadSprite("freezeIcon", "sprites/icons/Freezing.png");
  k.loadSprite("Freeze", "sprites/crystal_39x37-sheet.png", {
    sliceX: 25,
    anims: {
      freezing: {
        from: 0,
        to: 24,
        loop: false,
        speed: 100,
      },
    },
  });
  k.loadSpriteAtlas("sprites/DesertTiles.png", {
    transparent: {
      x: 112,
      y: 31,
      width: 16,
      height: 16,
    },
    wallendfacingRight: {
      x: 0,
      y: 128,
      width: 16,
      height: 48,
    },
  });
    k.loadSpriteAtlas("sprites/Desert-Gold.png", {
      "staff": {
        x: 112,
        y: 0,
        width: 16,
        height: 48,
      },
    });
    k.loadSprite("iceSpike", "sprites/IcePick_64x64.png", {
      sliceX: 30,
      anims: {
        spike: {
          from: 0,
          to: 29,
          loop: true,
          speed: 150,
        },
      },
    });
}
