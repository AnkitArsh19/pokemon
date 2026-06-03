import { useEffect, useRef, useState } from 'react';
import EventBus from '../game/EventBus';

/**
 * MobileControls — D-pad + A/B for MOBILE ONLY.
 * Desktop gets no D-pad (just the floating menu button).
 */
export default function MobileControls() {
  const [isTouch, setIsTouch] = useState(false);
  const activeDir = useRef(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    // Check if device is actually mobile/tablet via user agent
    const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    // Also ensure it supports touch and screen isn't massive
    const touch = isMobileDevice && ('ontouchstart' in window) && window.innerWidth < 1024;
    setIsTouch(touch);
  }, []);


  const simulateKey = (keyName, isDown) => {
    const keyCodes = {
      ArrowUp: 38,
      ArrowDown: 40,
      ArrowLeft: 37,
      ArrowRight: 39,
      Enter: 13,
      Escape: 27
    };

    const event = new KeyboardEvent(isDown ? 'keydown' : 'keyup', {
      key: keyName,
      code: keyName,
      keyCode: keyCodes[keyName],
      which: keyCodes[keyName],
      bubbles: true,
      cancelable: true,
    });
    // Phaser strictly requires keyCode property for its Input plugin
    Object.defineProperty(event, 'keyCode', { get: () => keyCodes[keyName] });
    Object.defineProperty(event, 'which', { get: () => keyCodes[keyName] });
    window.dispatchEvent(event);
  };

  const startDirection = (dir) => {
    activeDir.current = dir;
    const keys = { up: 'ArrowUp', down: 'ArrowDown', left: 'ArrowLeft', right: 'ArrowRight' };
    simulateKey(keys[dir], true);
  };

  const stopDirection = () => {
    if (activeDir.current) {
      const keys = { up: 'ArrowUp', down: 'ArrowDown', left: 'ArrowLeft', right: 'ArrowRight' };
      simulateKey(keys[activeDir.current], false);
      activeDir.current = null;
    }
  };

  const handleAButton = (isDown) => {
    if (isDown) {
      EventBus.emit('mobileInteract');
      simulateKey('Enter', true);
    } else {
      simulateKey('Enter', false);
    }
  };

  const handleBButton = (isDown) => {
    if (isDown) {
      EventBus.emit('showMenu', { section: 'main' });
      simulateKey('Escape', true);
    } else {
      simulateKey('Escape', false);
    }
  };

  const openMenu = () => {
    EventBus.emit('showMenu', { section: 'main' });
  };

  return (
    <>
      {/* Floating menu button — always visible */}
      <button className="menu-fab" onClick={openMenu} aria-label="Menu">
        ☰
      </button>

      {/* Mobile: D-pad + A/B */}
      {isTouch && (
        <div className="mobile-controls">
          <div className="dpad-container">
            <div className="dpad">
              <button
                className="dpad-btn dpad-up"
                onTouchStart={(e) => { e.preventDefault(); startDirection('up'); }}
                onTouchEnd={stopDirection}
                aria-label="Up"
              >▲</button>
              <button
                className="dpad-btn dpad-left"
                onTouchStart={(e) => { e.preventDefault(); startDirection('left'); }}
                onTouchEnd={stopDirection}
                aria-label="Left"
              >◀</button>
              <div className="dpad-center" />
              <button
                className="dpad-btn dpad-right"
                onTouchStart={(e) => { e.preventDefault(); startDirection('right'); }}
                onTouchEnd={stopDirection}
                aria-label="Right"
              >▶</button>
              <button
                className="dpad-btn dpad-down"
                onTouchStart={(e) => { e.preventDefault(); startDirection('down'); }}
                onTouchEnd={stopDirection}
                aria-label="Down"
              >▼</button>
            </div>
          </div>

          <div className="ab-container">
            <button
              className="ab-btn btn-a"
              onTouchStart={(e) => { e.preventDefault(); handleAButton(true); }}
              onTouchEnd={(e) => { e.preventDefault(); handleAButton(false); }}
              aria-label="A - Interact"
            >A</button>
            <button
              className="ab-btn btn-b"
              onTouchStart={(e) => { e.preventDefault(); handleBButton(true); }}
              onTouchEnd={(e) => { e.preventDefault(); handleBButton(false); }}
              aria-label="B - Menu"
            >B</button>
          </div>
        </div>
      )}
    </>
  );
}
