/**
 * GameState — Manages all Pokémon game state with localStorage persistence.
 * Singleton pattern, importable from any component.
 */
import { getPokemonById, xpForLevel, calcHp } from "./pokemon151";
import { getRandomMoves } from "./moves";
import EventBus from "../game/EventBus";

const STORAGE_KEY = "pokemon_portfolio_save";
// Removing passive XP completely to make battles matter

class GameState {
  constructor() {
    this.party = []; // Max 6 Pokémon
    this.pc = []; // Unlimited PC storage
    this.pokedex = new Set(); // Set of caught Pokémon IDs
    this.stepsWalked = 0;
    this.hasSelectedStarter = false;
    this.playerName = "ANKIT";
    this.gender = "male"; // 'male' or 'female'
    this._listeners = new Set();
    this.load();
    // Always ensure at least one Pokémon so battles work immediately
    this._ensureDefaultPokemon();
  }

  /** Guarantee a usable party — adds Pikachu if none saved */
  _ensureDefaultPokemon() {
    if (this.party.length === 0) {
      const pikachu = this.createPokemon(25, 5); // Pikachu lv5
      if (pikachu) {
        pikachu.isShiny = false;
        this.party.push(pikachu);
        this.pokedex.add(25);
        // Do NOT set this.hasSelectedStarter = true here; let the cinematic intro finish first!
        this.save();
      }
    }
  }

  /** Subscribe to state changes */
  onChange(fn) {
    this._listeners.add(fn);
    return () => this._listeners.delete(fn);
  }

  _notify() {
    this._listeners.forEach((fn) => fn(this));
  }

  /** Create a new Pokémon instance */
  createPokemon(pokedexId, level = 5) {
    const data = getPokemonById(pokedexId);
    if (!data) return null;

    const isShiny = Math.random() < 1 / 50; // 2% shiny chance
    const hp = calcHp(data.baseHp, level);
    const moves = getRandomMoves(data.types, level);

    return {
      uid: Date.now() + Math.random().toString(36).slice(2, 6),
      id: pokedexId,
      name: data.name,
      level,
      xp: 0,
      xpToNext: xpForLevel(level + 1),
      hp,
      maxHp: hp,
      isShiny,
      metAt: this.stepsWalked,
      moves,
    };
  }

  /** Select starter Pokémon */
  selectStarter(pokedexId) {
    if (this.hasSelectedStarter) return;
    const starter = this.createPokemon(pokedexId, 5);
    if (!starter) return;
    this.party = [starter];
    this.pokedex.add(pokedexId);
    this.hasSelectedStarter = true;
    this.save();
    this._notify();
    return starter;
  }

  /** Mark the opening cinematic complete without assigning a starter. */
  completeIntro() {
    this.hasSelectedStarter = true;
    this.save();
    this._notify();
  }

  /** Add Pokémon to party (max 6) or PC — returns true if added */
  addPokemon(pokemon) {
    if (this.party.length >= 6) {
      this.pc.push(pokemon);
    } else {
      this.party.push(pokemon);
    }
    this.pokedex.add(pokemon.id);
    this.save();
    this._notify();
    return true;
  }

  /** Remove Pokémon from game (release) */
  releasePokemon(uid) {
    // Check party
    const partyIdx = this.party.findIndex(p => p.uid === uid);
    if (partyIdx !== -1) {
      if (this.party.length <= 1 && this.pc.length === 0) return false; // Can't release last pokemon
      this.party.splice(partyIdx, 1);
    } else {
      // Check PC
      const pcIdx = this.pc.findIndex(p => p.uid === uid);
      if (pcIdx !== -1) {
        this.pc.splice(pcIdx, 1);
      } else {
        return false;
      }
    }
    this.save();
    this._notify();
    return true;
  }

  /** Swap a Pokemon in Party with one in PC, or add from PC to Party */
  swapPartyAndPC(partyIdx, pcIdx) {
    if (partyIdx < 0 || partyIdx >= this.party.length) return;
    
    // If we are just moving from PC to Party (and party has space)
    if (pcIdx >= 0 && pcIdx < this.pc.length && this.party.length < 6 && partyIdx === this.party.length) {
      const p = this.pc.splice(pcIdx, 1)[0];
      this.party.push(p);
    } 
    // If we are swapping Party and PC
    else if (pcIdx >= 0 && pcIdx < this.pc.length) {
      const temp = this.party[partyIdx];
      this.party[partyIdx] = this.pc[pcIdx];
      this.pc[pcIdx] = temp;
    }
    // If we are moving from Party to PC
    else if (pcIdx === -1) {
      if (this.party.length <= 1) return; // Cannot deposit last pokemon
      const p = this.party.splice(partyIdx, 1)[0];
      this.pc.push(p);
    }
    
    this.save();
    this._notify();
  }

  /** Remove Pokémon from party by uid */
  removePokemon(uid) {
    if (this.party.length <= 1) return false; // Can't remove last Pokémon
    this.party = this.party.filter((p) => p.uid !== uid);
    this.save();
    this._notify();
    return true;
  }

