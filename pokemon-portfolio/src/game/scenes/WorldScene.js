import Phaser from "phaser";
import EasyStar from "easystarjs";
import Player from "../prefabs/Player";
import MovableCharacter from "../prefabs/MovableCharacter";
import EventBus from "../EventBus";
import gameState from "../../data/gameState";
import audioManager from "../../data/audioManager";
import { getSpriteUrl } from "../../data/pokemon151";
import { BOARD_TEXT_POOL } from "../../data/boardTexts";

/**
 * WorldScene — Main game world.
 * Ported from pokevue's WorldScene.js with exact same tilemap/movement logic.
 * Adapted for React EventBus instead of Vue event bus.
 */
export default class WorldScene extends Phaser.Scene {
  constructor() {
    super({ key: "WorldScene" });
    this.lastPlayerTileX = -1;
    this.lastPlayerTileY = -1;
    this.encounterBlocked = false;
    this.encounterCooldown = 0;
    this.positionHistory = [];
    this.followerSprite = null;
    this.followerPokemonId = null;
  }

  init(data) {
    if (data) {
      this.customSpawnX = data.spawnX;
      this.customSpawnY = data.spawnY;
    }
  }

  create() {
    // ── Create tilemap from Tiled JSON ──
    const map = this.make.tilemap({ key: "map" });
    const tileset = map.addTilesetImage("spz3zUx_small", "tiles");

    // Create the world layer (same as pokevue)
    const worldLayer = map.createLayer("World", tileset, 0, 0);
    worldLayer.setCollisionByProperty({ collides: true });

    // ── Camera setup ──
    const camera = this.cameras.main;
    camera.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

    // ── Spawn player at map's spawn point or custom location ──
    let startX, startY;
    if (this.customSpawnX !== undefined && this.customSpawnY !== undefined) {
      // Convert tile coordinates to world coordinates (centered on tile)
      startX = this.customSpawnX * 16 + 8;
      startY = this.customSpawnY * 16 + 8;
    } else {
      const spawnPoint = map.findObject("Objects", (obj) => obj.name === "Spawn Point");
      startX = spawnPoint.x;
      startY = spawnPoint.y;
    }

    this.player = new Player(this, startX, startY);
    this.physics.world.bounds.width = map.widthInPixels;
    this.physics.world.bounds.height = map.heightInPixels;

    if (gameState.hasSelectedStarter) {
      audioManager.play('pallet_town', true);
    }

    // ── Spawn NPCs (use prof_chen sprite with tints for different NPCs) ──
    this.npcs = [];

    // Prof Oak near his lab
    const profChenSpawn = map.findObject(
      "Objects",
      (obj) => obj.name === "Prof. Chen",
    );
    if (profChenSpawn) {
      const profOak = new MovableCharacter(
        this,
        profChenSpawn.x,
        profChenSpawn.y,
        "prof_chen",
      );
      profOak.dialogueKey = "profChen";
      profOak.npcDisplayName = "PROF. OAK";
      this.npcs.push(profOak);
    }

    // Removed additional tinted professors

    // ── Camera follows player ──
    camera.startFollow(this.player);
    camera.roundPixels = true;
    camera.setZoom(2);

    // ── Collision ──
    this.physics.add.collider(this.player, worldLayer);

    // ── Store map reference ──
    this.map = map;

    // ── Handle zones (location names) ──
    try {
      const zonesLayer = this.map.getObjectLayer("Zones");
      if (zonesLayer) {
        this.zones = zonesLayer.objects.map((zone) => ({
          object: zone,
          bounds: new Phaser.Geom.Rectangle(
            zone.x,
            zone.y,
            zone.width,
            zone.height,
          ),
        }));
      } else {
        this.zones = [];
      }
    } catch (e) {
      this.zones = [];
    }

    this.currentZone = null;

    // Detect initial zone
    this.zones.forEach((zone) => {
      if (
        Phaser.Geom.Rectangle.Overlaps(this.player.getBounds(), zone.bounds)
      ) {
        this.currentZone = zone.object.name;
        EventBus.emit("zoneChange", { zone: this.currentZone });
      }
    });

    // ── Keyboard handlers ──
    this.input.keyboard.on("keydown-SPACE", () => {
      this.player.handleAction();
    });

    this.input.keyboard.on("keydown-ENTER", () => {
      this.player.handleAction();
    });

    this.input.keyboard.on("keydown-Z", () => {
      this.player.handleAction();
    });

    this.input.keyboard.on("keydown-ESC", () => {
      EventBus.emit("showMenu", { section: "main" });
    });

    // ── EasyStar pathfinding for click-to-move ──
    this.finder = new EasyStar.js();

    const grid = [];
    for (let y = 0; y < this.map.height; y++) {
      const columns = [];
      for (let x = 0; x < this.map.width; x++) {
        const tile = this.map.getTileAt(x, y);
        columns.push(tile ? tile.index : -1);
      }
      grid.push(columns);
    }
    this.finder.setGrid(grid);

    // Determine walkable tiles
    const firstTileset = this.map.tilesets[0];
    const properties = firstTileset.tileProperties;
    const acceptableTiles = [];

    for (let i = firstTileset.firstgid - 1; i < tileset.total; i++) {
      if (!properties.hasOwnProperty(i)) {
        acceptableTiles.push(i + 1);
        continue;
      }
      if (!properties[i].collides) acceptableTiles.push(i + 1);
    }
    this.finder.setAcceptableTiles(acceptableTiles);

    // ── Click-to-move ──
    this.input.on("pointerup", this.handleClick.bind(this));

    // ── EventBus listeners from React ──
    this.blockInputUnsub = EventBus.on("blockInput", () => {
      this.player.inputBlocked = true;
    });
    this.unblockInputUnsub = EventBus.on("unblockInput", () => {
      this.player.inputBlocked = false;
    });

    // Mobile controls
    this.mobileUnsub = EventBus.on("mobileDirection", (dir) => {
      if (!this.player.inputBlocked && !this.player.isMoving) {
        this.player.moveTo(dir);
      }
    });
    this.mobileInteractUnsub = EventBus.on("mobileInteract", () => {
      this.player.handleAction();
    });

    // ── Tile cursor marker (like pokevue) ──
    this.marker = this.add.graphics();
    this.marker.fillStyle(0xffffff, 0.3);
    this.marker.fillRect(0, 0, this.map.tileWidth, this.map.tileHeight);

    // ── Encounter blocking ──
    this.encounterEndUnsub = EventBus.on("encounterEnd", () => {
      this.encounterBlocked = false;
    });

    // Teleport cheat from menu
    this.teleportUnsub = EventBus.on('teleportToHouse', (data) => {
      this.scene.start('InteriorScene', { interiorKey: data.interiorKey, houseId: data.houseId, returnX: data.returnX, returnY: data.returnY });
    });

    // Notify React that the scene is ready
    EventBus.emit('current-scene-ready', this);
  }

