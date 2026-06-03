import PhaserGame from './components/PhaserGame';
import DialogueBox from './components/DialogueBox';
import MenuOverlay from './components/MenuOverlay';
import MobileControls from './components/MobileControls';
import StarterSelect from './components/StarterSelect';
import LevelUpOverlay from './components/LevelUpOverlay';
import EncounterOverlay from './components/EncounterOverlay';
import PortfolioOverlay from './components/PortfolioOverlay';
import './App.css';

/**
 * App — Root component. Renders the Phaser game canvas
 * with React overlay layers for dialogue, menus, game features, and mobile controls.
 */
export default function App() {
  return (
    <div className="game-app">
      {/* Phaser game canvas */}
      <PhaserGame />

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
  );
}
