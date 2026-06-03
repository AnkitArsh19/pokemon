/**
 * Complete Gen 1 Pokédex — all 151 original Pokémon.
 * Data: id, name, types, base stats, evolution info, tier.
 * Sprites loaded at runtime from PokeAPI CDN.
 */

// Sprite URL helpers
export const getSpriteUrl = (id) =>
  `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
export const getShinyUrl = (id) =>
  `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/${id}.png`;
export const getBackSpriteUrl = (id) =>
  `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/${id}.png`;
export const getShinyBackSpriteUrl = (id) =>
  `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/shiny/${id}.png`;

// Rarity tiers
export const TIER = { COMMON: 'common', UNCOMMON: 'uncommon', RARE: 'rare', LEGENDARY: 'legendary' };

// Type color map
export const TYPE_COLORS = {
  normal: '#A8A878', fire: '#F08030', water: '#6890F0', electric: '#F8D030',
  grass: '#78C850', ice: '#98D8D8', fighting: '#C03028', poison: '#A040A0',
  ground: '#E0C068', flying: '#A890F0', psychic: '#F85888', bug: '#A8B820',
  rock: '#B8A038', ghost: '#705898', dragon: '#7038F8', dark: '#705848',
  steel: '#B8B8D0', fairy: '#EE99AC',
};

/**
 * All 151 Pokémon. evolvesTo: [targetId, levelRequired]
 */
export const POKEDEX = [
  { id:1,  name:'Bulbasaur',  types:['grass','poison'],   baseHp:45,  baseAtk:49, baseSpd:45, tier:TIER.UNCOMMON, evolvesTo:[2,16] },
  { id:2,  name:'Ivysaur',    types:['grass','poison'],   baseHp:60,  baseAtk:62, baseSpd:60, tier:TIER.UNCOMMON, evolvesTo:[3,32] },
  { id:3,  name:'Venusaur',   types:['grass','poison'],   baseHp:80,  baseAtk:82, baseSpd:80, tier:TIER.RARE,     evolvesTo:null },
  { id:4,  name:'Charmander', types:['fire'],             baseHp:39,  baseAtk:52, baseSpd:65, tier:TIER.UNCOMMON, evolvesTo:[5,16] },
  { id:5,  name:'Charmeleon', types:['fire'],             baseHp:58,  baseAtk:64, baseSpd:80, tier:TIER.UNCOMMON, evolvesTo:[6,36] },
  { id:6,  name:'Charizard',  types:['fire','flying'],    baseHp:78,  baseAtk:84, baseSpd:100,tier:TIER.RARE,     evolvesTo:null },
  { id:7,  name:'Squirtle',   types:['water'],            baseHp:44,  baseAtk:48, baseSpd:43, tier:TIER.UNCOMMON, evolvesTo:[8,16] },
  { id:8,  name:'Wartortle',  types:['water'],            baseHp:59,  baseAtk:63, baseSpd:58, tier:TIER.UNCOMMON, evolvesTo:[9,36] },
  { id:9,  name:'Blastoise',  types:['water'],            baseHp:79,  baseAtk:83, baseSpd:78, tier:TIER.RARE,     evolvesTo:null },
  { id:10, name:'Caterpie',   types:['bug'],              baseHp:45,  baseAtk:30, baseSpd:45, tier:TIER.COMMON,   evolvesTo:[11,7] },
  { id:11, name:'Metapod',    types:['bug'],              baseHp:50,  baseAtk:20, baseSpd:30, tier:TIER.COMMON,   evolvesTo:[12,10] },
  { id:12, name:'Butterfree', types:['bug','flying'],     baseHp:60,  baseAtk:45, baseSpd:70, tier:TIER.UNCOMMON, evolvesTo:null },
  { id:13, name:'Weedle',     types:['bug','poison'],     baseHp:40,  baseAtk:35, baseSpd:50, tier:TIER.COMMON,   evolvesTo:[14,7] },
  { id:14, name:'Kakuna',     types:['bug','poison'],     baseHp:45,  baseAtk:25, baseSpd:35, tier:TIER.COMMON,   evolvesTo:[15,10] },
  { id:15, name:'Beedrill',   types:['bug','poison'],     baseHp:65,  baseAtk:90, baseSpd:75, tier:TIER.UNCOMMON, evolvesTo:null },
  { id:16, name:'Pidgey',     types:['normal','flying'],  baseHp:40,  baseAtk:45, baseSpd:56, tier:TIER.COMMON,   evolvesTo:[17,18] },
  { id:17, name:'Pidgeotto',  types:['normal','flying'],  baseHp:63,  baseAtk:60, baseSpd:71, tier:TIER.COMMON,   evolvesTo:[18,36] },
  { id:18, name:'Pidgeot',    types:['normal','flying'],  baseHp:83,  baseAtk:80, baseSpd:101,tier:TIER.UNCOMMON, evolvesTo:null },
  { id:19, name:'Rattata',    types:['normal'],           baseHp:30,  baseAtk:56, baseSpd:72, tier:TIER.COMMON,   evolvesTo:[20,20] },
  { id:20, name:'Raticate',   types:['normal'],           baseHp:55,  baseAtk:81, baseSpd:97, tier:TIER.COMMON,   evolvesTo:null },
  { id:21, name:'Spearow',    types:['normal','flying'],  baseHp:40,  baseAtk:60, baseSpd:70, tier:TIER.COMMON,   evolvesTo:[22,20] },
  { id:22, name:'Fearow',     types:['normal','flying'],  baseHp:65,  baseAtk:90, baseSpd:100,tier:TIER.UNCOMMON, evolvesTo:null },
  { id:23, name:'Ekans',      types:['poison'],           baseHp:35,  baseAtk:60, baseSpd:55, tier:TIER.COMMON,   evolvesTo:[24,22] },
  { id:24, name:'Arbok',      types:['poison'],           baseHp:60,  baseAtk:85, baseSpd:80, tier:TIER.UNCOMMON, evolvesTo:null },
  { id:25, name:'Pikachu',    types:['electric'],         baseHp:35,  baseAtk:55, baseSpd:90, tier:TIER.UNCOMMON, evolvesTo:[26,22] },
  { id:26, name:'Raichu',     types:['electric'],         baseHp:60,  baseAtk:90, baseSpd:110,tier:TIER.RARE,     evolvesTo:null },
  { id:27, name:'Sandshrew',  types:['ground'],           baseHp:50,  baseAtk:75, baseSpd:40, tier:TIER.COMMON,   evolvesTo:[28,22] },
  { id:28, name:'Sandslash',  types:['ground'],           baseHp:75,  baseAtk:100,baseSpd:65, tier:TIER.UNCOMMON, evolvesTo:null },
  { id:29, name:'Nidoran♀',   types:['poison'],           baseHp:55,  baseAtk:47, baseSpd:41, tier:TIER.COMMON,   evolvesTo:[30,16] },
  { id:30, name:'Nidorina',   types:['poison'],           baseHp:70,  baseAtk:62, baseSpd:56, tier:TIER.UNCOMMON, evolvesTo:[31,36] },
  { id:31, name:'Nidoqueen',  types:['poison','ground'],  baseHp:90,  baseAtk:92, baseSpd:76, tier:TIER.RARE,     evolvesTo:null },
  { id:32, name:'Nidoran♂',   types:['poison'],           baseHp:46,  baseAtk:57, baseSpd:50, tier:TIER.COMMON,   evolvesTo:[33,16] },
  { id:33, name:'Nidorino',   types:['poison'],           baseHp:61,  baseAtk:72, baseSpd:65, tier:TIER.UNCOMMON, evolvesTo:[34,36] },
  { id:34, name:'Nidoking',   types:['poison','ground'],  baseHp:81,  baseAtk:102,baseSpd:85, tier:TIER.RARE,     evolvesTo:null },
  { id:35, name:'Clefairy',   types:['fairy'],            baseHp:70,  baseAtk:45, baseSpd:35, tier:TIER.UNCOMMON, evolvesTo:[36,30] },
  { id:36, name:'Clefable',   types:['fairy'],            baseHp:95,  baseAtk:70, baseSpd:60, tier:TIER.RARE,     evolvesTo:null },
  { id:37, name:'Vulpix',     types:['fire'],             baseHp:38,  baseAtk:41, baseSpd:65, tier:TIER.UNCOMMON, evolvesTo:[38,30] },
  { id:38, name:'Ninetales',  types:['fire'],             baseHp:73,  baseAtk:76, baseSpd:100,tier:TIER.RARE,     evolvesTo:null },
  { id:39, name:'Jigglypuff', types:['normal','fairy'],   baseHp:115, baseAtk:45, baseSpd:20, tier:TIER.COMMON,   evolvesTo:[40,30] },
  { id:40, name:'Wigglytuff', types:['normal','fairy'],   baseHp:140, baseAtk:70, baseSpd:45, tier:TIER.UNCOMMON, evolvesTo:null },
  { id:41, name:'Zubat',      types:['poison','flying'],  baseHp:40,  baseAtk:45, baseSpd:55, tier:TIER.COMMON,   evolvesTo:[42,22] },
  { id:42, name:'Golbat',     types:['poison','flying'],  baseHp:75,  baseAtk:80, baseSpd:90, tier:TIER.UNCOMMON, evolvesTo:null },
  { id:43, name:'Oddish',     types:['grass','poison'],   baseHp:45,  baseAtk:50, baseSpd:30, tier:TIER.COMMON,   evolvesTo:[44,21] },
  { id:44, name:'Gloom',      types:['grass','poison'],   baseHp:60,  baseAtk:65, baseSpd:40, tier:TIER.UNCOMMON, evolvesTo:[45,36] },
  { id:45, name:'Vileplume',  types:['grass','poison'],   baseHp:75,  baseAtk:80, baseSpd:50, tier:TIER.RARE,     evolvesTo:null },
  { id:46, name:'Paras',      types:['bug','grass'],      baseHp:35,  baseAtk:70, baseSpd:25, tier:TIER.COMMON,   evolvesTo:[47,24] },
  { id:47, name:'Parasect',   types:['bug','grass'],      baseHp:60,  baseAtk:95, baseSpd:30, tier:TIER.UNCOMMON, evolvesTo:null },
  { id:48, name:'Venonat',    types:['bug','poison'],     baseHp:60,  baseAtk:55, baseSpd:45, tier:TIER.COMMON,   evolvesTo:[49,31] },
  { id:49, name:'Venomoth',   types:['bug','poison'],     baseHp:70,  baseAtk:65, baseSpd:90, tier:TIER.UNCOMMON, evolvesTo:null },
  { id:50, name:'Diglett',    types:['ground'],           baseHp:10,  baseAtk:55, baseSpd:95, tier:TIER.COMMON,   evolvesTo:[51,26] },
  { id:51, name:'Dugtrio',    types:['ground'],           baseHp:35,  baseAtk:100,baseSpd:120,tier:TIER.UNCOMMON, evolvesTo:null },
  { id:52, name:'Meowth',     types:['normal'],           baseHp:40,  baseAtk:45, baseSpd:90, tier:TIER.COMMON,   evolvesTo:[53,28] },
  { id:53, name:'Persian',    types:['normal'],           baseHp:65,  baseAtk:70, baseSpd:115,tier:TIER.UNCOMMON, evolvesTo:null },
  { id:54, name:'Psyduck',    types:['water'],            baseHp:50,  baseAtk:52, baseSpd:55, tier:TIER.COMMON,   evolvesTo:[55,33] },
  { id:55, name:'Golduck',    types:['water'],            baseHp:80,  baseAtk:82, baseSpd:85, tier:TIER.UNCOMMON, evolvesTo:null },
  { id:56, name:'Mankey',     types:['fighting'],         baseHp:40,  baseAtk:80, baseSpd:70, tier:TIER.COMMON,   evolvesTo:[57,28] },
  { id:57, name:'Primeape',   types:['fighting'],         baseHp:65,  baseAtk:105,baseSpd:95, tier:TIER.UNCOMMON, evolvesTo:null },
  { id:58, name:'Growlithe',  types:['fire'],             baseHp:55,  baseAtk:70, baseSpd:60, tier:TIER.UNCOMMON, evolvesTo:[59,30] },
  { id:59, name:'Arcanine',   types:['fire'],             baseHp:90,  baseAtk:110,baseSpd:95, tier:TIER.RARE,     evolvesTo:null },
  { id:60, name:'Poliwag',    types:['water'],            baseHp:40,  baseAtk:50, baseSpd:90, tier:TIER.COMMON,   evolvesTo:[61,25] },
  { id:61, name:'Poliwhirl',  types:['water'],            baseHp:65,  baseAtk:65, baseSpd:90, tier:TIER.UNCOMMON, evolvesTo:[62,36] },
  { id:62, name:'Poliwrath',  types:['water','fighting'], baseHp:90,  baseAtk:95, baseSpd:70, tier:TIER.RARE,     evolvesTo:null },
  { id:63, name:'Abra',       types:['psychic'],          baseHp:25,  baseAtk:20, baseSpd:90, tier:TIER.UNCOMMON, evolvesTo:[64,16] },
  { id:64, name:'Kadabra',    types:['psychic'],          baseHp:40,  baseAtk:35, baseSpd:105,tier:TIER.UNCOMMON, evolvesTo:[65,36] },
  { id:65, name:'Alakazam',   types:['psychic'],          baseHp:55,  baseAtk:50, baseSpd:120,tier:TIER.RARE,     evolvesTo:null },
  { id:66, name:'Machop',     types:['fighting'],         baseHp:70,  baseAtk:80, baseSpd:35, tier:TIER.COMMON,   evolvesTo:[67,28] },
  { id:67, name:'Machoke',    types:['fighting'],         baseHp:80,  baseAtk:100,baseSpd:45, tier:TIER.UNCOMMON, evolvesTo:[68,36] },
  { id:68, name:'Machamp',    types:['fighting'],         baseHp:90,  baseAtk:130,baseSpd:55, tier:TIER.RARE,     evolvesTo:null },
  { id:69, name:'Bellsprout', types:['grass','poison'],   baseHp:50,  baseAtk:75, baseSpd:40, tier:TIER.COMMON,   evolvesTo:[70,21] },
  { id:70, name:'Weepinbell', types:['grass','poison'],   baseHp:65,  baseAtk:90, baseSpd:55, tier:TIER.UNCOMMON, evolvesTo:[71,36] },
  { id:71, name:'Victreebel', types:['grass','poison'],   baseHp:80,  baseAtk:105,baseSpd:70, tier:TIER.RARE,     evolvesTo:null },
  { id:72, name:'Tentacool',  types:['water','poison'],   baseHp:40,  baseAtk:40, baseSpd:70, tier:TIER.COMMON,   evolvesTo:[73,30] },
  { id:73, name:'Tentacruel', types:['water','poison'],   baseHp:80,  baseAtk:70, baseSpd:100,tier:TIER.UNCOMMON, evolvesTo:null },
  { id:74, name:'Geodude',    types:['rock','ground'],    baseHp:40,  baseAtk:80, baseSpd:20, tier:TIER.COMMON,   evolvesTo:[75,25] },
  { id:75, name:'Graveler',   types:['rock','ground'],    baseHp:55,  baseAtk:95, baseSpd:35, tier:TIER.UNCOMMON, evolvesTo:[76,36] },
  { id:76, name:'Golem',      types:['rock','ground'],    baseHp:80,  baseAtk:120,baseSpd:45, tier:TIER.RARE,     evolvesTo:null },
  { id:77, name:'Ponyta',     types:['fire'],             baseHp:50,  baseAtk:85, baseSpd:90, tier:TIER.UNCOMMON, evolvesTo:[78,40] },
  { id:78, name:'Rapidash',   types:['fire'],             baseHp:65,  baseAtk:100,baseSpd:105,tier:TIER.RARE,     evolvesTo:null },
  { id:79, name:'Slowpoke',   types:['water','psychic'],  baseHp:90,  baseAtk:65, baseSpd:15, tier:TIER.COMMON,   evolvesTo:[80,37] },
  { id:80, name:'Slowbro',    types:['water','psychic'],  baseHp:95,  baseAtk:75, baseSpd:30, tier:TIER.UNCOMMON, evolvesTo:null },
  { id:81, name:'Magnemite',  types:['electric','steel'], baseHp:25,  baseAtk:35, baseSpd:45, tier:TIER.COMMON,   evolvesTo:[82,30] },
  { id:82, name:'Magneton',   types:['electric','steel'], baseHp:50,  baseAtk:60, baseSpd:70, tier:TIER.UNCOMMON, evolvesTo:null },
  { id:83, name:'Farfetch\'d',types:['normal','flying'],  baseHp:52,  baseAtk:90, baseSpd:60, tier:TIER.RARE,     evolvesTo:null },
  { id:84, name:'Doduo',      types:['normal','flying'],  baseHp:35,  baseAtk:85, baseSpd:75, tier:TIER.COMMON,   evolvesTo:[85,31] },
  { id:85, name:'Dodrio',     types:['normal','flying'],  baseHp:60,  baseAtk:110,baseSpd:110,tier:TIER.UNCOMMON, evolvesTo:null },
  { id:86, name:'Seel',       types:['water'],            baseHp:65,  baseAtk:45, baseSpd:45, tier:TIER.COMMON,   evolvesTo:[87,34] },
  { id:87, name:'Dewgong',    types:['water','ice'],      baseHp:90,  baseAtk:70, baseSpd:70, tier:TIER.UNCOMMON, evolvesTo:null },
  { id:88, name:'Grimer',     types:['poison'],           baseHp:80,  baseAtk:80, baseSpd:25, tier:TIER.COMMON,   evolvesTo:[89,38] },
  { id:89, name:'Muk',        types:['poison'],           baseHp:105, baseAtk:105,baseSpd:50, tier:TIER.UNCOMMON, evolvesTo:null },
  { id:90, name:'Shellder',   types:['water'],            baseHp:30,  baseAtk:65, baseSpd:40, tier:TIER.COMMON,   evolvesTo:[91,30] },
  { id:91, name:'Cloyster',   types:['water','ice'],      baseHp:50,  baseAtk:95, baseSpd:70, tier:TIER.RARE,     evolvesTo:null },
  { id:92, name:'Gastly',     types:['ghost','poison'],   baseHp:30,  baseAtk:35, baseSpd:80, tier:TIER.UNCOMMON, evolvesTo:[93,25] },
  { id:93, name:'Haunter',    types:['ghost','poison'],   baseHp:45,  baseAtk:50, baseSpd:95, tier:TIER.UNCOMMON, evolvesTo:[94,36] },
  { id:94, name:'Gengar',     types:['ghost','poison'],   baseHp:60,  baseAtk:65, baseSpd:110,tier:TIER.RARE,     evolvesTo:null },
  { id:95, name:'Onix',       types:['rock','ground'],    baseHp:35,  baseAtk:45, baseSpd:70, tier:TIER.UNCOMMON, evolvesTo:null },
  { id:96, name:'Drowzee',    types:['psychic'],          baseHp:60,  baseAtk:48, baseSpd:42, tier:TIER.COMMON,   evolvesTo:[97,26] },
  { id:97, name:'Hypno',      types:['psychic'],          baseHp:85,  baseAtk:73, baseSpd:67, tier:TIER.UNCOMMON, evolvesTo:null },
  { id:98, name:'Krabby',     types:['water'],            baseHp:30,  baseAtk:105,baseSpd:50, tier:TIER.COMMON,   evolvesTo:[99,28] },
  { id:99, name:'Kingler',    types:['water'],            baseHp:55,  baseAtk:130,baseSpd:75, tier:TIER.UNCOMMON, evolvesTo:null },
  { id:100,name:'Voltorb',    types:['electric'],         baseHp:40,  baseAtk:30, baseSpd:100,tier:TIER.COMMON,   evolvesTo:[101,30] },
  { id:101,name:'Electrode',  types:['electric'],         baseHp:60,  baseAtk:50, baseSpd:150,tier:TIER.UNCOMMON, evolvesTo:null },
  { id:102,name:'Exeggcute',  types:['grass','psychic'],  baseHp:60,  baseAtk:40, baseSpd:40, tier:TIER.UNCOMMON, evolvesTo:[103,30] },
  { id:103,name:'Exeggutor',  types:['grass','psychic'],  baseHp:95,  baseAtk:95, baseSpd:55, tier:TIER.RARE,     evolvesTo:null },
  { id:104,name:'Cubone',     types:['ground'],           baseHp:50,  baseAtk:50, baseSpd:35, tier:TIER.UNCOMMON, evolvesTo:[105,28] },
  { id:105,name:'Marowak',    types:['ground'],           baseHp:60,  baseAtk:80, baseSpd:45, tier:TIER.UNCOMMON, evolvesTo:null },
  { id:106,name:'Hitmonlee',  types:['fighting'],         baseHp:50,  baseAtk:120,baseSpd:87, tier:TIER.RARE,     evolvesTo:null },
  { id:107,name:'Hitmonchan', types:['fighting'],         baseHp:50,  baseAtk:105,baseSpd:76, tier:TIER.RARE,     evolvesTo:null },
  { id:108,name:'Lickitung',  types:['normal'],           baseHp:90,  baseAtk:55, baseSpd:30, tier:TIER.RARE,     evolvesTo:null },
  { id:109,name:'Koffing',    types:['poison'],           baseHp:40,  baseAtk:65, baseSpd:35, tier:TIER.COMMON,   evolvesTo:[110,35] },
  { id:110,name:'Weezing',    types:['poison'],           baseHp:65,  baseAtk:90, baseSpd:60, tier:TIER.UNCOMMON, evolvesTo:null },
  { id:111,name:'Rhyhorn',    types:['ground','rock'],    baseHp:80,  baseAtk:85, baseSpd:25, tier:TIER.UNCOMMON, evolvesTo:[112,42] },
  { id:112,name:'Rhydon',     types:['ground','rock'],    baseHp:105, baseAtk:130,baseSpd:40, tier:TIER.RARE,     evolvesTo:null },
  { id:113,name:'Chansey',    types:['normal'],           baseHp:250, baseAtk:5,  baseSpd:50, tier:TIER.RARE,     evolvesTo:null },
  { id:114,name:'Tangela',    types:['grass'],            baseHp:65,  baseAtk:55, baseSpd:60, tier:TIER.UNCOMMON, evolvesTo:null },
  { id:115,name:'Kangaskhan', types:['normal'],           baseHp:105, baseAtk:95, baseSpd:90, tier:TIER.RARE,     evolvesTo:null },
  { id:116,name:'Horsea',     types:['water'],            baseHp:30,  baseAtk:40, baseSpd:60, tier:TIER.COMMON,   evolvesTo:[117,32] },
  { id:117,name:'Seadra',     types:['water'],            baseHp:55,  baseAtk:65, baseSpd:85, tier:TIER.UNCOMMON, evolvesTo:null },
  { id:118,name:'Goldeen',    types:['water'],            baseHp:45,  baseAtk:67, baseSpd:63, tier:TIER.COMMON,   evolvesTo:[119,33] },
  { id:119,name:'Seaking',    types:['water'],            baseHp:80,  baseAtk:92, baseSpd:68, tier:TIER.UNCOMMON, evolvesTo:null },
  { id:120,name:'Staryu',     types:['water'],            baseHp:30,  baseAtk:45, baseSpd:85, tier:TIER.COMMON,   evolvesTo:[121,30] },
  { id:121,name:'Starmie',    types:['water','psychic'],  baseHp:60,  baseAtk:75, baseSpd:115,tier:TIER.RARE,     evolvesTo:null },
  { id:122,name:'Mr. Mime',   types:['psychic','fairy'],  baseHp:40,  baseAtk:45, baseSpd:90, tier:TIER.RARE,     evolvesTo:null },
  { id:123,name:'Scyther',    types:['bug','flying'],     baseHp:70,  baseAtk:110,baseSpd:105,tier:TIER.RARE,     evolvesTo:null },
  { id:124,name:'Jynx',       types:['ice','psychic'],    baseHp:65,  baseAtk:50, baseSpd:95, tier:TIER.RARE,     evolvesTo:null },
  { id:125,name:'Electabuzz', types:['electric'],         baseHp:65,  baseAtk:83, baseSpd:105,tier:TIER.RARE,     evolvesTo:null },
  { id:126,name:'Magmar',     types:['fire'],             baseHp:65,  baseAtk:95, baseSpd:93, tier:TIER.RARE,     evolvesTo:null },
  { id:127,name:'Pinsir',     types:['bug'],              baseHp:65,  baseAtk:125,baseSpd:85, tier:TIER.RARE,     evolvesTo:null },
  { id:128,name:'Tauros',     types:['normal'],           baseHp:75,  baseAtk:100,baseSpd:110,tier:TIER.RARE,     evolvesTo:null },
  { id:129,name:'Magikarp',   types:['water'],            baseHp:20,  baseAtk:10, baseSpd:80, tier:TIER.COMMON,   evolvesTo:[130,20] },
  { id:130,name:'Gyarados',   types:['water','flying'],   baseHp:95,  baseAtk:125,baseSpd:81, tier:TIER.RARE,     evolvesTo:null },
  { id:131,name:'Lapras',     types:['water','ice'],      baseHp:130, baseAtk:85, baseSpd:60, tier:TIER.RARE,     evolvesTo:null },
  { id:132,name:'Ditto',      types:['normal'],           baseHp:48,  baseAtk:48, baseSpd:48, tier:TIER.RARE,     evolvesTo:null },
  { id:133,name:'Eevee',      types:['normal'],           baseHp:55,  baseAtk:55, baseSpd:55, tier:TIER.UNCOMMON, evolvesTo:[136,25] },
  { id:134,name:'Vaporeon',   types:['water'],            baseHp:130, baseAtk:65, baseSpd:65, tier:TIER.RARE,     evolvesTo:null },
  { id:135,name:'Jolteon',    types:['electric'],         baseHp:65,  baseAtk:65, baseSpd:130,tier:TIER.RARE,     evolvesTo:null },
  { id:136,name:'Flareon',    types:['fire'],             baseHp:65,  baseAtk:130,baseSpd:65, tier:TIER.RARE,     evolvesTo:null },
  { id:137,name:'Porygon',    types:['normal'],           baseHp:65,  baseAtk:60, baseSpd:40, tier:TIER.RARE,     evolvesTo:null },
  { id:138,name:'Omanyte',    types:['rock','water'],     baseHp:35,  baseAtk:40, baseSpd:35, tier:TIER.UNCOMMON, evolvesTo:[139,40] },
  { id:139,name:'Omastar',    types:['rock','water'],     baseHp:70,  baseAtk:60, baseSpd:55, tier:TIER.RARE,     evolvesTo:null },
  { id:140,name:'Kabuto',     types:['rock','water'],     baseHp:30,  baseAtk:80, baseSpd:55, tier:TIER.UNCOMMON, evolvesTo:[141,40] },
  { id:141,name:'Kabutops',   types:['rock','water'],     baseHp:60,  baseAtk:115,baseSpd:80, tier:TIER.RARE,     evolvesTo:null },
  { id:142,name:'Aerodactyl', types:['rock','flying'],    baseHp:80,  baseAtk:105,baseSpd:130,tier:TIER.RARE,     evolvesTo:null },
  { id:143,name:'Snorlax',    types:['normal'],           baseHp:160, baseAtk:110,baseSpd:30, tier:TIER.RARE,     evolvesTo:null },
  { id:144,name:'Articuno',   types:['ice','flying'],     baseHp:90,  baseAtk:85, baseSpd:85, tier:TIER.LEGENDARY,evolvesTo:null },
  { id:145,name:'Zapdos',     types:['electric','flying'],baseHp:90,  baseAtk:90, baseSpd:100,tier:TIER.LEGENDARY,evolvesTo:null },
  { id:146,name:'Moltres',    types:['fire','flying'],    baseHp:90,  baseAtk:100,baseSpd:90, tier:TIER.LEGENDARY,evolvesTo:null },
  { id:147,name:'Dratini',    types:['dragon'],           baseHp:41,  baseAtk:64, baseSpd:50, tier:TIER.RARE,     evolvesTo:[148,30] },
  { id:148,name:'Dragonair',  types:['dragon'],           baseHp:61,  baseAtk:84, baseSpd:70, tier:TIER.RARE,     evolvesTo:[149,55] },
  { id:149,name:'Dragonite',  types:['dragon','flying'],  baseHp:91,  baseAtk:134,baseSpd:80, tier:TIER.RARE,     evolvesTo:null },
  { id:150,name:'Mewtwo',     types:['psychic'],          baseHp:106, baseAtk:110,baseSpd:130,tier:TIER.LEGENDARY,evolvesTo:null },
  { id:151,name:'Mew',        types:['psychic'],          baseHp:100, baseAtk:100,baseSpd:100,tier:TIER.LEGENDARY,evolvesTo:null },
];

/** Lookup Pokémon by ID */
export const getPokemonById = (id) => POKEDEX.find(p => p.id === id);

/** XP needed for a given level */
export const xpForLevel = (level) => level * level * 2; // Roughly cubic scale simplified

/** Calculate HP for a Pokémon at a given level */
export const calcHp = (baseHp, level) => Math.floor((baseHp * 2 * level) / 100) + level + 10;

// --- Type Effectiveness Chart ---
export const TYPE_CHART = {
  normal: { rock: 0.5, ghost: 0, steel: 0.5 },
  fire: { fire: 0.5, water: 0.5, grass: 2, ice: 2, bug: 2, rock: 0.5, dragon: 0.5, steel: 2 },
  water: { fire: 2, water: 0.5, grass: 0.5, ground: 2, rock: 2, dragon: 0.5 },
  electric: { water: 2, electric: 0.5, grass: 0.5, ground: 0, flying: 2, dragon: 0.5 },
  grass: { fire: 0.5, water: 2, grass: 0.5, poison: 0.5, ground: 2, flying: 0.5, bug: 0.5, rock: 2, dragon: 0.5, steel: 0.5 },
  ice: { fire: 0.5, water: 0.5, grass: 2, ice: 0.5, ground: 2, flying: 2, dragon: 2, steel: 0.5 },
  fighting: { normal: 2, ice: 2, poison: 0.5, flying: 0.5, psychic: 0.5, bug: 0.5, rock: 2, ghost: 0, dark: 2, steel: 2, fairy: 0.5 },
  poison: { grass: 2, poison: 0.5, ground: 0.5, rock: 0.5, ghost: 0.5, steel: 0, fairy: 2 },
  ground: { fire: 2, electric: 2, grass: 0.5, poison: 2, flying: 0, bug: 0.5, rock: 2, steel: 2 },
  flying: { electric: 0.5, grass: 2, fighting: 2, bug: 2, rock: 0.5, steel: 0.5 },
  psychic: { fighting: 2, poison: 2, psychic: 0.5, dark: 0, steel: 0.5 },
  bug: { fire: 0.5, grass: 2, fighting: 0.5, poison: 0.5, flying: 0.5, psychic: 2, ghost: 0.5, dark: 2, steel: 0.5, fairy: 0.5 },
  rock: { fire: 2, ice: 2, fighting: 0.5, ground: 0.5, flying: 2, bug: 2, steel: 0.5 },
  ghost: { normal: 0, psychic: 2, ghost: 2, dark: 0.5 },
  dragon: { dragon: 2, steel: 0.5, fairy: 0 },
  dark: { fighting: 0.5, psychic: 2, ghost: 2, dark: 0.5, fairy: 0.5 },
  steel: { fire: 0.5, water: 0.5, electric: 0.5, ice: 2, rock: 2, steel: 0.5, fairy: 2 },
  fairy: { fire: 0.5, fighting: 2, poison: 0.5, dragon: 2, dark: 2, steel: 0.5 }
};

export const getTypeMultiplier = (moveType, defenderTypes) => {
  let multiplier = 1;
  const attackMap = TYPE_CHART[moveType] || {};
  defenderTypes.forEach(defType => {
    if (attackMap[defType] !== undefined) {
      multiplier *= attackMap[defType];
    }
  });
  return multiplier;
};

/** Calculate Damage */
export const calcDamage = (attackerLevel, attackerAtk, defenderDef, movePower, moveType, attackerTypes, defenderTypes) => {
  // Same Type Attack Bonus (STAB)
  const stab = attackerTypes.includes(moveType) ? 1.5 : 1;
  // Type Effectiveness
  const effectiveness = getTypeMultiplier(moveType, defenderTypes);
  
  // Basic random variance 0.85 to 1.0
  const random = (Math.floor(Math.random() * 16) + 85) / 100;
  
  // Simplified Gen 1 damage formula
  let damage = Math.floor(Math.floor((Math.floor((2 * attackerLevel) / 5 + 2) * movePower * attackerAtk) / defenderDef) / 50) + 2;
  damage = Math.floor(damage * stab * effectiveness * random);
  
  // If effectiveness is 0, it deals 0 damage, otherwise minimum 1 damage
  if (effectiveness === 0) {
    damage = 0;
  } else {
    damage = Math.max(1, damage);
  }
  
  return { damage, multiplier: effectiveness };
};

/** Calculate XP yield when defeated */
export const calcXPYield = (baseHp, baseAtk, level) => {
  // Simple estimation based on stats
  const baseYield = baseHp + baseAtk;
  return Math.floor((baseYield * level) / 7);
};

/** Starters available for selection */
export const STARTERS = [25, 1, 4, 7]; // Pikachu, Bulbasaur, Charmander, Squirtle
