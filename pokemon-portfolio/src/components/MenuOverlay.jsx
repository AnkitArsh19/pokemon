import { useState, useEffect, useCallback } from 'react';
import EventBus from '../game/EventBus';
import { portfolio, TYPE_COLORS } from '../data/portfolio';
import gameState from '../data/gameState';
import PartyView from './PartyView';
import PokedexView from './PokedexView';
import PokemonSelectionView from './PokemonSelectionView';
import { BOARD_TEXT_POOL } from '../data/boardTexts';

/**
 * MenuOverlay — Combined game menu + portfolio content.
 * ESC opens the main menu. Buildings/NPCs open specific sections.
 */
export default function MenuOverlay() {
  const [visible, setVisible] = useState(false);
  const [section, setSection] = useState(null);
  const [speciesFilterId, setSpeciesFilterId] = useState(null);

  useEffect(() => {
    const unsub = EventBus.on('showMenu', ({ section: s }) => {
      setSection(s || 'main');
      setVisible(true);
      EventBus.emit('blockInput');
    });
    return () => unsub();
  }, []);

  const close = useCallback(() => {
    setVisible(false);
    setSection(null);
    setSpeciesFilterId(null);
    EventBus.emit('unblockInput');
  }, []);

  const openSection = (s) => {
    setSection(s);
    setSpeciesFilterId(null);
  };

  // Keyboard
  useEffect(() => {
    if (!visible) return;
    const handleKey = (e) => {
      if (e.key === 'Escape' || e.key === 'x' || e.key === 'Backspace') {
        e.preventDefault();
        if (section !== 'main') {
          setSection('main');
        } else {
          close();
        }
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [visible, section, close]);

  if (!visible) return null;

  if (section === 'main') {
    return (
      <div className="menu-overlay" onClick={close}>
        <div className="main-menu-panel" onClick={e => e.stopPropagation()}>
          <div className="main-menu-list">
            <button className="main-menu-item" onClick={() => openSection('pokemon')}>
              <img src="./assets/icons/poke_ball.png" className="mm-icon-img" alt="" /> POKéMON
            </button>
            <button className="main-menu-item" onClick={() => openSection('pokedex')}>
              <img src="./assets/icons/album_photo.png" className="mm-icon-img" alt="" /> POKéDEX
            </button>
            <button className="main-menu-item" onClick={() => openSection('controls')}>
              <img src="./assets/icons/musique_gb.png" className="mm-icon-img" alt="" /> CONTROLS
            </button>
            <button className="main-menu-item" onClick={() => openSection('options')}>
              <img src="./assets/icons/cherch_objet.png" className="mm-icon-img" alt="" /> OPTIONS
            </button>
            <button className="main-menu-item" onClick={() => openSection('houses')}>
              <img src="./assets/icons/carte_magnetique.png" className="mm-icon-img" alt="" /> HOUSES
            </button>
            <button className="main-menu-item" onClick={() => openSection('tips')}>
              <img src="./assets/icons/cherch_objet.png" className="mm-icon-img" alt="" /> TIPS
            </button>
            <button className="main-menu-item" onClick={() => { close(); EventBus.emit('playIntro'); }}>
              <img src="./assets/icons/album_photo.png" className="mm-icon-img" alt="" /> INTRO
            </button>
            <button className="main-menu-item" onClick={() => openSection('contact')}>
              <img src="./assets/icons/carte_magnetique.png" className="mm-icon-img" alt="" /> CONTACT
            </button>
            <button className="main-menu-item" onClick={() => { gameState.save(); close(); }}>
              <img src="./assets/icons/boite_jetons.png" className="mm-icon-img" alt="" /> SAVE
            </button>
            <button className="main-menu-item" onClick={close}>
              <img src="./assets/icons/corte_sortie.png" className="mm-icon-img" alt="" /> CLOSE
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Sub-sections
  if (section === 'houses') {
    const teleport = (houseId, interiorKey, returnX, returnY) => {
      EventBus.emit('teleportToHouse', { houseId, interiorKey, returnX, returnY });
      close();
    };

    const houses = [
      { houseId: 'house_1', imageKey: 'red_house', name: "Professor Arsh's Lab", x: 66, y: 207 },
      { houseId: 'house_2', imageKey: 'oak_lab', name: "The Safari Zone Lodge", x: 76, y: 213 },
      { houseId: 'house_3', imageKey: 'interior_1', name: "The Power Plant", x: 75, y: 207 },
      { houseId: 'house_4', imageKey: 'interior_2', name: "The Radio Tower", x: 74, y: 146 },
      { houseId: 'house_5', imageKey: 'interior_3', name: "Silph Co. Building", x: 73, y: 138 },
      { houseId: 'house_6', imageKey: 'interior_4', name: "Victory Road HQ", x: 84, y: 139 },
      { houseId: 'house_7', imageKey: 'interior_5', name: "The Battle Tower", x: 73, y: 131 },
      { houseId: 'house_8', imageKey: 'interior_2', name: "The Mysterious Restaurant", x: 84, y: 130 },
      { houseId: 'house_9', imageKey: 'interior_5', name: "The Old Sage's Library", x: 66, y: 91 },
      { houseId: 'house_10', imageKey: 'interior_1', name: "The Pokemon Center", x: 78, y: 86 },
    ];

    return (
      <div className="menu-overlay" onClick={close}>
        <div className="menu-panel custom-scrollbar" onClick={e => e.stopPropagation()} style={{ width: '380px', maxHeight: '80vh', overflowY: 'auto', padding: '16px' }}>
          <div className="menu-header" style={{ marginBottom: '16px' }}>
            <span className="menu-title">
              <img src="./assets/icons/carte_magnetique.png" className="mm-icon-img" alt="" /> HOUSES
            </span>
            <button className="menu-close" onClick={() => setSection('main')}>←</button>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '8px', paddingBottom: '10px' }}>
            {houses.map((h, i) => (
              <button 
                key={i}
                onClick={() => teleport(h.houseId, h.imageKey, h.x, h.y)}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'flex-start',
                  background: '#fff', border: '2px solid #506860', borderRadius: '6px',
                  padding: '12px 16px', cursor: 'pointer', fontFamily: '"Press Start 2P", monospace',
                  fontSize: '10px', color: '#404040', transition: 'background 0.2s', width: '100%',
                  textAlign: 'left'
                }}
                onMouseOver={(e) => e.currentTarget.style.background = '#e8f0e8'}
                onMouseOut={(e) => e.currentTarget.style.background = '#fff'}
              >
                <img src="./assets/icons/carte_magnetique.png" className="mm-icon-img" style={{ marginRight: '16px' }} alt="" />
                {h.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (section === 'tips') {
    const gameTips = BOARD_TEXT_POOL.slice(0, 5);
    
    return (
      <div className="menu-overlay" onClick={close}>
        <div className="menu-panel custom-scrollbar" onClick={e => e.stopPropagation()} style={{ width: '380px', maxHeight: '80vh', overflowY: 'auto', padding: '16px' }}>
          <div className="menu-header" style={{ marginBottom: '16px' }}>
            <span className="menu-title">
              <img src="./assets/icons/cherch_objet.png" className="mm-icon-img" alt="" /> GAME TIPS
            </span>
            <button className="menu-close" onClick={() => setSection('main')}>←</button>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', paddingBottom: '10px' }}>
            {gameTips.map((tipArray, idx) => (
              <div key={idx} style={{ 
                background: '#fff', 
                border: '2px solid #506860', 
                borderRadius: '6px', 
                padding: '12px',
                fontFamily: '"Press Start 2P", monospace',
                fontSize: '9px',
                lineHeight: '1.6',
                color: '#404040'
              }}>
                <div style={{ fontWeight: 'bold', marginBottom: '8px', color: '#1a332a' }}>TIP #{idx + 1}</div>
                {tipArray.map((line, lIdx) => (
                  <div key={lIdx} style={{ marginBottom: '4px' }}>
                    {line.split('\n').map((str, sIdx) => (
                      <div key={sIdx}>{str}</div>
                    ))}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (section === 'contact') {
    const contacts = [
      { name: "Email", value: "ankitarsh19@gmail.com", link: "mailto:ankitarsh19@gmail.com" },
      { name: "GitHub", value: "github.com/AnkitArsh19", link: "https://github.com/AnkitArsh19" },
      { name: "LinkedIn", value: "linkedin.com/in/ankitarsh19", link: "https://linkedin.com/in/ankitarsh19" },
      { name: "Medium", value: "medium.com/@ankitarsh19", link: "https://medium.com/@ankitarsh19" },
      { name: "X / Twitter", value: "x.com/AnkitArsh19", link: "https://x.com/AnkitArsh19" },
      { name: "Instagram", value: "instagram.com/ankit_arsh19", link: "https://instagram.com/ankit_arsh19" }
    ];

    return (
      <div className="menu-overlay" onClick={close}>
        <div className="menu-panel custom-scrollbar" onClick={e => e.stopPropagation()} style={{ width: '380px', maxHeight: '80vh', overflowY: 'auto', padding: '16px' }}>
          <div className="menu-header" style={{ marginBottom: '16px' }}>
            <span className="menu-title">
              <img src="./assets/icons/carte_magnetique.png" className="mm-icon-img" alt="" /> CONTACT
            </span>
            <button className="menu-close" onClick={() => setSection('main')}>←</button>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '8px', paddingBottom: '10px' }}>
            {contacts.map((c, i) => (
              <a 
                key={i}
                href={c.link}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center',
                  background: '#fff', border: '2px solid #506860', borderRadius: '6px',
                  padding: '12px 16px', cursor: 'pointer', fontFamily: '"Press Start 2P", monospace',
                  color: '#404040', transition: 'background 0.2s', width: '100%',
                  textDecoration: 'none', gap: '8px'
                }}
                onMouseOver={(e) => e.currentTarget.style.background = '#e8f0e8'}
                onMouseOut={(e) => e.currentTarget.style.background = '#fff'}
              >
                <div style={{ fontSize: '10px', color: '#506860' }}>{c.name}</div>
                <div style={{ fontSize: '8px', wordBreak: 'break-all', lineHeight: '1.4' }}>{c.value}</div>
              </a>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (section === 'pokemon') {
    return (
      <div className="menu-overlay" onClick={() => setSection('main')}>
        <PokemonSelectionView 
          onClose={() => { setSection('main'); setSpeciesFilterId(null); }} 
          speciesFilterId={speciesFilterId} 
        />
      </div>
    );
  }

  if (section === 'pokedex') {
    return (
      <div className="menu-overlay" onClick={() => setSection('main')}>
        <div className="menu-panel wide" onClick={e => e.stopPropagation()}>
          <PokedexView 
            onClose={() => setSection('main')} 
            onSelect={(id) => {
              const ownedCount = [...gameState.party, ...gameState.pc].filter(p => p.id === id).length;
              if (ownedCount > 0) {
                setSpeciesFilterId(id);
                setSection('pokemon');
              } else {
                alert("You don't own any instances of this Pokémon right now!");
              }
            }}
          />
        </div>
      </div>
    );
  }

  // Portfolio sections
  return (
    <div className="menu-overlay" onClick={() => setSection('main')}>
      <div className="menu-panel" onClick={e => e.stopPropagation()}>
        <div className="menu-header">
          <span className="menu-title">{section?.toUpperCase()}</span>
          <button className="menu-close" onClick={() => setSection('main')}>←</button>
        </div>
        <div className="menu-body">
          {section === 'controls' && <ControlsMenu />}
          {section === 'options' && <OptionsMenu />}
        </div>
        <div className="menu-footer">
          <span className="menu-hint">Press ESC to go back</span>
        </div>
      </div>
    </div>
  );
}

function ControlsMenu() {
  const controls = [
    { key: '↑ ↓ ← →', action: 'Move character' },
    { key: 'SPACE', action: 'Interact / Talk' },
    { key: 'ENTER', action: 'Interact / Confirm' },
    { key: 'Z', action: 'Interact (alt)' },
    { key: 'ESC', action: 'Open / Close menu' },
    { key: 'X', action: 'Close / Cancel' },
    { key: 'Click tile', action: 'Walk to tile' },
    { key: 'Click player', action: 'Open menu' },
    { key: 'Menu button', action: 'Open menu (top-right)' },
  ];

  return (
    <div className="menu-content controls-menu">
      <div className="menu-subtitle">
        <img src="./assets/icons/musique_gb.png" className="mm-icon-img" alt="" /> CONTROLS
      </div>
      <div className="controls-grid" style={{ padding: '10px', background: '#fff', border: '2px solid #506860', borderRadius: '8px', margin: '10px 0', fontSize: '10px' }}>
        {controls.map((c, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 4px', borderBottom: i < controls.length - 1 ? '1px solid #e0e0e0' : 'none' }}>
            <span style={{ fontWeight: 'bold', color: '#d04848' }}>{c.key}</span>
            <span style={{ color: '#404040', textAlign: 'right' }}>{c.action}</span>
          </div>
        ))}
      </div>
      <div className="menu-subtitle" style={{marginTop: '16px'}}>
        <img src="./assets/icons/lumiere_argile.png" className="mm-icon-img" alt="" /> TIPS
      </div>
      <div className="controls-tips" style={{ padding: '10px', background: '#fff', border: '2px solid #506860', borderRadius: '8px', margin: '10px 0', fontSize: '10px' }}>
        <ul style={{ margin: 0, paddingLeft: '20px', color: '#404040', lineHeight: '1.8' }}>
          <li>Walk in tall grass to encounter wild POKéMON.</li>
          <li>Talk to Nurse Joy to heal your party.</li>
          <li>Check POKéDEX to see all 151 POKéMON.</li>
          <li>Your lead POKéMON follows you around!</li>
          <li>POKéMON gain XP with every step you take.</li>
        </ul>
      </div>
    </div>
  );
}

function OptionsMenu() {
  const resetSave = () => {
    if (window.confirm('Reset all game data? This cannot be undone!')) {
      gameState.reset();
      window.location.reload();
    }
  };

  return (
    <div className="menu-content options-menu">
      <div className="menu-subtitle">
        <img src="./assets/icons/cherch_objet.png" className="mm-icon-img" alt="" /> OPTIONS
      </div>
      <div style={{ padding: '20px 10px', background: '#fff', border: '2px solid #506860', borderRadius: '8px', margin: '10px 0', fontSize: '10px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px' }}>
          <span style={{ color: '#404040', fontWeight: 'bold' }}>Reset Save Data</span>
          <button onClick={resetSave} style={{
            background: '#d04848', color: 'white', border: '2px solid #802020', 
            borderRadius: '4px', padding: '10px 16px', fontFamily: '"Press Start 2P", monospace', 
            fontSize: '10px', cursor: 'pointer'
          }}>
            RESET
          </button>
        </div>
      </div>
    </div>
  );
}
