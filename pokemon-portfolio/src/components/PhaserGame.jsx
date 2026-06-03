import { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import { createGameConfig } from '../game/config';

/**
 * PhaserGame — React component that hosts the Phaser game canvas.
 * Initializes and cleans up the game instance.
 */
export default function PhaserGame() {
  const gameContainerRef = useRef(null);
  const gameRef = useRef(null);

  useEffect(() => {
    if (gameRef.current) return;

    const config = createGameConfig(gameContainerRef.current);
    gameRef.current = new Phaser.Game(config);
    window.__PHASER_GAME__ = gameRef.current;

    return () => {
      if (gameRef.current) {
        gameRef.current.destroy(true);
        gameRef.current = null;
      }
    };
  }, []);

  return (
    <div
      id="game-container"
      ref={gameContainerRef}
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    />
  );
}
