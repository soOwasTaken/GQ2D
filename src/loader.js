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
    bone_sword: {
      x: 0,
      y: 0,
      width: 16,
      height: 80,
    },
  });
  k.loadSprite("skel1","sprites/skel1.png", {
    sliceX: 6,
    anims: {
      run: {
        from: 0,
        to: 5,
        loop: true,
        speed: 10,
      },
    },
  });
}
