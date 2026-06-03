import { useState, useEffect, useCallback, useRef } from 'react';
import EventBus from '../game/EventBus';
import { portfolio } from '../data/portfolio';
import gameState from '../data/gameState';

/**
 * DialogueBox — Authentic FireRed-style dialogue box with typewriter text.
 * Rendered as a React overlay on top of the Phaser canvas.
 */
export default function DialogueBox() {
  const [visible, setVisible] = useState(false);
  const [text, setText] = useState('');
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [dialogueQueue, setDialogueQueue] = useState([]);
  const [queueIndex, setQueueIndex] = useState(0);
  const [menuSection, setMenuSection] = useState(null);
  const [showArrow, setShowArrow] = useState(false);
  const [activeDialogueKey, setActiveDialogueKey] = useState(null);
  const typingRef = useRef(null);
  const fullTextRef = useRef('');

  // Listen for dialogue events from Phaser
  useEffect(() => {
    const unsub = EventBus.on('showDialogue', ({ dialogueKey, menuSection: ms, customText }) => {
      const lines = customText || portfolio.dialogues[dialogueKey] || ['...'];
      setDialogueQueue(lines);
      setQueueIndex(0);
      setText(lines[0]);
      fullTextRef.current = lines[0];
      setDisplayedText('');
      setIsTyping(true);
      setShowArrow(false);
      setMenuSection(ms);
      setActiveDialogueKey(dialogueKey);
      setVisible(true);
      EventBus.emit('blockInput');
    });

    return () => unsub();
  }, []);

  // Typewriter effect
  useEffect(() => {
    if (!isTyping || !text) return;

    let charIndex = 0;
    setDisplayedText('');
    setShowArrow(false);

    typingRef.current = setInterval(() => {
      charIndex++;
      setDisplayedText(text.slice(0, charIndex));

      if (charIndex >= text.length) {
        clearInterval(typingRef.current);
        setIsTyping(false);
        setShowArrow(true);
      }
    }, 30);

    return () => clearInterval(typingRef.current);
  }, [text, isTyping]);

  // Advance dialogue or close
  const advance = useCallback(() => {
    if (isTyping) {
      // Skip to full text
      clearInterval(typingRef.current);
      setDisplayedText(fullTextRef.current);
      setIsTyping(false);
      setShowArrow(true);
      return;
    }

    const nextIndex = queueIndex + 1;
    if (nextIndex < dialogueQueue.length) {
      // Show next line
      setQueueIndex(nextIndex);
      const nextText = dialogueQueue[nextIndex];
      setText(nextText);
      fullTextRef.current = nextText;
      setIsTyping(true);
      setShowArrow(false);
    } else {
      // End of dialogue
      if (menuSection) {
        // Open menu after dialogue
        setVisible(false);
        EventBus.emit('showMenu', { section: menuSection });
      } else {
        close();
      }
    }
  }, [isTyping, queueIndex, dialogueQueue, menuSection]);

  const close = useCallback(() => {
    // Post-dialogue effects
    if (activeDialogueKey === 'nurseJoy') {
      gameState.healAll();
    } else if (activeDialogueKey && activeDialogueKey.startsWith('portfolio_intro_')) {
      const key = activeDialogueKey.replace('portfolio_intro_', '');
      setTimeout(() => {
        EventBus.emit('openPortfolioOverlay', { interiorKey: key });
      }, 100);
    }
    setVisible(false);
    setDialogueQueue([]);
    setQueueIndex(0);
    setActiveDialogueKey(null);
    EventBus.emit('unblockInput');
  }, [activeDialogueKey]);

  // Keyboard listener
  useEffect(() => {
    if (!visible) return;

    const handleKey = (e) => {
      if (e.key === ' ' || e.key === 'Enter' || e.key === 'z') {
        e.preventDefault();
        advance();
      }
      if (e.key === 'Escape' || e.key === 'x') {
        e.preventDefault();
        close();
      }
    };

    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [visible, advance, close]);

  if (!visible) return null;

  return (
    <div className="dialogue-overlay" onClick={advance}>
      <div className="dialogue-box">
        <div className="dialogue-text">
          {displayedText}
        </div>
        {showArrow && (
          <div className="dialogue-arrow">▼</div>
        )}
      </div>
    </div>
  );
}
