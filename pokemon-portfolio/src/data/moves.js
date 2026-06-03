export const MOVES = {
  // NORMAL
  TACKLE: { id: "TACKLE", name: "Tackle", type: "normal", power: 40, accuracy: 100 },
  SCRATCH: { id: "SCRATCH", name: "Scratch", type: "normal", power: 40, accuracy: 100 },
  QUICK_ATTACK: { id: "QUICK_ATTACK", name: "Quick Attack", type: "normal", power: 40, accuracy: 100 },
  SLAM: { id: "SLAM", name: "Slam", type: "normal", power: 80, accuracy: 75 },
  BODY_SLAM: { id: "BODY_SLAM", name: "Body Slam", type: "normal", power: 85, accuracy: 100 },
  HYPER_BEAM: { id: "HYPER_BEAM", name: "Hyper Beam", type: "normal", power: 150, accuracy: 90 },

  // GRASS
  VINE_WHIP: { id: "VINE_WHIP", name: "Vine Whip", type: "grass", power: 45, accuracy: 100 },
  RAZOR_LEAF: { id: "RAZOR_LEAF", name: "Razor Leaf", type: "grass", power: 55, accuracy: 95 },
  SOLAR_BEAM: { id: "SOLAR_BEAM", name: "Solar Beam", type: "grass", power: 120, accuracy: 100 },

  // FIRE
  EMBER: { id: "EMBER", name: "Ember", type: "fire", power: 40, accuracy: 100 },
  FIRE_PUNCH: { id: "FIRE_PUNCH", name: "Fire Punch", type: "fire", power: 75, accuracy: 100 },
  FLAMETHROWER: { id: "FLAMETHROWER", name: "Flamethrower", type: "fire", power: 90, accuracy: 100 },
  FIRE_BLAST: { id: "FIRE_BLAST", name: "Fire Blast", type: "fire", power: 110, accuracy: 85 },

  // WATER
  WATER_GUN: { id: "WATER_GUN", name: "Water Gun", type: "water", power: 40, accuracy: 100 },
  BUBBLE_BEAM: { id: "BUBBLE_BEAM", name: "Bubble Beam", type: "water", power: 65, accuracy: 100 },
  SURF: { id: "SURF", name: "Surf", type: "water", power: 90, accuracy: 100 },
  HYDRO_PUMP: { id: "HYDRO_PUMP", name: "Hydro Pump", type: "water", power: 110, accuracy: 80 },

  // ELECTRIC
  THUNDER_SHOCK: { id: "THUNDER_SHOCK", name: "Thunder Shock", type: "electric", power: 40, accuracy: 100 },
  THUNDER_PUNCH: { id: "THUNDER_PUNCH", name: "Thunder Punch", type: "electric", power: 75, accuracy: 100 },
  THUNDERBOLT: { id: "THUNDERBOLT", name: "Thunderbolt", type: "electric", power: 90, accuracy: 100 },
  THUNDER: { id: "THUNDER", name: "Thunder", type: "electric", power: 110, accuracy: 70 },

  // FLYING
  PECK: { id: "PECK", name: "Peck", type: "flying", power: 35, accuracy: 100 },
  AERIAL_ACE: { id: "AERIAL_ACE", name: "Aerial Ace", type: "flying", power: 60, accuracy: 100 },
  WING_ATTACK: { id: "WING_ATTACK", name: "Wing Attack", type: "flying", power: 60, accuracy: 100 },

  // POISON
  POISON_STING: { id: "POISON_STING", name: "Poison Sting", type: "poison", power: 15, accuracy: 100 },
  SLUDGE_BOMB: { id: "SLUDGE_BOMB", name: "Sludge Bomb", type: "poison", power: 90, accuracy: 100 },

  // BUG
  BUG_BITE: { id: "BUG_BITE", name: "Bug Bite", type: "bug", power: 60, accuracy: 100 },

  // GROUND
  MUD_SLAP: { id: "MUD_SLAP", name: "Mud-Slap", type: "ground", power: 20, accuracy: 100 },
  EARTHQUAKE: { id: "EARTHQUAKE", name: "Earthquake", type: "ground", power: 100, accuracy: 100 },

  // ROCK
  ROCK_THROW: { id: "ROCK_THROW", name: "Rock Throw", type: "rock", power: 50, accuracy: 90 },

  // FIGHTING
  KARATE_CHOP: { id: "KARATE_CHOP", name: "Karate Chop", type: "fighting", power: 50, accuracy: 100 },

  // PSYCHIC
  CONFUSION: { id: "CONFUSION", name: "Confusion", type: "psychic", power: 50, accuracy: 100 },
  PSYCHIC: { id: "PSYCHIC", name: "Psychic", type: "psychic", power: 90, accuracy: 100 },

  // GHOST
  LICK: { id: "LICK", name: "Lick", type: "ghost", power: 30, accuracy: 100 },
  SHADOW_BALL: { id: "SHADOW_BALL", name: "Shadow Ball", type: "ghost", power: 80, accuracy: 100 },

  // DRAGON
  DRAGON_RAGE: { id: "DRAGON_RAGE", name: "Dragon Rage", type: "dragon", power: 40, accuracy: 100 },

  // ICE
  ICE_PUNCH: { id: "ICE_PUNCH", name: "Ice Punch", type: "ice", power: 75, accuracy: 100 },
  ICE_BEAM: { id: "ICE_BEAM", name: "Ice Beam", type: "ice", power: 90, accuracy: 100 },
  BLIZZARD: { id: "BLIZZARD", name: "Blizzard", type: "ice", power: 110, accuracy: 70 },

  // DARK
  BITE: { id: "BITE", name: "Bite", type: "dark", power: 60, accuracy: 100 },
  CRUNCH: { id: "CRUNCH", name: "Crunch", type: "dark", power: 80, accuracy: 100 },

  // STEEL
  IRON_TAIL: { id: "IRON_TAIL", name: "Iron Tail", type: "steel", power: 100, accuracy: 75 },

  // FAIRY
  DISARMING_VOICE: { id: "DISARMING_VOICE", name: "Disarm Voice", type: "fairy", power: 40, accuracy: 100 },
};

