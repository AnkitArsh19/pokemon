import { useState, useEffect, useRef } from 'react';
import PhaserGame from './components/PhaserGame';
import DialogueBox from './components/DialogueBox';
import MenuOverlay from './components/MenuOverlay';
import MobileControls from './components/MobileControls';
import StarterSelect from './components/StarterSelect';
import LevelUpOverlay from './components/LevelUpOverlay';
import EncounterOverlay from './components/EncounterOverlay';
import PortfolioOverlay from './components/PortfolioOverlay';
import EventBus from './game/EventBus';
import gameState from './data/gameState';
import './App.css';

/**
 * App — Root component. Renders the Phaser game canvas
 * with React overlay layers for dialogue, menus, game features, and mobile controls.
 */
export default function App() {
  const [gameStarted, setGameStarted] = useState(gameState.hasSelectedStarter);
  const [uiScale, setUiScale] = useState(1);
  
  const BASE_WIDTH = 900;
  const BASE_HEIGHT = 600;

  useEffect(() => {
    const unsub = EventBus.on('beginLazyLoad', () => {
      setGameStarted(true);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      const app = document.querySelector('.game-app');
      if (app) {
        const rect = app.getBoundingClientRect();
        const scaleX = rect.width / BASE_WIDTH;
        const scaleY = rect.height / BASE_HEIGHT;
        setUiScale(Math.min(scaleX, scaleY, 1));
      }
    };
    
    window.addEventListener('resize', handleResize);
    setTimeout(handleResize, 50); // initial calc
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="game-app-wrapper">
      <div className="game-app">
        {/* Phaser game canvas */}
        {gameStarted && <PhaserGame />}

        {/* UI Layer - Scales down collectively to fit mobile screens exactly like desktop */}
        <div 
          className="ui-layer" 
          style={{ 
            position: 'absolute', 
            top: '50%', left: '50%', 
            width: `${BASE_WIDTH}px`, height: `${BASE_HEIGHT}px`,
            transform: `translate(-50%, -50%) scale(${uiScale})`, 
            transformOrigin: 'center center',
            pointerEvents: 'none',
            zIndex: 10
          }}
        >
          {/* Game feature overlays */}
          <StarterSelect />
          <LevelUpOverlay />
          <EncounterOverlay />
          <PortfolioOverlay />

          {/* React overlays (positioned above canvas via z-index) */}
          <DialogueBox />
          <MenuOverlay />
        </div>
        
        {/* Mobile controls outside the scaling layer so they remain large and tappable */}
        <MobileControls />
      </div>
    </div>
  );
}
