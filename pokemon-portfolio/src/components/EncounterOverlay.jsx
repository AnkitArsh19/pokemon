import { useState, useEffect, useRef, useCallback } from "react";
import {
  getSpriteUrl,
  getShinyUrl,
  getBackSpriteUrl,
  getShinyBackSpriteUrl,
  getPokemonById,
  POKEDEX,
  TIER,
  calcDamage,
  calcXPYield
} from "../data/pokemon151";
import gameState from "../data/gameState";
import audioManager from "../data/audioManager";
import EventBus from "../game/EventBus";
import PokemonSelectionView from "./PokemonSelectionView";

// ── Wild Pokémon roll ──────────────────────────────────────────────────────
const COMMON_IDS = POKEDEX.filter((p) => p.tier === TIER.COMMON).map((p) => p.id);
const UNCOMMON_IDS = POKEDEX.filter((p) => p.tier === TIER.UNCOMMON).map((p) => p.id);
const RARE_IDS = POKEDEX.filter((p) => p.tier === TIER.RARE).map((p) => p.id);
const LEGENDARY_IDS = POKEDEX.filter((p) => p.tier === TIER.LEGENDARY).map((p) => p.id);

function rollWildPokemon(leadLevel = 5) {
  const roll = Math.random();
  let pool =
    roll < 0.5
      ? COMMON_IDS
      : roll < 0.8
        ? UNCOMMON_IDS
        : roll < 0.95
          ? RARE_IDS
          : LEGENDARY_IDS;

  const id = pool[Math.floor(Math.random() * pool.length)];
  const isLegendary = LEGENDARY_IDS.includes(id);
  const shinyThreshold = 0.1; // 10% shiny rate
  const isShiny = Math.random() < shinyThreshold;

  // Level curve: Skewed distribution favoring lower levels (averages around 25)
  // There is a ~50% chance the level is between 1-20, but still a rare chance to hit 100
  let level = Math.floor(Math.min(Math.random(), Math.random(), Math.random()) * 100) + 1;
  
  if (isLegendary || isShiny) {
    // Skew significantly towards higher levels (roll 3 times, take highest)
    const roll1 = Math.floor(Math.random() * 100) + 1;
    const roll2 = Math.floor(Math.random() * 100) + 1;
    const roll3 = Math.floor(Math.random() * 100) + 1;
    level = Math.max(roll1, roll2, roll3);
  }

  return { id, level, isShiny };
}

// ── Trainer throw spritesheet config ─────────────────────────────────────
const THROW_SHEET = {
  src: "./assets/battle/ball_throwing_spritesheet.png",
  totalW: 1216,
  totalH: 236,
  frameCount: 5,
  displayH: 132,
};
THROW_SHEET.scale = THROW_SHEET.displayH / THROW_SHEET.totalH;
THROW_SHEET.frameW = THROW_SHEET.totalW / THROW_SHEET.frameCount;
THROW_SHEET.displayW = THROW_SHEET.frameW * THROW_SHEET.scale;
THROW_SHEET.bgW = THROW_SHEET.totalW * THROW_SHEET.scale;

// ── Phase constants ───────────────────────────────────────────────────────
const P = {
  IDLE: "idle",
  FLASH: "flash",
  SCENE: "scene",
  TRAINER: "trainer",
  BALL: "ball",
  EMERGE: "emerge",
  UI: "ui",
  MENU: "menu",
  FIGHT_MENU: "fight_menu",
  ACTION: "action",
  CATCHING: "catching",
  FIGHT: "fight",
  RUN: "run",
};

const UI_PHASES = new Set([P.UI, P.MENU, P.FIGHT_MENU, P.ACTION, P.CATCHING, P.FIGHT, P.RUN]);
const SHOW_ENEMY = new Set([
  P.SCENE, P.TRAINER, P.BALL, P.EMERGE, P.UI, P.MENU, P.FIGHT_MENU, P.ACTION, P.CATCHING, P.FIGHT, P.RUN,
]);
const SHOW_PLYR = new Set([P.EMERGE, P.UI, P.MENU, P.FIGHT_MENU, P.ACTION, P.FIGHT, P.RUN]); // Not during catching usually, but kept for simplicity

