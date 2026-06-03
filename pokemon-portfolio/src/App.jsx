import { useState, useEffect } from 'react';
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

  useEffect(() => {
    const unsub = EventBus.on('beginLazyLoad', () => {
      setGameStarted(true);
    });
    return () => unsub();
  }, []);

  return (
    <div className="game-app-wrapper">
      <div className="game-app">
        {/* Phaser game canvas */}
        {gameStarted && <PhaserGame />}

        {/* Game feature overlays */}
        <StarterSelect />
        <LevelUpOverlay />
        <EncounterOverlay />
        <PortfolioOverlay />

        {/* React overlays (positioned above canvas via z-index) */}
        <DialogueBox />
        <MenuOverlay />
        <MobileControls />
      </div>
    </div>
  );
}
