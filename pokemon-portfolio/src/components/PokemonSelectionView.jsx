import { useState, useEffect } from "react";
import gameState from "../data/gameState";
import { getSpriteUrl, getShinyUrl, TYPE_COLORS, getPokemonById } from "../data/pokemon151";

export default function PokemonSelectionView({ onClose, speciesFilterId, isBattleMode, onSelect }) {
  const [allOwned, setAllOwned] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Menu state: 'main', 'slot_select'
  const [menuState, setMenuState] = useState('main');
  const [flavorText, setFlavorText] = useState("");

  useEffect(() => {
    const updateOwned = () => {
      let list = [];
      if (speciesFilterId) {
        // Pokedex Mode: Show all owned instances of this specific species
        list = [...gameState.party, ...gameState.pc].filter((p) => p.id === speciesFilterId);
      } else {
        // Party Mode: Show current 6 party members
        list = [...gameState.party];
      }

      setAllOwned(list);
      setCurrentIndex((prev) => Math.min(prev, Math.max(0, list.length - 1)));
    };

    updateOwned();
    const unsub = gameState.onChange(updateOwned);
    return unsub;
  }, [speciesFilterId]);

  const current = allOwned[currentIndex];
  const isParty = current ? gameState.party.some((p) => p.uid === current.uid) : false;
  const partyIdx = current ? gameState.party.findIndex((p) => p.uid === current.uid) : -1;
  const pcIdx = current ? gameState.pc.findIndex((p) => p.uid === current.uid) : -1;

  useEffect(() => {
    if (!current) return;
    const pkmnData = getPokemonById(current.id);
    const genericSummary = `${current.name} is a ${pkmnData.types.join("/")} type Pokémon. It is currently Level ${current.level} with ${current.hp}/${current.maxHp} HP. It knows ${current.moves.length} moves.`;
    
    setFlavorText("Loading summary...");
    fetch(`https://pokeapi.co/api/v2/pokemon-species/${current.id}`)
      .then(res => res.json())
      .then(data => {
        const entries = data.flavor_text_entries.filter(e => e.language.name === 'en');
        if (entries.length > 0) {
          // Get up to 2 unique texts to make the summary longer
          const uniqueTexts = Array.from(new Set(entries.map(e => e.flavor_text.replace(/[\n\f]/g, ' '))));
          setFlavorText(uniqueTexts.slice(0, 2).join(" "));
        } else {
          setFlavorText(genericSummary);
        }
      })
      .catch(() => {
        setFlavorText(genericSummary);
      });
  }, [current]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? allOwned.length - 1 : prev - 1));
    setMenuState('main');
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === allOwned.length - 1 ? 0 : prev + 1));
    setMenuState('main');
  };

  // --- ACTIONS ---
  const handleRelease = () => {
    if (window.confirm(`Are you sure you want to release ${current.name}?`)) {
      const success = gameState.releasePokemon(current.uid);
      if (!success) alert("Cannot release your last Pokémon!");
      setMenuState('main');
    }
  };

  const handleSetLead = () => {
    if (isParty) {
      gameState.swapParty(0, partyIdx);
    }
    setMenuState('main');
  };

  const handleSendToPC = () => {
    if (gameState.party.length > 1) {
      gameState.swapPartyAndPC(partyIdx, -1);
    } else {
      alert("Cannot deposit your last Pokémon!");
    }
    setMenuState('main');
  };

  const handleMoveToSlot = (slotIdx) => {
    // We are replacing slotIdx (0-5) in Party with `current` from PC.
    // If the slot is empty (e.g. party has 2 pokemon, we clicked Slot 4), we can just swapPartyAndPC(slotIdx, pcIdx)
    // Wait, gameState.swapPartyAndPC only works well if we pass valid indices.
    
    if (isParty) {
      // Swapping within party
      gameState.swapParty(partyIdx, slotIdx);
    } else {
      // Swapping from PC to a specific party slot
      // If the slot is empty, we just append it
      if (slotIdx >= gameState.party.length) {
         gameState.swapPartyAndPC(gameState.party.length, pcIdx);
      } else {
         gameState.swapPartyAndPC(slotIdx, pcIdx);
      }
    }
    setMenuState('main');
  };

  if (!current) {
    return (
      <div className="psv-root" onClick={e => e.stopPropagation()}>
        <div className="psv-empty">
          <p>You don't own any Pokémon here!</p>
          <button onClick={onClose}>Close</button>
        </div>
      </div>
    );
  }

  const pkmnData = getPokemonById(current.id);

  return (
    <div className="psv-root" onClick={e => e.stopPropagation()}>
      <button className="psv-close" onClick={onClose}>✕</button>

      {/* Top Banner (Information Display) */}
      <div className="psv-top-banner">
        <div className="psv-top-left">
           <div className="psv-banner-title">SUMMARY</div>
           <div className="psv-banner-summary">{flavorText}</div>
        </div>
        <div className="psv-top-right">
           <div className="psv-banner-title">{current.name}</div>
           <div className="psv-banner-level">Lv {current.level}</div>
           <div className="psv-banner-hp" style={{fontSize: '12px', marginTop: '8px', marginBottom: '8px', color: '#202020'}}>
             HP: {current.hp}/{current.maxHp}
           </div>
           <div className="psv-types">
              {pkmnData.types.map(t => (
                <span key={t} className="psv-type-badge" style={{ backgroundColor: TYPE_COLORS[t] }}>{t}</span>
              ))}
            </div>
           <div className="psv-status">
              {isParty ? <span className="psv-tag-party">In Party</span> : <span className="psv-tag-pc">In PC</span>}
           </div>
        </div>
      </div>

      {/* Center Stage */}
      <div className="psv-center-stage">
        <button className="psv-arrow psv-arrow-left" onClick={handlePrev}>◀</button>
        <div className="psv-sprite-wrap">
          <img 
            src={current.isShiny ? getShinyUrl(current.id) : getSpriteUrl(current.id)} 
            alt={current.name} 
            className={`psv-sprite ${current.isShiny ? 'frb-shiny' : ''}`}
            draggable={false}
          />
          <div className="psv-counter">{currentIndex + 1} / {allOwned.length}</div>
        </div>
        <button className="psv-arrow psv-arrow-right" onClick={handleNext}>▶</button>
      </div>

      {/* Bottom Menu (Move Options Style) */}
      <div className="psv-bottom-menu">
        <div className={`psv-menu-grid ${(menuState === 'slot_select' || (!speciesFilterId && !isBattleMode)) ? 'psv-menu-grid-3' : ''}`}>
          {isBattleMode ? (
            <>
              <button className="psv-menu-btn" disabled={current.hp <= 0} onClick={() => onSelect(current.uid)}>Appoint</button>
              <button className="psv-menu-btn" onClick={onClose}>Cancel</button>
            </>
          ) : speciesFilterId ? (
            /* Pokédex Mode Options */
            menuState === 'main' ? (
              <>
                <button className="psv-menu-btn" onClick={() => setMenuState('slot_select')}>Move to Slot</button>
                <button className="psv-menu-btn" onClick={handleRelease} style={{color: '#c83838'}}>Release</button>
                <button className="psv-menu-btn" onClick={onClose}>Cancel</button>
              </>
            ) : (
              <>
                {[0, 1, 2].map((i) => (
                  <button key={i} className="psv-menu-btn" onClick={() => handleMoveToSlot(i)}>Slot {i + 1}</button>
                ))}
                {[3, 4, 5].map((i) => (
                  <button key={i} className="psv-menu-btn" onClick={() => handleMoveToSlot(i)}>Slot {i + 1}</button>
                ))}
                <button className="psv-menu-btn" onClick={() => setMenuState('main')}>Back</button>
              </>
            )
          ) : (
            /* Party Mode Options */
            <>
              <button className="psv-menu-btn" onClick={handleSetLead}>Set Lead</button>
              <button className="psv-menu-btn" onClick={handleSendToPC}>Send to PC</button>
              
              {/* Evolve Option (Only if eligible) */}
              {pkmnData.evolvesTo && current.level >= pkmnData.evolvesTo[1] && (
                <button className="psv-menu-btn" style={{color: '#2d8f3e'}} onClick={() => {
                  const res = gameState.evolvePokemon(current.uid, pkmnData.evolvesTo[0]);
                  if (res) alert(`${res.fromName} evolved into ${res.toName}!`);
                }}>Evolve</button>
              )}

              <button className="psv-menu-btn" onClick={handleRelease} style={{color: '#c83838'}}>Release</button>
              <button className="psv-menu-btn" onClick={onClose}>Cancel</button>
            </>
          )}
        </div>
      </div>

    </div>
  );
}