const hpColor = (pct) => (pct > 50 ? "#58c870" : pct > 20 ? "#f0c030" : "#e83820");

// ─────────────────────────────────────────────────────────────────────────
export default function EncounterOverlay() {
  const [visible, setVisible] = useState(false);
  
  // State for wild pokemon
  const [wild, setWild] = useState(null);
  
  // State for player pokemon in battle
  const [playerHp, setPlayerHp] = useState(0);
  
  const [phase, setPhase] = useState(P.IDLE);
  const [trainerFrame, setTrainerFrame] = useState(0);
  const [message, setMessage] = useState("");
  const [selectedAct, setSelectedAct] = useState(0); // For main menu and fight menu
  
  // Animation states
  const [enemyFlash, setEnemyFlash] = useState(false);
  const [playerFlash, setPlayerFlash] = useState(false);
  const [pokeballShake, setPokeballShake] = useState(0);
  const [showSelectionMenu, setShowSelectionMenu] = useState(false);
  const [isForcedSwap, setIsForcedSwap] = useState(false);
  const [failedCatches, setFailedCatches] = useState(0);

  const timersRef = useRef([]);

  const later = useCallback((fn, ms) => {
    const id = setTimeout(fn, ms);
    timersRef.current.push(id);
    return id;
  }, []);

  const clearAll = useCallback(() => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
  }, []);

  const endBattle = useCallback((isVictory = false) => {
    clearAll();
    setVisible(false);
    setWild(null);
    setPhase(P.IDLE);
    setTrainerFrame(0);
    setSelectedAct(0);
    setEnemyFlash(false);
    setPlayerFlash(false);
    setPokeballShake(0);
    setFailedCatches(0);
    
    if (isVictory === true) {
      audioManager.playAfterDelay('pallet_town', 15000, true);
    } else {
      audioManager.play('pallet_town', true);
    }
    
    EventBus.emit("unblockInput");
    EventBus.emit("encounterEnd");
  }, [clearAll]);

  // ── Listen for wild encounters ─────────────────────────────────────────
  useEffect(() => {
    const unsub = EventBus.on("wildEncounter", (data) => {
      const leadForLevel = gameState.getLeadPokemon();
      const pkmnInfo = data || rollWildPokemon(leadForLevel ? leadForLevel.level : 5);
      const wildPkmn = gameState.createPokemon(pkmnInfo.id, pkmnInfo.level);
      wildPkmn.isShiny = pkmnInfo.isShiny;
      setWild(wildPkmn);
      // Ensure the lead pokemon is actually alive
      if (gameState.party.length > 0 && gameState.party[0].hp <= 0) {
        const firstAliveIdx = gameState.party.findIndex(p => p.hp > 0);
        if (firstAliveIdx > 0) {
          const temp = gameState.party[0];
          gameState.party[0] = gameState.party[firstAliveIdx];
          gameState.party[firstAliveIdx] = temp;
          gameState.save();
        }
      }

      const lead = gameState.getLeadPokemon();
      if (lead) setPlayerHp(lead.hp);
      
      setTrainerFrame(0);
      setSelectedAct(0);
      setMessage(`A wild ${wildPkmn.name} appeared!`);
      setPhase(P.FLASH);
      setVisible(true);
      audioManager.play('battle_wild', true);
      EventBus.emit("blockInput");
    });
    return () => unsub();
  }, []);

  // ── Phase sequencer ────────────────────────────────────────────────────
  useEffect(() => {
    if (!visible) return;

    if (phase === P.FLASH) {
      later(() => setPhase(P.SCENE), 1600);
    } else if (phase === P.SCENE) {
      later(() => setPhase(P.TRAINER), 1200);
    } else if (phase === P.TRAINER) {
      later(() => setTrainerFrame(0), 0);
      later(() => setTrainerFrame(1), 180);
      later(() => setTrainerFrame(2), 360);
      later(() => setTrainerFrame(3), 540);
      later(() => setTrainerFrame(4), 720);
      later(() => setPhase(P.BALL), 950);
    } else if (phase === P.BALL) {
      later(() => setPhase(P.EMERGE), 1000);
    } else if (phase === P.EMERGE) {
      later(() => setPhase(P.UI), 900);
    } else if (phase === P.UI) {
      later(() => setPhase(P.MENU), 700);
    }
  }, [visible, phase, later]);

  // ── Keyboard navigation ───────────────────────────────────────────────
  useEffect(() => {
    if (phase !== P.MENU && phase !== P.FIGHT_MENU) return;
    if (showSelectionMenu) return; // Disable keyboard nav here if menu is open

    const onKey = (e) => {
      const isFightMenu = phase === P.FIGHT_MENU;
      const numOptions = isFightMenu ? (gameState.getLeadPokemon()?.moves?.length || 1) : 4;

      if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
        setSelectedAct((a) => (a === 0 ? numOptions - 1 : a - 1));
      } else if (e.key === "ArrowDown" || e.key === "ArrowRight") {
        setSelectedAct((a) => (a + 1) % numOptions);
      } else if (e.key === "Enter" || e.key === " " || e.key === "z" || e.key === "Z") {
        e.preventDefault();
        if (isFightMenu) {
          executeMove(selectedAct);
        } else {
          doMainMenuAction(selectedAct);
        }
      } else if (e.key === "Escape" || e.key === "x" || e.key === "X") {
        if (isFightMenu) {
          setPhase(P.MENU);
          setSelectedAct(0);
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [phase, selectedAct]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Main Actions ───────────────────────────────────────────────────────
  const doMainMenuAction = (actionIdx) => {
    if (actionIdx === 0) {
      setPhase(P.FIGHT_MENU);
      setSelectedAct(0);
    } else if (actionIdx === 1) {
      // BAG -> Throw Pokeball
      throwPokeball();
    } else if (actionIdx === 2) {
      // POKEMON -> Switch lead
      setShowSelectionMenu(true);
    } else if (actionIdx === 3) {
      startRun();
    }
  };

  const handleSelectionClose = () => {
    if (isForcedSwap) return; // Prevent closing if they MUST swap
    setShowSelectionMenu(false);
  };

  const handlePokemonSwap = (uid) => {
    // Find index of selected Pokemon
    const partyIdx = gameState.party.findIndex(p => p.uid === uid);
    if (partyIdx < 0) return;
    
    // Prevent selecting a fainted pokemon
    if (gameState.party[partyIdx].hp <= 0) {
      alert("That Pokémon has no energy left to battle!");
      return; 
    }

    if (partyIdx === 0) {
      // Trying to swap lead with lead
      if (isForcedSwap) {
        // Can't close if forced swap and lead is fainted
        if (gameState.party[0].hp <= 0) return;
      }
      setShowSelectionMenu(false);
      return;
    }

    setShowSelectionMenu(false);

    // Swap lead (index 0) with selected index
    const temp = gameState.party[0];
    gameState.party[0] = gameState.party[partyIdx];
    gameState.party[partyIdx] = temp;
    gameState.save();
    gameState._notify();

    setPlayerHp(gameState.party[0].hp); // Fix: use new lead's HP
    setPhase(P.ACTION);
    setMessage(`Go! ${gameState.party[0].name}!`);

    if (isForcedSwap) {
      setIsForcedSwap(false);
      later(() => {
        setPhase(P.MENU);
        setSelectedAct(0);
      }, 1500);
    } else {
      later(() => {
        opponentTurn();
      }, 1500);
    }
  };

  const executeMove = (moveIdx) => {
    const lead = gameState.getLeadPokemon();
    const move = lead.moves[moveIdx];
    if (!move) return;

    setPhase(P.ACTION);
    setMessage(`${lead.name} used ${move.name}!`);
    audioManager.playSFX(move.name, true);
    
    later(() => {
      // Calculate damage
      const wildData = getPokemonById(wild.id);
      const leadData = getPokemonById(lead.id);
      const { damage: dmg, multiplier } = calcDamage(lead.level, leadData.baseAtk, wildData.baseAtk, move.power, move.type, leadData.types, wildData.types);
      
      const newEnemyHp = Math.max(0, wild.hp - dmg);
      
      // Play hit sound effect
      if (multiplier === 0) {
        // No effect
      } else if (multiplier > 1) {
        audioManager.playSFX('Hit Super Effective', true);
      } else if (multiplier < 1) {
        audioManager.playSFX('Hit Weak Not Very Effective', true);
      } else {
        audioManager.playSFX('Hit Normal Damage', true);
      }
      
      setEnemyFlash(true);
      later(() => setEnemyFlash(false), 200);
      
      setWild((prev) => ({ ...prev, hp: newEnemyHp }));
      
      later(() => {
        let delay = 0;
        const pctDealt = dmg / wild.maxHp;
        if (multiplier === 0) { setMessage("It had no effect!"); delay = 1500; }
        else if (pctDealt >= 0.4) { setMessage("It's super effective!"); delay = 1500; }
        else if (pctDealt <= 0.1) { setMessage("It's not very effective..."); delay = 1500; }
        
        later(() => {
          if (newEnemyHp <= 0) {
            winBattle();
          } else {
            opponentTurn();
          }
        }, delay);
      }, 1000);
    }, 1000);
  };

  const opponentTurn = () => {
    if (!wild || wild.hp <= 0) return;
    const move = wild.moves[Math.floor(Math.random() * wild.moves.length)];
    if (!move) return;

    setPhase(P.ACTION);
    setMessage(`Wild ${wild.name} used ${move.name}!`);
    audioManager.playSFX(move.name, true);
    
    later(() => {
      const wildData = getPokemonById(wild.id);
      const lead = gameState.getLeadPokemon();
      const leadData = getPokemonById(lead.id);
      
      const { damage: dmg, multiplier } = calcDamage(wild.level, wildData.baseAtk, leadData.baseAtk, move.power, move.type, wildData.types, leadData.types);
      
      const newPlayerHp = Math.max(0, playerHp - dmg);
      
      // Play hit sound effect
      if (multiplier === 0) {
        // No effect
      } else if (multiplier > 1) {
        audioManager.playSFX('Hit Super Effective', true);
      } else if (multiplier < 1) {
        audioManager.playSFX('Hit Weak Not Very Effective', true);
      } else {
        audioManager.playSFX('Hit Normal Damage', true);
      }
      
      setPlayerFlash(true);
      later(() => setPlayerFlash(false), 200);
      
      setPlayerHp(newPlayerHp);
      lead.hp = newPlayerHp;
      gameState.save();
      
      later(() => {
        let delay = 0;
        const pctDealt = dmg / lead.maxHp;
        if (multiplier === 0) { setMessage("It had no effect!"); delay = 1500; }
        else if (pctDealt >= 0.4) { setMessage("It's super effective!"); delay = 1500; }
        else if (pctDealt <= 0.1) { setMessage("It's not very effective..."); delay = 1500; }
        
        later(() => {
          if (newPlayerHp <= 0) {
            loseBattle();
          } else {
            setPhase(P.MENU);
            setSelectedAct(0);
          }
        }, delay);
      }, 1000);
    }, 1000);
  };

  const throwPokeball = () => {
    setPhase(P.CATCHING);
    setMessage(`You threw a Pokéball!`);
    audioManager.playSFX('In-Battle Recall Switch Pokeball', true);
    
    // Simple catch formula based on HP (Full HP = ~10% chance, low HP = ~80% chance)
    const catchRate = 0.10 + 0.70 * (1 - (wild.hp / wild.maxHp));
    const randomRoll = Math.random();
    const caught = randomRoll < catchRate;
    
    // Animation phases
    later(() => setPokeballShake(1), 1000);
    later(() => setPokeballShake(2), 1500);
    later(() => setPokeballShake(3), 2000);
    
    later(() => {
      if (caught) {
        setPokeballShake(4); // Caught!
        setMessage(`Gotcha! ${wild.name} was caught!`);
        gameState.pokedex.add(wild.id);
        
        later(() => {
          if (gameState.party.length >= 6) {
            setMessage(`Party full!\n${wild.name} sent to PC.`);
          }
          gameState.addPokemon(wild);
          gameState.save();
          gameState._notify();
          later(endBattle, 2000);
        }, 1500);
      } else {
        setPokeballShake(0); // Broke out
        const hpPct = wild.hp / wild.maxHp;
        
        if (hpPct > 0.5) {
          // If HP is high, there's a chance to flee that increases with each failed catch
          const fleeChance = 0.35 + (failedCatches * 0.15); // Starts at 35%
          if (Math.random() < fleeChance) {
            setMessage(`Oh no! The wild ${wild.name} fled!`);
            later(endBattle, 2000);
          } else {
            setFailedCatches(c => c + 1);
            setMessage(`Oh no! The Pokémon broke free!`);
            later(opponentTurn, 1500);
          }
        } else {
          setFailedCatches(c => c + 1);
          setMessage(`Oh no! The Pokémon broke free!`);
          later(opponentTurn, 1500);
        }
      }
    }, 2500);
  };

  const winBattle = () => {
    audioManager.playSFX('In-Battle Faint No Health', true);
    setMessage(`Wild ${wild.name} fainted!`);
    audioManager.play('victory_wild', true);
    
    // Automatically catch the Pokémon upon defeating it
    gameState.addPokemon(wild);
    
    later(() => {
      try {
        const wildData = getPokemonById(wild.id);
        const xp = calcXPYield(wildData.baseHp, wildData.baseAtk, wild.level);
        
        const lead = gameState.getLeadPokemon();
        if (lead) {
          setMessage(`${lead.name} gained ${xp} XP!`);
          gameState.addCombatXP(xp);
        }
      } catch (err) {
        console.error("Error calculating XP in winBattle:", err);
      } finally {
        later(() => endBattle(true), 2000); // Wait 2s to close battle, victory music plays in background
      }
    }, 1500);
  };

  const loseBattle = () => {
    audioManager.playSFX('In-Battle Faint No Health', true);
    setMessage(`${gameState.getLeadPokemon()?.name} fainted!`);
    
    // Check if player has other conscious Pokemon
    const consciousPokemon = gameState.party.filter(p => p.hp > 0);
    
    if (consciousPokemon.length > 0) {
      later(() => {
        setMessage("Choose another Pokémon!");
        setIsForcedSwap(true);
        later(() => {
          setShowSelectionMenu(true);
        }, 1000);
      }, 1500);
    } else {
      later(() => {
        setMessage(`You blacked out!`);
        later(() => {
          gameState.healAll(); // Heal party when losing for simplicity
          endBattle();
        }, 2000);
      }, 1500);
    }
  };

  const startRun = () => {
    setPhase(P.ACTION);
    const catchRate = 0.50 + 0.50 * (1 - (wild.hp / wild.maxHp)); // Easier to run if wild HP is low
    if (Math.random() < catchRate) {
      audioManager.playSFX('In-Battle Recall Switch Flee Run', true);
      setMessage("Got away safely!");
      later(endBattle, 1500);
    } else {
      setMessage("Can't escape!");
      later(opponentTurn, 1500);
    }
  };

  // ── Render ────────────────────────────────────────────────────────────
  if (!visible || !wild) return null;

  const lead = gameState.getLeadPokemon();
  const wildSprite = wild.isShiny ? getShinyUrl(wild.id) : getSpriteUrl(wild.id);
  const plyrSprite = lead ? (lead.isShiny ? getShinyBackSpriteUrl(lead.id) : getBackSpriteUrl(lead.id)) : null;
  const plyrHpPct = lead ? (playerHp / lead.maxHp) * 100 : 100;
  const wildHpPct = (wild.hp / wild.maxHp) * 100;
  const plyrXpPct = lead ? (lead.xp / lead.xpToNext) * 100 : 0;

  const showUI = UI_PHASES.has(phase);
  const showEnemy = SHOW_ENEMY.has(phase); // Always keep in position
  const hideEnemySprite = phase === P.CATCHING; // Hide the sprite itself during catching
  const showPlayer = SHOW_PLYR.has(phase);
  const showTrainer = phase === P.TRAINER || phase === P.BALL;
  const showBall = phase === P.BALL;
  const isEmerging = phase === P.EMERGE;

  const trainerBgPos = `${-THROW_SHEET.displayW * trainerFrame}px 0`;

  return (
    <div className="frb-root">
      <div className="frb-wrap">
        {phase === P.FLASH && <div className="frb-flash" />}
        {phase !== P.FLASH && (
          <>
            <div className="frb-field">
              <img src="./assets/battle/grass.jpg" className="frb-field-bg" alt="" draggable={false} />
              
              <div className={`frb-enemy-status ${showUI ? "frb-status-in" : "frb-status-out-left"}`}>
                <img src="./assets/battle/opponent_pokemon_detail.png" className="frb-ui-img" alt="" draggable={false} />
                <span className="frb-name frb-enemy-name">
                  {wild.isShiny ? "★ " : ""}
                  {wild.name}
                </span>
                <span className="frb-level frb-enemy-level">{wild.level}</span>
                <div className="frb-hp-track frb-enemy-hp-track">
                  <div className="frb-hp-fill" style={{ width: `${wildHpPct}%`, backgroundColor: hpColor(wildHpPct) }} />
                </div>
              </div>

              <div className={`frb-enemy-area ${showEnemy ? "frb-enemy-in" : ""} ${enemyFlash ? "frb-flash-sprite" : ""}`}>
                {wild.isShiny && <span className="frb-shiny-star" title="Shiny!">&#9733;</span>}
                <img 
                  src={wildSprite} 
                  alt={wild.name} 
                  className={`frb-enemy-sprite ${wildHpPct <= 0 ? "frb-faint" : ""} ${wild.isShiny ? "frb-shiny" : ""}`} 
                  draggable={false} 
                  style={{ opacity: hideEnemySprite ? 0 : 1, transition: hideEnemySprite ? "opacity 0.3s, transform 0.3s" : "none", transform: hideEnemySprite ? "scale(0)" : "scale(1)" }} 
                />
              </div>

              {/* Pokeball catching animation */}
              {phase === P.CATCHING && pokeballShake > 0 && (
                <div className={`frb-enemy-area frb-enemy-in`}>
                  <img src="./assets/battle/pokeball.png" alt="" className={`frb-catch-ball shake-${pokeballShake}`} draggable={false} style={{ width: '40px', marginTop: '100px'}} />
                </div>
              )}

              <div className="frb-player-area">
                {showTrainer && (
                  <div className="frb-trainer" style={{ width: `${THROW_SHEET.displayW}px`, height: `${THROW_SHEET.displayH}px`, backgroundImage: `url(${THROW_SHEET.src})`, backgroundSize: `${THROW_SHEET.bgW}px ${THROW_SHEET.displayH}px`, backgroundPosition: trainerBgPos, backgroundRepeat: "no-repeat", imageRendering: "pixelated" }} />
                )}
                {showBall && <img src="./assets/battle/pokeball.png" alt="" className="frb-pokeball" draggable={false} />}
                {showPlayer && plyrSprite && (
                  <img src={plyrSprite} alt={lead?.name} className={`frb-player-sprite ${isEmerging ? "frb-emerge" : ""} ${playerFlash ? "frb-flash-sprite" : ""}`} draggable={false} />
                )}
              </div>

              {lead && (
                <div className={`frb-player-status ${showUI ? "frb-status-in" : "frb-status-out-right"}`}>
                  <img src="./assets/battle/own_pokemon_detail.png" className="frb-ui-img" alt="" draggable={false} />
                  <span className="frb-name frb-player-name">{lead.name}</span>
                  <span className="frb-level frb-player-level">{lead.level}</span>
                  <div className="frb-hp-track frb-player-hp-track">
                    <div className="frb-hp-fill" style={{ width: `${plyrHpPct}%`, backgroundColor: hpColor(plyrHpPct) }} />
                  </div>
                  <span className="frb-hp-nums">{playerHp}/{lead.maxHp}</span>
                  <div className="frb-exp-track">
                    <div className="frb-exp-fill" style={{ width: `${Math.min(100, plyrXpPct)}%` }} />
                  </div>
                </div>
              )}
            </div>

            <div className="frb-bottom">
              <div className="frb-msg-wrap">
                <img src="./assets/battle/what_will_pokemon_do.png" className="frb-msg-img" alt="" draggable={false} />
                <p className="frb-msg-text">
                  {phase === P.MENU || phase === P.FIGHT_MENU ? `What will\n${lead?.name || "POKEMON"} do?` : message}
                </p>
              </div>

              {phase === P.MENU && (
                <div className="frb-action-wrap">
                  <img src="./assets/battle/battle_options.png" className="frb-action-img" alt="" draggable={false} />
                  <div className="frb-action-overlay" data-action={selectedAct}>
                    <button className="frb-zone-btn" style={{ top: "8%", left: "2%", width: "46%", height: "42%" }} onClick={() => doMainMenuAction(0)} tabIndex={-1} aria-label="FIGHT" />
                    <button className="frb-zone-btn" style={{ top: "8%", right: "2%", width: "40%", height: "42%" }} onClick={() => doMainMenuAction(1)} tabIndex={-1} aria-label="BAG" />
                    <button className="frb-zone-btn" style={{ bottom: "8%", left: "2%", width: "46%", height: "42%" }} onClick={() => doMainMenuAction(2)} tabIndex={-1} aria-label="POKéMON" />
                    <button className="frb-zone-btn" style={{ bottom: "8%", right: "2%", width: "40%", height: "42%" }} onClick={() => doMainMenuAction(3)} tabIndex={-1} aria-label="RUN" />
                    <span className="frb-cursor-el">▶</span>
                  </div>
                </div>
              )}

              {phase === P.FIGHT_MENU && (
                <div className="frb-action-wrap">
                  <img src="./assets/battle/move_options.png" className="frb-action-img" alt="" draggable={false} />
                  <div className="frb-moves-overlay" data-action={selectedAct}>
                    {lead?.moves?.map((move, idx) => (
                      <button key={idx} className="frb-move-btn" onClick={() => executeMove(idx)} tabIndex={-1}>
                        {move.name}
                        {selectedAct === idx && <span className="frb-move-cursor">▶</span>}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {showSelectionMenu && (
        <div className="menu-overlay" style={{zIndex: 9999}} onClick={(e) => { e.stopPropagation(); handleSelectionClose(); }}>
          <PokemonSelectionView 
            onClose={handleSelectionClose}
            isBattleMode={true}
            onSelect={handlePokemonSwap}
          />
        </div>
      )}
    </div>
  );
}
