import { useState, useEffect } from 'react';
import gameState from '../data/gameState';
import EventBus from '../game/EventBus';
import audioManager from '../data/audioManager';
import SpriteSheetFrame from './SpriteSheetFrame';
import './LoadingStyles.css';

const INTRO_BG_FRAMES = [
  './assets/intro/intro_bg_1.png',
  './assets/intro/intro_bg_2.png',
  './assets/intro/intro_bg_3.png',
  './assets/intro/intro_bg_4.png',
  './assets/intro/intro_bg_5.png',
  './assets/intro/intro_bg_6.png',
];

const CINEMATIC_SCENE = {
  battleBg: './assets/intro/intro_gengar_nidorino_bg.png',
  grass: './assets/intro/intro_gengar_nidorino_grass.png',
  gengar: './assets/intro/intro_gengar_nidorino_gengar.png',
  nidorino: './assets/intro/intro_gengar_nidorino_nidorino.png',
};

const CINEMATIC_RISE_SCENE = {
  bg: './assets/intro/intro_gengar_nidorino_nidorino_bg_down.png',
  gengarUp: './assets/intro/intro_gengar_nidorino_gengar_up.png',
};

const CINEMATIC_BATTLE_SCENE = {
  bg: './assets/intro/battle_bg.png',
  gengarFrames: './assets/intro/battle_gengar_frames.png',
  gengarAttacks: './assets/intro/battle_gengar_attacks.png',
  nidorinoFrames: './assets/intro/battle_nidorino_frames.png',
  nidorinoEffects: './assets/intro/battle_nidorino_effects.png',
  grass: './assets/intro/battle_grass_moving.png',
};

const START_SCREEN_FLAME_SPRITES = Array.from(
  { length: 10 },
  (_, index) => `./assets/intro/start_screen_flame_${String(index + 1).padStart(2, '0')}.png`,
);

const START_SCREEN_TITLE = 'PORTFOLIO'.split('');

const START_SCREEN_SCENE = {
  initial: './assets/intro/start_screen_initial.png',
  bg: './assets/intro/start_screen_bg.png',
  charizard: './assets/intro/start_screen_charizard.png',
  flames: START_SCREEN_FLAME_SPRITES,
};

const startScreenNoise = (seed) => {
  const value = Math.sin(seed * 91.7) * 10000;
  return value - Math.floor(value);
};

const START_SCREEN_FLAME_PARTICLES = Array.from({ length: 44 }, (_, index) => {
  const lane = index % 22;
  const spriteIndex = index % START_SCREEN_FLAME_SPRITES.length;
  const offset = startScreenNoise(index + 1) * 3.4 - 1.7;
  const x = Math.min(69, Math.max(1, 2 + lane * 3.08 + offset));

  return {
    id: `start-flame-${index}`,
    src: START_SCREEN_FLAME_SPRITES[spriteIndex],
    x,
    drift: Math.round(startScreenNoise(index + 101) * 30 - 15),
    duration: `${(0.95 + startScreenNoise(index + 201) * 0.75).toFixed(2)}s`,
    delay: `${(-startScreenNoise(index + 301) * 1.7).toFixed(2)}s`,
    scale: (0.78 + startScreenNoise(index + 401) * 0.65).toFixed(2),
    opacity: (0.58 + startScreenNoise(index + 501) * 0.36).toFixed(2),
  };
});

const BATTLE_GENGAR_FRAMES = [
  { sourceX: 0, sourceY: 0, sourceWidth: 387, sourceHeight: 412 },
  { sourceX: 387, sourceY: 0, sourceWidth: 387, sourceHeight: 412 },
  { sourceX: 774, sourceY: 0, sourceWidth: 387, sourceHeight: 412 },
  { sourceX: 1161, sourceY: 0, sourceWidth: 387, sourceHeight: 412 },
];

const BATTLE_GENGAR_ATTACKS = [
  { sourceX: 8, sourceY: 0, sourceWidth: 104, sourceHeight: 412 },
  { sourceX: 180, sourceY: 0, sourceWidth: 52, sourceHeight: 412 },
];

