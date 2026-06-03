import { useState, useEffect, useRef } from 'react';
import { getSpriteUrl } from '../data/pokemon151';
import EventBus from '../game/EventBus';

/**
 * LevelUpOverlay — Shows level-up and evolution notifications.
 * Auto-dismisses after a few seconds.
 */
export default function LevelUpOverlay() {
  const [events, setEvents] = useState([]);
  const [currentEvent, setCurrentEvent] = useState(null);
  const [evolutionPhase, setEvolutionPhase] = useState(null); // null | 'flash' | 'morph' | 'done'
  const timerRef = useRef(null);


  useEffect(() => {
    const unsub = EventBus.on('gameEvents', (newEvents) => {
      // Filter level-ups: only show every 5 levels to reduce spam
      const filtered = newEvents.filter(e => {
        if (e.type === 'levelUp') {
          return e.pokemon.level % 5 === 0 || e.pokemon.level === 100;
        }
        return true; // Always show evolutions
      });
      if (filtered.length > 0) {
        setEvents(prev => [...prev, ...filtered]);
      }
    });
    return () => unsub();
  }, []);

  // Process event queue
  useEffect(() => {
    if (!currentEvent && events.length > 0) {
      const next = events[0];
      setEvents(prev => prev.slice(1));
      setCurrentEvent(next);
    }
  }, [events, currentEvent]);

  // Handle auto-dismiss timers
  useEffect(() => {
    if (!currentEvent) return;

    if (currentEvent.type === 'evolution') {
      // Evolution sequence
      setEvolutionPhase('flash');
      setTimeout(() => setEvolutionPhase('morph'), 800);
      setTimeout(() => setEvolutionPhase('done'), 2000);
      timerRef.current = setTimeout(() => {
        setCurrentEvent(null);
        setEvolutionPhase(null);
      }, 4000);
    } else {
      // Level up — show for a few seconds
      timerRef.current = setTimeout(() => {
        setCurrentEvent(null);
      }, 2500);
    }

    return () => clearTimeout(timerRef.current);
  }, [currentEvent]);

  const dismiss = () => {
    clearTimeout(timerRef.current);
    setCurrentEvent(null);
    setEvolutionPhase(null);
  };

  if (!currentEvent) return null;

  if (currentEvent.type === 'levelUp') {
    return (
      <div className="levelup-overlay" onClick={dismiss}>
        <div className="levelup-box">
          <img
            src={getSpriteUrl(currentEvent.pokemon.id)}
            alt={currentEvent.pokemon.name}
            className="levelup-sprite"
          />
          <div className="levelup-text">
            <span className="levelup-name">{currentEvent.pokemon.name}</span>
            <span className="levelup-msg">grew to Lv. {currentEvent.pokemon.level}!</span>
          </div>
        </div>
      </div>
    );
  }

  if (currentEvent.type === 'evolution') {
    return (
      <div className="evolution-overlay" onClick={dismiss}>
        <div className="evolution-box">
          {evolutionPhase === 'flash' && (
            <>
              <div className="evo-flash" />
              <p className="evo-text">What? {currentEvent.fromName} is evolving!</p>
            </>
          )}
          {evolutionPhase === 'morph' && (
            <>
              <div className="evo-morph-container">
                <img
                  src={getSpriteUrl(currentEvent.fromId)}
                  alt={currentEvent.fromName}
                  className="evo-sprite evo-fade-out"
                />
                <img
                  src={getSpriteUrl(currentEvent.toId)}
                  alt={currentEvent.toName}
                  className="evo-sprite evo-fade-in"
                />
              </div>
              <p className="evo-text">Evolving...</p>
            </>
          )}
          {evolutionPhase === 'done' && (
            <>
              <img
                src={getSpriteUrl(currentEvent.toId)}
                alt={currentEvent.toName}
                className="evo-sprite evo-final"
              />
              <p className="evo-text">
                {currentEvent.fromName} evolved into<br />
                <strong>{currentEvent.toName}</strong>!
              </p>
            </>
          )}
        </div>
      </div>
    );
  }

  return null;
}
