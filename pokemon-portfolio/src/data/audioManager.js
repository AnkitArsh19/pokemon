class AudioManager {
  constructor() {
    this.currentTrack = null;
    this.currentAudio = null;
    this.nextTrackTimeout = null;
    
    this.tracks = {
      'opening': './assets/audio/02. Opening Movie.mp3',
      'title': './assets/audio/03. Title Screen.mp3',
      'pallet_town': './assets/audio/05. Pallet Town.mp3',
      'battle_wild': './assets/audio/12. Battle! (Wild Pokémon).mp3',
      'victory_wild': './assets/audio/13. Victory! (Wild Pokémon).mp3',
      'guide': './assets/audio/18. Guide.mp3'
    };
    
    this.volumes = {
      'opening': 0.5,
      'title': 0.5,
      'pallet_town': 0.3,
      'battle_wild': 0.4,
      'victory_wild': 0.4,
      'guide': 0.3
    };
    
    this.preloaded = false;
    this.wasPlayingBeforeHidden = false;
    
    // Handle tab visibility changes to pause/resume audio
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        if (this.currentAudio && !this.currentAudio.paused) {
          this.currentAudio.pause();
          this.wasPlayingBeforeHidden = true;
        }
      } else {
        if (this.currentAudio && this.wasPlayingBeforeHidden) {
          this.currentAudio.play().catch(e => console.warn('Could not resume audio:', e));
          this.wasPlayingBeforeHidden = false;
        }
      }
    });
  }
  
  play(trackName, loop = true) {
    if (this.nextTrackTimeout) {
      clearTimeout(this.nextTrackTimeout);
      this.nextTrackTimeout = null;
    }

    if (!this.tracks[trackName]) return;
    
    if (this.currentTrack === trackName && this.currentAudio) {
      // Already playing this track
      return;
    }
    
    this.stop();
    
    this.currentTrack = trackName;
    this.currentAudio = new Audio(this.tracks[trackName]);
    this.currentAudio.loop = loop;
    this.currentAudio.volume = this.volumes[trackName] || 0.5;
    this.wasPlayingBeforeHidden = false;
    
    // Play with catch to handle browser autoplay policies
    this.currentAudio.play().catch(e => {
      console.warn('Audio playback prevented by browser policy:', e);
      // Wait for user interaction to resume
      const resumeAudio = () => {
        if (this.currentAudio && this.currentTrack === trackName) {
          this.currentAudio.play();
        }
        document.removeEventListener('click', resumeAudio);
        document.removeEventListener('keydown', resumeAudio);
      };
      document.addEventListener('click', resumeAudio);
      document.addEventListener('keydown', resumeAudio);
    });
  }
  
  stop() {
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio.currentTime = 0;
    }
    this.currentAudio = null;
    this.currentTrack = null;
    this.wasPlayingBeforeHidden = false;
  }

  playAfterDelay(trackName, delay, loop = true) {
    if (this.nextTrackTimeout) {
      clearTimeout(this.nextTrackTimeout);
    }
    this.nextTrackTimeout = setTimeout(() => {
      this.play(trackName, loop);
    }, delay);
  }

  playSFX(sfxName, isMove = false) {
    let path = `./assets/audio/${sfxName}.mp3`;
    if (isMove) {
      path = `./assets/audio/GEN 3 SFX - Attack Moves - RSE, FR, LG/${sfxName}.mp3`;
    }
    
    const sfxAudio = new Audio(path);
    sfxAudio.volume = 0.5; // Default volume for SFX
    
    sfxAudio.play().catch(e => {
      console.warn(`SFX playback prevented for ${sfxName}:`, e);
    });
  }

  preloadAll() {
    if (this.preloaded) return;
    this.preloaded = true;
    
    // Background fetch audio files so they are ready when needed
    Object.values(this.tracks).forEach(path => {
      const a = new Audio();
      a.preload = "auto";
      a.src = path;
    });
  }
}

// Ensure a single global instance across the entire window
if (!window.__audioManagerInstance) {
  window.__audioManagerInstance = new AudioManager();
}

export default window.__audioManagerInstance;
