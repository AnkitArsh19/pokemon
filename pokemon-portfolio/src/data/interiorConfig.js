/**
 * INTERIOR_CONFIG
 * 
 * This file allows you to hardcode and fully customize every aspect of an interior map.
 * If you leave a property as `null` or omit it, the game will automatically calculate a dynamic fallback.
 * 
 * Properties:
 * - scale: The visual size of the player sprite.
 * - speed: How fast the player moves.
 * - spawn: { x, y } where the player starts when entering the room.
 * - exitY: The Y coordinate threshold. Walking down past this number triggers the exit.
 * - bounds: { x, y, width, height } the physics boundary of the room.
 * - obstacles: Array of { x, y, width, height } for static objects you can't walk through (e.g., tables).
 *              Note: x, y represents the CENTER of the rectangle.
 */

export const INTERIOR_CONFIG = {
  'interior_1': {
    scale: 3,
    speed: 200,
    spawn: { x: 603, y: 873 },
    exitY: 873,
    exitZone: { x: 550, width: 100 },

    bounds: {
      x: -1,
      y: 115,
      width: 1068,
      height: 765
    },

    obstacles: [
      {
        x: 53.25,
        y: 518,
        width: 103.5,
        height: 335
      },
      {
        x: 378.5,
        y: 519.5,
        width: 214,
        height: 324
      },
      {
        x: 765.5,
        y: 525.5,
        width: 213,
        height: 318
      },
      {
        x: 1088.25,
        y: 511,
        width: 123.5,
        height: 352
      },
      {
        x: 1117.25,
        y: 832.25,
        width: 59.5,
        height: 94.5
      },
      {
        x: 1000.5,
        y: 248.5,
        width: 249,
        height: 95
      },
      {
        x: 349.75,
        y: 161.75,
        width: 575.5,
        height: 129.5
      },
      {
        x: 29.25,
        y: 824.75,
        width: 52.5,
        height: 90.5
      }
    ]
  },
  'interior_2': {
    scale: 3,
    speed: 200,
    spawn: { x: 288, y: 492 },
    exitY: 462,
    exitZone: { x: 265, width: 120 },

    bounds: {
      x: 0,
      y: 116,
      width: 698,
      height: 400
    },

    obstacles: [
      {
        x: 510.25,
        y: 326.25,
        width: 125.5,
        height: 150.5
      },
      {
        x: 672.75,
        y: 326.25,
        width: 54.5,
        height: 151.5
      },
      {
        x: 542.75,
        y: 117.5,
        width: 185.5,
        height: -5
      },
      {
        x: 127.5,
        y: 385.75,
        width: 124,
        height: 30.5
      },
      {
        x: 125.5,
        y: 194.25,
        width: 251,
        height: 170.5
      }
    ]
  },
  'interior_3': {
    scale: 3,
    speed: 200,
    spawn: { x: 478, y: 558 },
    exitY: 560,
    exitZone: { x: 480, width: 120 },

    bounds: {
      x: 2,
      y: 118,
      width: 948,
      height: 470
    },

    obstacles: [
      {
        x: 58,
        y: 384.75,
        width: 118,
        height: 125.5
      },
      {
        x: 479.5,
        y: 152.5,
        width: 438,
        height: 116
      },
      {
        x: 767.25,
        y: 390.5,
        width: 118.5,
        height: 154
      },
      {
        x: 925.5,
        y: 428.75,
        width: 59,
        height: 102.5
      }
    ]
  },
  'interior_4': {
    scale: 3,
    speed: 200,
    spawn: { x: 528, y: 616 },
    exitY: 616,
    exitZone: { x: 530, width: 180 },

    bounds: {
      x: 117,
      y: 147,
      width: 823,
      height: 450
    },

    obstacles: [
      {
        x: 529.75,
        y: 330.75,
        width: 370.5,
        height: 160.5
      },
      {
        x: 372.75,
        y: 249,
        width: 56.5,
        height: 67
      },
      {
        x: 687.25,
        y: 251.75,
        width: 52.5,
        height: 65.5
      }
    ]
  },
  'interior_5': {
    scale: 3,
    speed: 200,
    spawn: { x: 476, y: 625 },
    exitY: 630,
    exitZone: { x: 480, width: 120 },

    bounds: {
      x: -1,
      y: 119,
      width: 960,
      height: 528
    },

    obstacles: [
      {
        x: 370.5,
        y: 165.25,
        width: 737,
        height: 101.5
      },
      {
        x: 859.75,
        y: 220,
        width: 51.5,
        height: 53.5
      },
      {
        x: 924,
        y: 294.5,
        width: 63,
        height: 339
      },
      {
        x: 891,
        y: 579.75,
        width: 109,
        height: 89.5
      },
      {
        x: 315.75,
        y: 357,
        width: 126.5,
        height: 67
      },
      {
        x: 30.25,
        y: 531,
        width: 58.5,
        height: 165
      },
      {
        x: 126,
        y: 580.25,
        width: 112,
        height: 96.5
      }
    ]
  },
  'red_house': {
    scale: 3,
    speed: 200,
    spawn: { x: 218, y: 546 },
    exitY: 500,

    bounds: {
      x: 6,
      y: 160,
      width: 765,
      height: 414
    },

    obstacles: [
      {
        x: 707.5,
        y: 180,
        width: 127,
        height: 80
      },
      {
        x: 36.75,
        y: 456.75,
        width: 59.5,
        height: 113.5
      },
      {
        x: 737.75,
        y: 457.25,
        width: 60.5,
        height: 109.5
      },
      {
        x: 388,
        y: 321.75,
        width: 264,
        height: 137.5
      }
    ]
  },
  'oak_lab': {
    scale: 3,
    speed: 200,
    spawn: { x: 414, y: 795 },
    exitY: 795,
    exitZone: { x: 415, width: 80 },

    bounds: {
      x: 0,
      y: 138,
      width: 829,
      height: 671
    },

    obstacles: [
      {
        x: 157,
        y: 525.25,
        width: 312,
        height: 122.5
      },
      {
        x: 670.25,
        y: 525,
        width: 311.5,
        height: 119
      },
      {
        x: 123.5,
        y: 292.25,
        width: 121,
        height: 141.5
      },
      {
        x: 607,
        y: 296.75,
        width: 189,
        height: 95.5
      },
      {
        x: 30.5,
        y: 754.25,
        width: 54,
        height: 95.5
      },
      {
        x: 795,
        y: 755.25,
        width: 56,
        height: 97.5
      }
    ]
  }
};
