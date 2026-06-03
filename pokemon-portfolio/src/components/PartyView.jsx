import { useState, useEffect } from 'react';
import { getSpriteUrl, getShinyUrl, getPokemonById, TYPE_COLORS } from '../data/pokemon151';
import gameState from '../data/gameState';

/**
 * PartyView — Shows the player's 6 Pokémon party slots.
 * Can swap order and release Pokémon.
 */
export default function PartyView({ onClose }) {
  const [party, setParty] = useState([...gameState.party]);
  const [selectedIdx, setSelectedIdx] = useState(null);

  useEffect(() => {
    const unsub = gameState.onChange(() => setParty([...gameState.party]));
    return unsub;
  }, []);

  const handleSelect = (idx) => {
    if (selectedIdx === null) {
      setSelectedIdx(idx);
    } else if (selectedIdx === idx) {
      setSelectedIdx(null);
    } else {
      // Swap
      gameState.swapParty(selectedIdx, idx);
      setSelectedIdx(null);
    }
  };

  const handleRelease = (uid) => {
    if (party.length <= 1) return;
    if (confirm('Release this Pokémon? It will be gone forever!')) {
      gameState.removePokemon(uid);
      setSelectedIdx(null);
    }
  };

  return (
    <div className="party-view">
      <div className="party-header">
        <h3>Your Team</h3>
        <button className="party-close" onClick={onClose}>✕</button>
      </div>
      <div className="party-slots">
        {[0,1,2,3,4,5].map(idx => {
          const pokemon = party[idx];
          if (!pokemon) {
            return (
              <div key={idx} className="party-slot empty">
                <div className="slot-empty-ball">●</div>
                <span className="slot-empty-text">Empty</span>
              </div>
            );
          }

          const data = getPokemonById(pokemon.id);
          const spriteUrl = pokemon.isShiny ? getShinyUrl(pokemon.id) : getSpriteUrl(pokemon.id);
          const hpPercent = Math.round((pokemon.hp / pokemon.maxHp) * 100);
          const xpPercent = Math.round((pokemon.xp / pokemon.xpToNext) * 100);
          const isSelected = selectedIdx === idx;
          const isLead = idx === 0;

          return (
            <div
              key={pokemon.uid}
              className={`party-slot ${isSelected ? 'selected' : ''} ${isLead ? 'lead' : ''}`}
              onClick={() => handleSelect(idx)}
            >
              {isLead && <div className="lead-badge">LEAD</div>}
              {pokemon.isShiny && <div className="shiny-badge">★</div>}
              <img src={spriteUrl} alt={pokemon.name} className="slot-sprite" />
              <div className="slot-info">
                <span className="slot-name">{pokemon.name}</span>
                <span className="slot-level">Lv.{pokemon.level}</span>
                <div className="slot-types">
                  {data.types.map(t => (
                    <span key={t} className="type-badge-sm" style={{backgroundColor: TYPE_COLORS[t]}}>
                      {t}
                    </span>
                  ))}
                </div>
                <div className="slot-bars">
                  <div className="hp-bar-container">
                    <div className="hp-bar-label">HP</div>
                    <div className="hp-bar-track">
                      <div
                        className="hp-bar-fill"
                        style={{
                          width: `${hpPercent}%`,
                          backgroundColor: hpPercent > 50 ? '#4ade80' : hpPercent > 20 ? '#facc15' : '#ef4444',
                        }}
                      />
                    </div>
                    <span className="hp-text">{pokemon.hp}/{pokemon.maxHp}</span>
                  </div>
                  <div className="xp-bar-container">
                    <div className="xp-bar-label">XP</div>
                    <div className="xp-bar-track">
                      <div className="xp-bar-fill" style={{width: `${xpPercent}%`}} />
                    </div>
                  </div>
                </div>
              </div>
              {isSelected && party.length > 1 && (
                <button
                  className="release-btn"
                  onClick={(e) => { e.stopPropagation(); handleRelease(pokemon.uid); }}
                >
                  Release
                </button>
              )}
            </div>
          );
        })}
      </div>
      {selectedIdx !== null && (
        <p className="party-hint">Tap another Pokémon to swap positions</p>
      )}
      <div className="party-footer">
        <span>Steps: {gameState.stepsWalked}</span>
        <span>Pokédex: {gameState.pokedex.size}/151</span>
      </div>
    </div>
  );
}