const BATTLE_NIDORINO_FRAMES = [
  { sourceX: 0, sourceY: 0, sourceWidth: 259, sourceHeight: 256 },
  { sourceX: 259, sourceY: 0, sourceWidth: 259, sourceHeight: 256 },
  { sourceX: 518, sourceY: 0, sourceWidth: 259, sourceHeight: 256 },
  { sourceX: 777, sourceY: 0, sourceWidth: 259, sourceHeight: 256 },
  { sourceX: 1036, sourceY: 0, sourceWidth: 260, sourceHeight: 256 },
];

const BATTLE_NIDORINO_EFFECTS = [
  { sourceX: 16, sourceY: 0, sourceWidth: 28, sourceHeight: 64 },
  { sourceX: 76, sourceY: 0, sourceWidth: 56, sourceHeight: 64 },
  { sourceX: 144, sourceY: 0, sourceWidth: 57, sourceHeight: 64 },
  { sourceX: 212, sourceY: 0, sourceWidth: 56, sourceHeight: 64 },
];

const imageExists = (src) => new Promise((resolve) => {
  const img = new Image();
  img.onload = () => resolve(true);
  img.onerror = () => resolve(false);
  img.src = src;
});

export default function StarterSelect() {
  const [visible, setVisible] = useState(!gameState.hasSelectedStarter);
  const [phase, setPhase] = useState('loading');
  const [loadingPercentage, setLoadingPercentage] = useState(0);
  const [cinematicFrame, setCinematicFrame] = useState(0);
  const [cinematicStep, setCinematicStep] = useState('frames');
  const [battleScene, setBattleScene] = useState('idle');
  const [battleGengarFrame, setBattleGengarFrame] = useState(0);
  const [battleNidorinoFrame, setBattleNidorinoFrame] = useState(0);
  const [battleGengarAttackFrame, setBattleGengarAttackFrame] = useState(0);
  const [battleNidorinoEffectFrame, setBattleNidorinoEffectFrame] = useState(-1);

  const enterMap = () => {
    audioManager.play('pallet_town', true);
    gameState.completeIntro();
    setVisible(false);
    EventBus.emit('unblockInput');
  };

  useEffect(() => {
    const unsub = EventBus.on('playIntro', () => {
      setVisible(true);
      setPhase('loading');
      setLoadingPercentage(0);
      setCinematicStep('frames');
      setCinematicFrame(0);
      EventBus.emit('blockInput');
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    if (!gameState.hasSelectedStarter) {
      EventBus.emit('blockInput');

      const requiredAssets = [
        ...INTRO_BG_FRAMES,
        CINEMATIC_SCENE.battleBg,
        CINEMATIC_SCENE.grass,
        CINEMATIC_SCENE.gengar,
        CINEMATIC_SCENE.nidorino,
        CINEMATIC_RISE_SCENE.bg,
        CINEMATIC_RISE_SCENE.gengarUp,
        CINEMATIC_BATTLE_SCENE.bg,
        CINEMATIC_BATTLE_SCENE.gengarFrames,
        CINEMATIC_BATTLE_SCENE.gengarAttacks,
        CINEMATIC_BATTLE_SCENE.nidorinoFrames,
        CINEMATIC_BATTLE_SCENE.nidorinoEffects,
        CINEMATIC_BATTLE_SCENE.grass,
        START_SCREEN_SCENE.initial,
        START_SCREEN_SCENE.bg,
        START_SCREEN_SCENE.charizard,
        ...START_SCREEN_SCENE.flames,
      ];

      let loaded = 0;
      setLoadingPercentage(0);
      setPhase('loading');

      requiredAssets.forEach((src) => {
        const img = new Image();
        img.onload = img.onerror = () => {
          loaded++;
          setLoadingPercentage(Math.floor((loaded / requiredAssets.length) * 100));
        };
        img.src = src;
      });
    }
  }, []);

  useEffect(() => {
    if (!visible || phase !== 'cinematic') return;

    if (cinematicStep === 'frames') {
      audioManager.play('opening', true);
      const timer = setInterval(() => {
        setCinematicFrame((prev) => {
          const next = prev + 1;
          if (next >= INTRO_BG_FRAMES.length) {
            setCinematicStep('stare');
            return INTRO_BG_FRAMES.length - 1;
          }
          return next;
        });
      }, 300);

      return () => clearInterval(timer);
    }

    if (cinematicStep === 'stare') {
      const timer = setTimeout(() => {
        setCinematicStep('rise');
      }, 2000);

      return () => clearTimeout(timer);
    }

    if (cinematicStep === 'rise') {
      const timer = setTimeout(() => {
        setCinematicStep('battle');
      }, 2000);

      return () => clearTimeout(timer);
    }

    if (cinematicStep === 'battle') {
      const timers = [];
      const startDelay = 40;
      const approachDuration = 700;
      const stareDuration = 1500;
      const attackDuration = 700;
      const defenseDuration = 1250;
      const pauseAfterLandingDuration = 1500;
      const leapDuration = 1250;

      timers.push(setTimeout(() => {
        setBattleScene('hidden');
        setBattleGengarFrame(0);
        setBattleNidorinoFrame(0);
        setBattleGengarAttackFrame(0);
        setBattleNidorinoEffectFrame(-1);
      }, 0));

      timers.push(setTimeout(() => setBattleScene('approach'), startDelay));
      timers.push(setTimeout(() => setBattleScene('stare'), startDelay + approachDuration));
      timers.push(setTimeout(() => setBattleNidorinoFrame(0), startDelay + approachDuration));
      timers.push(setTimeout(() => setBattleNidorinoFrame(1), startDelay + approachDuration + 700));

      timers.push(setTimeout(() => {
        setBattleScene('attack');
        setBattleGengarAttackFrame(0);
        setBattleNidorinoEffectFrame(0);
      }, startDelay + approachDuration + stareDuration));
      timers.push(setTimeout(() => setBattleGengarFrame(1), startDelay + approachDuration + stareDuration + 120));
      timers.push(setTimeout(() => setBattleGengarFrame(2), startDelay + approachDuration + stareDuration + 260));
      timers.push(setTimeout(() => setBattleGengarFrame(3), startDelay + approachDuration + stareDuration + 400));
      timers.push(setTimeout(() => setBattleGengarAttackFrame(1), startDelay + approachDuration + stareDuration + 560));
      timers.push(setTimeout(() => setBattleNidorinoEffectFrame(1), startDelay + approachDuration + stareDuration + 180));
      timers.push(setTimeout(() => setBattleNidorinoEffectFrame(2), startDelay + approachDuration + stareDuration + 320));
      timers.push(setTimeout(() => setBattleNidorinoEffectFrame(3), startDelay + approachDuration + stareDuration + 560));

      timers.push(setTimeout(() => {
        setBattleScene('defense');
        setBattleNidorinoFrame(2);
        setBattleNidorinoEffectFrame(-1);
      }, startDelay + approachDuration + stareDuration + attackDuration));
      timers.push(setTimeout(() => setBattleNidorinoFrame(3), startDelay + approachDuration + stareDuration + attackDuration + 600));
      timers.push(setTimeout(() => setBattleNidorinoFrame(0), startDelay + approachDuration + stareDuration + attackDuration + defenseDuration));

      timers.push(setTimeout(() => {
        setBattleScene('leap');
        setBattleNidorinoFrame(4);
      }, startDelay + approachDuration + stareDuration + attackDuration + defenseDuration + pauseAfterLandingDuration));

      timers.push(setTimeout(() => setBattleScene('settle'), startDelay + approachDuration + stareDuration + attackDuration + defenseDuration + pauseAfterLandingDuration + leapDuration));
      timers.push(setTimeout(() => {
        setCinematicStep('start');
        audioManager.play('title', true);
      }, startDelay + approachDuration + stareDuration + attackDuration + defenseDuration + pauseAfterLandingDuration + leapDuration + 450));

      return () => timers.forEach(clearTimeout);
    }
  }, [phase, cinematicStep, visible]);

  useEffect(() => {
    if (!visible || phase !== 'cinematic' || cinematicStep !== 'start') return;

    const handleStart = (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        enterMap();
      }
    };

    window.addEventListener('keydown', handleStart);
    return () => window.removeEventListener('keydown', handleStart);
  }, [visible, phase, cinematicStep]);

  if (!visible) return null;

  const handleStartGame = () => {
    // Attempt landscape lock
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen().then(() => {
        if (window.screen && window.screen.orientation && window.screen.orientation.lock) {
          window.screen.orientation.lock('landscape').catch(() => {});
        }
      }).catch(() => {});
    }

    setPhase('cinematic');
    setCinematicStep('frames');
    setCinematicFrame(0);
    
    // Emit event so BootScene can lazy load everything else
    EventBus.emit('beginLazyLoad');
    
    // Preload audio files in background
    audioManager.preloadAll();
  };

  const handleCinematicClick = () => {
    if (cinematicStep === 'start') {
      enterMap();
    }
  };

  return (
    <div className="starter-overlay">
      {phase === 'loading' && (
        <div className="loading-screen-wrap">
          {loadingPercentage < 100 ? (
            <div className="loading-content">
              <h2>LOADING...</h2>
              <div className="loading-bar-border">
                <div className="loading-bar-fill" style={{ width: `${loadingPercentage}%` }} />
              </div>
              <p>{loadingPercentage}%</p>
            </div>
          ) : (
            <div className="start-content">
              <button className="start-button" onClick={handleStartGame}>START GAME</button>
              <p className="desktop-hint">Desktop is recommended for the best experience.</p>
            </div>
          )}
        </div>
      )}

      {phase === 'cinematic' && (
        <div className="starter-cinematic" onClick={handleCinematicClick}>
          {cinematicStep === 'frames' && (
            <img
              src={INTRO_BG_FRAMES[cinematicFrame]}
              alt="Intro scene"
              className="cinematic-frame"
              draggable={false}
            />
          )}

          {cinematicStep === 'stare' && (
            <div className="cinematic-battle-wrap">
              <div className="cinematic-bg-viewport">
                <div className="cinematic-scroll-track cinematic-scroll-right">
                  <img src={CINEMATIC_SCENE.battleBg} alt="" draggable={false} className="cinematic-strip-image" />
                  <img src={CINEMATIC_SCENE.battleBg} alt="" draggable={false} className="cinematic-strip-image" />
                </div>
              </div>
              <img src={CINEMATIC_SCENE.gengar} alt="Gengar" className="cinematic-gengar" draggable={false} />
              <img src={CINEMATIC_SCENE.nidorino} alt="Nidorino" className="cinematic-nidorino" draggable={false} />
              <div className="cinematic-grass-viewport">
                <div className="cinematic-scroll-track cinematic-scroll-left">
                  <img src={CINEMATIC_SCENE.grass} alt="" draggable={false} className="cinematic-strip-image" />
                  <img src={CINEMATIC_SCENE.grass} alt="" draggable={false} className="cinematic-strip-image" />
                </div>
              </div>
            </div>
          )}

          {cinematicStep === 'rise' && (
            <div className="cinematic-rise-wrap">
              <img src={CINEMATIC_RISE_SCENE.bg} alt="Intro rise scene" className="cinematic-rise-bg" draggable={false} />
              <div className="cinematic-rise-bar cinematic-rise-bar-top" />
              <div className="cinematic-rise-bar cinematic-rise-bar-bottom" />
              <img src={CINEMATIC_RISE_SCENE.gengarUp} alt="Gengar" className="cinematic-rise-gengar" draggable={false} />
            </div>
          )}

          {cinematicStep === 'battle' && (
            <div className={`cinematic-battle-final battle-final-${battleScene}`}>
              <div className={`battle-layer battle-bg ${battleScene === 'approach' ? 'fast' : 'slow'}`}>
                <div className="battle-track">
                  <img src={CINEMATIC_BATTLE_SCENE.bg} alt="" draggable={false} className="battle-track-image" />
                  <img src={CINEMATIC_BATTLE_SCENE.bg} alt="" draggable={false} className="battle-track-image" />
                  <img src={CINEMATIC_BATTLE_SCENE.bg} alt="" draggable={false} className="battle-track-image" />
                  <img src={CINEMATIC_BATTLE_SCENE.bg} alt="" draggable={false} className="battle-track-image" />
                </div>
              </div>

              <div className={`battle-grass battle-grass-${battleScene}`}>
                <img src={CINEMATIC_BATTLE_SCENE.grass} alt="" draggable={false} className="battle-grass-image" />
              </div>

              <div className={`battle-gengar battle-gengar-${battleScene}`}>
                <SpriteSheetFrame
                  src={CINEMATIC_BATTLE_SCENE.gengarFrames}
                  {...BATTLE_GENGAR_FRAMES[Math.min(battleGengarFrame, BATTLE_GENGAR_FRAMES.length - 1)]}
                  scale={0.82}
                  className="battle-sprite"
                />
                {battleScene === 'attack' && (
                  <SpriteSheetFrame
                    src={CINEMATIC_BATTLE_SCENE.gengarAttacks}
                    {...BATTLE_GENGAR_ATTACKS[battleGengarAttackFrame]}
                    scale={0.82}
                    className="battle-attack"
                  />
                )}
              </div>

              <div className={`battle-nidorino battle-nidorino-${battleScene}`}>
                <SpriteSheetFrame 
                  src={CINEMATIC_BATTLE_SCENE.nidorinoFrames} 
                  {...BATTLE_NIDORINO_FRAMES[battleNidorinoFrame]} 
                  scale={0.92}
                  className="battle-sprite" 
                />
                {(battleScene === 'attack' || battleScene === 'defense') && battleNidorinoEffectFrame >= 0 && (
                  <SpriteSheetFrame 
                    src={CINEMATIC_BATTLE_SCENE.nidorinoEffects} 
                    {...BATTLE_NIDORINO_EFFECTS[battleNidorinoEffectFrame]} 
                    scale={0.78}
                    className="battle-effects"
                  />
                )}
              </div>
            </div>
          )}

          {cinematicStep === 'start' && (
            <div className="cinematic-start-screen">
              <div className="start-screen-stage">
                <img src={START_SCREEN_SCENE.initial} alt="" className="start-screen-initial" draggable={false} />
                <img src={START_SCREEN_SCENE.bg} alt="Start screen" className="start-screen-bg" draggable={false} />
                <div className="start-screen-flame-layer" aria-hidden="true">
                  {START_SCREEN_FLAME_PARTICLES.map((flame) => (
                    <img
                      key={flame.id}
                      src={flame.src}
                      alt=""
                      className="start-screen-flame"
                      draggable={false}
                      style={{
                        left: `${flame.x}%`,
                        '--flame-drift': `${flame.drift}px`,
                        '--flame-duration': flame.duration,
                        '--flame-delay': flame.delay,
                        '--flame-scale': flame.scale,
                        '--flame-opacity': flame.opacity,
                      }}
                    />
                  ))}
                </div>
                <img src={START_SCREEN_SCENE.charizard} alt="Charizard" className="start-screen-charizard" draggable={false} />
                <div className="start-screen-title-wrap" aria-label="Portfolio title">
                  <div className="start-screen-title-layer start-screen-title-hollow" aria-hidden="true">
                    {START_SCREEN_TITLE.map((letter, index) => (
                      <span key={`hollow-${letter}-${index}`}>{letter}</span>
                    ))}
                  </div>
                  <div className="start-screen-title-layer start-screen-title-solid">
                    {START_SCREEN_TITLE.map((letter, index) => (
                      <span key={`solid-${letter}-${index}`}>{letter}</span>
                    ))}
                  </div>
                </div>
                <div className="start-screen-version" aria-label="Ankit Arsh">
                  <span>ANKIT</span>
                  <span>ARSH</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