  /** Swap party positions */
  swapParty(indexA, indexB) {
    if (
      indexA < 0 ||
      indexB < 0 ||
      indexA >= this.party.length ||
      indexB >= this.party.length
    )
      return;
    [this.party[indexA], this.party[indexB]] = [
      this.party[indexB],
      this.party[indexA],
    ];
    this.save();
    this._notify();
  }

  /** Process a step — check level ups/evolutions from previous XP gains. Returns events array */
  processStep() {
    this.stepsWalked++;
    const events = [];

    this.party.forEach((pokemon, index) => {
      // Base XP gain from walking
      pokemon.xp += 2;
      const levelEvents = this.checkLevelUp(pokemon, index);
      events.push(...levelEvents);

      // (Automatic evolution removed since we want manual evolution from the menu)
    });

    // Auto-save every 50 steps
    if (this.stepsWalked % 50 === 0) {
      this.save();
    }

    if (events.length > 0) {
      this.save();
      this._notify();
    }

    return events;
  }

  /** Heal all party Pokémon to full HP */
  healAll() {
    this.party.forEach((p) => {
      p.hp = p.maxHp;
    });
    this.save();
    this._notify();
  }

  /** Add XP to lead pokemon from battle */
  addCombatXP(amount) {
    if (this.party.length > 0) {
      const lead = this.party[0];
      lead.xp += amount;
      
      const events = this.checkLevelUp(lead, 0);
      if (events.length > 0) {
        EventBus.emit("gameEvents", events);
      }
      
      this.save();
      this._notify();
    }
  }

  /** Checks if a pokemon should level up based on current XP */
  checkLevelUp(pokemon, index) {
    const events = [];
    while (pokemon.xp >= pokemon.xpToNext) {
      pokemon.xp -= pokemon.xpToNext;
      pokemon.level++;
      const newHp = calcHp(getPokemonById(pokemon.id).baseHp, pokemon.level);
      pokemon.maxHp = newHp;
      pokemon.hp = newHp; // Full heal on level up
      pokemon.xpToNext = xpForLevel(pokemon.level + 1);

      events.push({ type: "levelUp", pokemon, index });
    }
    return events;
  }

  /** Evolve a pokemon manually */
  evolvePokemon(uid, targetSpeciesId) {
    const p = this.party.find(p => p.uid === uid) || this.pc.find(p => p.uid === uid);
    if (!p) return false;

    const evolvedData = getPokemonById(targetSpeciesId);
    if (!evolvedData) return false;

    const oldName = p.name;
    p.id = evolvedData.id;
    p.name = evolvedData.name;
    p.maxHp = calcHp(evolvedData.baseHp, p.level);
    
    // Scale HP proportionally
    p.hp = p.maxHp; 
    
    this.pokedex.add(evolvedData.id);
    this.save();
    this._notify();
    
    return {
      pokemon: p,
      fromName: oldName,
      toName: evolvedData.name
    };
  }

  getLeadPokemon() {
    return this.party.length > 0 ? this.party[0] : null;
  }

  /** Save to localStorage */
  save() {
    const data = {
      party: this.party,
      pc: this.pc,
      pokedex: [...this.pokedex],
      stepsWalked: this.stepsWalked,
      hasSelectedStarter: this.hasSelectedStarter,
      playerName: this.playerName,
      gender: this.gender,
    };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.warn("Failed to save game state:", e);
    }
  }

  /** Load from localStorage */
  load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const data = JSON.parse(raw);
      this.party = data.party || [];
      this.pc = data.pc || [];
      this.pokedex = new Set(data.pokedex || []);
      this.stepsWalked = data.stepsWalked || 0;
      this.hasSelectedStarter = data.hasSelectedStarter || false;
      this.playerName = data.playerName || "ANKIT";
      this.gender = data.gender || "male";

      // Migrate legacy save data to ensure all party members have moves
      this.party.forEach((pokemon) => {
        if (!pokemon.moves || pokemon.moves.length === 0) {
          const pkmnData = getPokemonById(pokemon.id);
          if (pkmnData) {
            pokemon.moves = getRandomMoves(pkmnData.types, pokemon.level);
          }
        }
      });
      this.pc.forEach((pokemon) => {
        if (!pokemon.moves || pokemon.moves.length === 0) {
          const pkmnData = getPokemonById(pokemon.id);
          if (pkmnData) {
            pokemon.moves = getRandomMoves(pkmnData.types, pokemon.level);
          }
        }
      });
    } catch (e) {
      console.warn("Failed to load game state:", e);
    }
  }

  /** Reset all game data */
  reset() {
    this.party = [];
    this.pc = [];
    this.pokedex = new Set();
    this.stepsWalked = 0;
    this.hasSelectedStarter = false;
    localStorage.removeItem(STORAGE_KEY);
    this._notify();
  }
}

// Singleton
const gameState = new GameState();
export default gameState;