  update(time, delta) {
    // ── Update marker position (account for camera zoom) ──
    const worldPoint = this.input.activePointer.positionToCamera(
      this.cameras.main,
    );
    const pointerTileX = this.map.worldToTileX(worldPoint.x);
    const pointerTileY = this.map.worldToTileY(worldPoint.y);
    this.marker.x = this.map.tileToWorldX(pointerTileX);
    this.marker.y = this.map.tileToWorldY(pointerTileY);

    const hoverTile = this.map.getTileAt(pointerTileX, pointerTileY);
    this.marker.setVisible(hoverTile && !hoverTile.collides);

    // ── Player movement ──
    this.player.update(time, delta);

    // ── Step tracking + XP ──
    if (this.player.isFullyOnTile()) {
      const tileX = Math.floor(this.player.x / 16);
      const tileY = Math.floor(this.player.y / 16);

      if (tileX !== this.lastPlayerTileX || tileY !== this.lastPlayerTileY) {
        this.lastPlayerTileX = tileX;
        this.lastPlayerTileY = tileY;

        // Grant walking XP (only if party exists)
        if (gameState.party.length > 0) {
          const events = gameState.processStep();
          if (events.length > 0) {
            EventBus.emit("gameEvents", events);
          }

          // Follower update removed
        }

        // Wild encounter check — only if there's a conscious Pokémon
        if (!this.encounterBlocked && gameState.getLeadPokemon()) {
          this.encounterCooldown++;
          if (this.encounterCooldown >= 20) {
            // 5% chance per check after 40 tiles of cooldown
            if (Math.random() < 0.05) {
              this.encounterBlocked = true;
              this.encounterCooldown = 0;
              this.player.inputBlocked = true;
              EventBus.emit("wildEncounter", null);
            }
          }
        }

        // ── Portfolio Interiors (Doors) ──
        const doors = {
          '66,207': { image: 'red_house', id: 'house_1' },
          '76,213': { image: 'oak_lab', id: 'house_2' },
          '75,207': { image: 'interior_1', id: 'house_3' },
          '74,146': { image: 'interior_2', id: 'house_4' },
          '73,138': { image: 'interior_3', id: 'house_5' },
          '84,139': { image: 'interior_4', id: 'house_6' },
          '73,131': { image: 'interior_5', id: 'house_7' },
          '84,130': { image: 'interior_2', id: 'house_8' },
          '66,91':  { image: 'interior_5', id: 'house_9' },
          '78,86':  { image: 'interior_1', id: 'house_10' },
        };
        const doorKey = `${tileX},${tileY}`;
        if (doors[doorKey]) {
          this.player.inputBlocked = true;
          this.cameras.main.fadeOut(300);
          this.cameras.main.once('camerafadeoutcomplete', () => {
            this.scene.start('InteriorScene', { 
              interiorKey: doors[doorKey].image, 
              houseId: doors[doorKey].id, 
              returnX: tileX, 
              returnY: tileY 
            });
          });
        }
      }

      // Zone detection
      const playerBounds = new Phaser.Geom.Rectangle(
        this.player.x - 8,
        this.player.y - 8,
        16,
        16,
      );

      this.zones.forEach((zone) => {
        if (Phaser.Geom.Rectangle.Overlaps(playerBounds, zone.bounds)) {
          if (this.currentZone !== zone.object.name) {
            this.currentZone = zone.object.name;
            EventBus.emit("zoneChange", { zone: this.currentZone });
          }
        }
      });
    }

    // ── NPC occupation tracking ──
    this.npcs.forEach((npc) => npc.updateCaseOccupation());

    // Follower tracking removed
  }

