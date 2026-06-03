import { useState, useEffect } from 'react';
import { POKEDEX, getSpriteUrl, getShinyUrl, TYPE_COLORS } from '../data/pokemon151';
import gameState from '../data/gameState';

/**
 * PokedexView — Grid of all 151 Pokémon.
 * Caught = color sprite + name. Uncaught = silhouette + "???".
 */
export default function PokedexView({ onClose, onSelect }) {
  const [caught, setCaught] = useState(new Set(gameState.pokedex));
  const [ownedCounts, setOwnedCounts] = useState({});
  const [ownedShinies, setOwnedShinies] = useState(new Set());

  useEffect(() => {
    const updateState = () => {
      setCaught(new Set(gameState.pokedex));
      const counts = {};
      const shinies = new Set();
      const allOwned = [...gameState.party, ...gameState.pc];
      for (const p of allOwned) {
        counts[p.id] = (counts[p.id] || 0) + 1;
        if (p.isShiny) shinies.add(p.id);
      }
      setOwnedCounts(counts);
      setOwnedShinies(shinies);
    };
    updateState();
    const unsub = gameState.onChange(updateState);
    return unsub;
  }, []);

  return (
    <div className="pokedex-view">
      <div className="pokedex-header">
        <h3>POKéDEX</h3>
        <span className="pokedex-count">{caught.size} / 151 caught</span>
        <button className="pokedex-close" onClick={onClose}>✕</button>
      </div>
      <div className="pokedex-grid">
        {POKEDEX.map(pkmn => {
          const isCaught = caught.has(pkmn.id);
          const owned = ownedCounts[pkmn.id] || 0;
          const hasShiny = ownedShinies.has(pkmn.id);
          
          return (
            <div
              key={pkmn.id}
              className={`pokedex-entry ${isCaught ? 'caught' : 'unknown'}`}
              title={isCaught ? pkmn.name : '???'}
              onClick={() => isCaught && onSelect && onSelect(pkmn.id)}
              style={{ cursor: isCaught ? 'pointer' : 'default' }}
            >
              <div className="pokedex-id">#{String(pkmn.id).padStart(3, '0')}</div>
              <img
                src={hasShiny ? getShinyUrl(pkmn.id) : getSpriteUrl(pkmn.id)}
                alt={isCaught ? pkmn.name : '???'}
                className={`pokedex-sprite ${isCaught ? '' : 'silhouette'} ${hasShiny ? 'frb-shiny' : ''}`}
              />
              <span className="pokedex-name">{isCaught ? pkmn.name : '???'}</span>
              {isCaught && (
                <div className="pokedex-types">
                  {pkmn.types.map(t => (
                    <span key={t} className="type-dot" style={{backgroundColor: TYPE_COLORS[t]}} />
                  ))}
                </div>
              )}
              {owned > 0 && (
                <div className="pokedex-owned-badge">x{owned}</div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