/** Get an array of all moves */
const ALL_MOVES = Object.values(MOVES);

/** 
 * Returns up to 4 moves based on the Pokemon's types and level.
 * Always includes at least one basic normal move.
 */
export function getRandomMoves(types, level) {
  const possibleMoves = [];

  // Filter moves that match the Pokemon's types
  const typeMoves = ALL_MOVES.filter(m => types.includes(m.type));

  // Filter basic normal moves
  const normalMoves = ALL_MOVES.filter(m => m.type === "normal");

  // Separate weak and strong moves
  const strongMoves = typeMoves.filter(m => m.power >= 80);
  const weakMoves = typeMoves.filter(m => m.power < 80);

  // Guarantee a basic normal move
  possibleMoves.push(normalMoves[Math.floor(Math.random() * normalMoves.length)]);

  // Add type moves
  if (level >= 30 && strongMoves.length > 0) {
    possibleMoves.push(strongMoves[Math.floor(Math.random() * strongMoves.length)]);
  }

  // Fill remainder with random weak type moves
  const availableWeak = weakMoves.filter(m => !possibleMoves.some(p => p.id === m.id));
  while (possibleMoves.length < 4 && availableWeak.length > 0) {
    const r = availableWeak.splice(Math.floor(Math.random() * availableWeak.length), 1)[0];
    possibleMoves.push(r);
  }

  // If still under 4 moves, add random normal moves
  const availableNormal = normalMoves.filter(m => !possibleMoves.some(p => p.id === m.id));
  while (possibleMoves.length < 4 && availableNormal.length > 0) {
    const r = availableNormal.splice(Math.floor(Math.random() * availableNormal.length), 1)[0];
    possibleMoves.push(r);
  }

  return possibleMoves.slice(0, 4);
}
