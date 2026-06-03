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

  // Continuously emit direction while D-pad is held
  useEffect(() => {
    if (!isTouch) return;
    intervalRef.current = setInterval(() => {
      if (activeDir.current) {
        EventBus.emit('mobileDirection', activeDir.current);
      }
    }, 100);
    return () => clearInterval(intervalRef.current);
  }, [isTouch]);

  const startDirection = (dir) => {
    activeDir.current = dir;
    EventBus.emit('mobileDirection', dir);
  };

  const stopDirection = () => {
    activeDir.current = null;
  };

  const handleAButton = () => {
    EventBus.emit('mobileInteract');
  };

  const handleBButton = () => {
    EventBus.emit('showMenu', { section: 'main' });
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
              onTouchStart={(e) => { e.preventDefault(); handleAButton(); }}
              aria-label="A - Interact"
            >A</button>
            <button
              className="ab-btn btn-b"
              onTouchStart={(e) => { e.preventDefault(); handleBButton(); }}
              aria-label="B - Menu"
            >B</button>
          </div>
        </div>
      )}
    </>
  );
}