  handleClick(pointer) {
    // Use positionToCamera to correctly handle zoom
    const worldPoint = this.cameras.main.getWorldPoint(pointer.x, pointer.y);
    const toX = Math.floor(worldPoint.x / 16);
    const toY = Math.floor(worldPoint.y / 16);
    const fromX = Math.floor(this.player.x / 16);
    const fromY = Math.floor(this.player.y / 16);


    const nextTile = this.map.getTileAt(toX, toY);
    if (!nextTile) return;

    if (toX === fromX && toY === fromY) {
      // Clicked on player — open menu
      EventBus.emit("showMenu", { section: "main" });
    } else {
      // Pathfind to clicked tile
      this.finder.findPath(fromX, fromY, toX, toY, (path) => {
        if (path === null) {
          console.warn("Path not found.");
        } else {
          if (this.player.isFullyOnTile()) {
            if (this.player.timeline) {
              this.player.timeline.stop();
              this.player.timeline = null;
            }
            this.player.moveAlongPath(path);
          }
        }
      });
      this.finder.calculate();
    }
  }

  /**
   * Get point-of-interest text for a tile the player is facing.
   */
  getPointOfInterest(tile, direction) {
    try {
      const poiLayer = this.map.getObjectLayer("Points of interest");
      if (!poiLayer) return null;

      const poi = poiLayer.objects.find(
        (obj) => obj.x === tile.pixelX && obj.y === tile.pixelY,
      );

      if (poi && poi.properties) {
        // Tiled custom properties can be an array or object
        const props = Array.isArray(poi.properties)
          ? poi.properties.reduce((acc, p) => {
            acc[p.name] = p.value;
            return acc;
          }, {})
          : poi.properties;

        let textContent = props.text;

        // ── Custom Portfolio Boards ──
        // All board tile coordinates from the map data:
        // (69,211) = Town Sign     | (65,214) = Tip Board 1
        // (76,216) = Lab Sign      | (73,207) = Green's House
        // (64,207) = Red's House   | (69,191) = Route 1 Sign
        // (68,151) = Tip Board 2   | (68,136) = Jadielle Sign
        // (80,130) = Gym Sign      | (71,121) = Tip Board 3
        const tileX = Math.floor(poi.x / 16);
        const tileY = Math.floor(poi.y / 16);
        const key = `${tileX},${tileY}`;

        const BOARD_KEYS = [
          '69,211', '65,214', '76,216', '73,207', '64,207',
          '69,191', '68,151', '68,136', '80,130', '71,121', '67,113'
        ];

        if (BOARD_KEYS.includes(key)) {
          const randomIndex = Math.floor(Math.random() * BOARD_TEXT_POOL.length);
          return BOARD_TEXT_POOL[randomIndex];
        }

        if (textContent) {
          return textContent;
        }

        if (props[direction]) return textContent || props[direction];
        if (props.text) return textContent;
      }
    } catch (e) {
      // Points of interest layer may not exist
    }
    return null;
  }

  shutdown() {
    // Clean up event listeners
    if (this.closeMenuUnsub) this.closeMenuUnsub();
    if (this.blockInputUnsub) this.blockInputUnsub();
    if (this.unblockInputUnsub) this.unblockInputUnsub();
    if (this.teleportUnsub) this.teleportUnsub();
    if (this.mobileUnsub) this.mobileUnsub();
    if (this.mobileInteractUnsub) this.mobileInteractUnsub();
    if (this.encounterEndUnsub) this.encounterEndUnsub();
    if (this.starterUnsub) this.starterUnsub();
    // Follower unsub removed
  }
}