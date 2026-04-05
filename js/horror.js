class HorrorSystem {
  constructor() {
    this.audioContext = null;
    this.sounds = {};
    this.ambientAudio = null;
    this.ambientTimer = null;
    this.ambientKey = null;
    this.currentRoom = null;
    this.fileSoundMap = {
      ghost_groan: 'sounds/ghost_groan.mp3',
      ghost_reappear: 'sounds/ghost_reappear.mp3',
      stalker_breath: 'sounds/stalker_breath.mp3',
      stalker_attack: 'sounds/stalker_attack.mp3',
      stalker_whisper: 'sounds/stalker_whisper.mp3',
      stalker_growl: 'sounds/stalker_growl.mp3',
      crawler_screech: 'sounds/crawler_screech.mp3',
      crawler_stun: 'sounds/crawler_stun.mp3',
      heartbeat: 'sounds/heartbeat.mp3',
      jumpscare: 'sounds/jumpscare.mp3',
      damage: 'sounds/damage.mp3',
      door_open: 'sounds/door.mp3',
      door_close: 'sounds/door.mp3',
      battery_pickup: 'sounds/recoger_pila.mp3',
      key_pickup: 'sounds/recoger_llave.mp3',
      lever_activate: 'sounds/lever_activate.mp3',
      box_activate: 'sounds/box_activate.mp3'
    };
    this.scareLevel = 0;           // 0-100 (nivel de pánico del jugador)
    this.maxScareLevel = 100;
    this.scareDecreaseRate = 3;    // Por segundo en seguridad
    
    // Efectos visuales
    this.useScreenFX = true;
    this.vignette = null;          // Oscurecimiento en bordes
    this.bloodStain = null;
    this.screenShake = 0;
    
    // Sonidos activos
    this.activeSounds = [];
    this.soundPool = {};

    // Música/ambiente por habitación
    this.ambientMap = {
      0: { file: 'sounds/fondo.mp3',               volume: 0.22, loop: true  },
      1: { file: 'sounds/laboratory.mp3',          volume: 0.18, loop: true  },
      2: { file: 'sounds/cocina.mp3',              volume: 0.16, loop: true  },
      3: { file: 'sounds/biblioteca.mp3',          volume: 0.14, loop: true  },
      4: { file: 'sounds/sotano.mp3',              volume: 0.20, loop: true  },
      5: { file: 'sounds/secreto.mp3',             volume: 0.19, loop: true  },
      6: { file: 'sounds/morgue.mp3',              volume: 0.18, loop: true  },
      7: { file: 'sounds/final.mp3',               volume: 0.24, loop: true  }
    };
  }

  init() {
    try {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      console.log('Horror System inicializado');
    } catch(e) {
      console.warn('Web Audio API no disponible:', e);
    }
  }


  playSound(soundName, volume = 1.0, loop = false) {
    const filePath = this.fileSoundMap[soundName];

    if (filePath) {
      this.playFileSound(filePath, volume, loop);
      return;
    }

    if (!this.audioContext) return;

    // Si no tiene archivo de sonido, generar sonido sintético
    this.synthesizeSound(soundName, volume);
  }

  playFileSound(filePath, volume = 1.0, loop = false) {
    const audio = new Audio(filePath);
    audio.volume = Math.max(0, Math.min(1, volume));
    audio.loop = !!loop;
    audio.preload = 'auto';
    this.activeSounds.push(audio);

    audio.addEventListener('ended', () => {
      const idx = this.activeSounds.indexOf(audio);
      if (idx !== -1) {
        this.activeSounds.splice(idx, 1);
      }
    });

    audio.play().catch(function() {
      // Si el navegador bloquea el autoplay, no hacemos nada.
    });
    return audio;
  }

  stopAmbient() {
    if (this.ambientTimer) {
      clearTimeout(this.ambientTimer);
      this.ambientTimer = null;
    }
    if (this.ambientAudio) {
      this.ambientAudio.pause();
      this.ambientAudio.currentTime = 0;
      this.ambientAudio = null;
    }
    this.ambientKey = null;
  }

  playAmbient(roomId) {
    const cfg = this.ambientMap.hasOwnProperty(roomId) ? this.ambientMap[roomId] : this.ambientMap[0];
    const key = String(roomId in this.ambientMap ? roomId : 0);

    if (this.ambientKey === key && this.ambientAudio) return;

    this.stopAmbient();

    const startAmbient = () => {
      const audio = new Audio(cfg.file);
      audio.volume = cfg.volume;
      audio.loop = !!cfg.loop;
      audio.preload = 'auto';
      audio.play().catch(function() {
        // Si el navegador bloquea el autoplay, no hacemos nada.
      });
      this.ambientAudio = audio;
      this.ambientKey = key;

      // Si no es loop, repetir según duración del archivo.
      if (!cfg.loop) {
        const repeatMs = cfg.repeatMs || 25000;
        this.ambientTimer = setTimeout(() => {
          this.ambientTimer = null;
          if (this.currentRoom === roomId) {
            this.stopAmbient();
            this.playAmbient(roomId);
          }
        }, repeatMs);
      }
    };

    startAmbient();
  }


  synthesizeSound(soundName, volume) {
    const ctx = this.audioContext;
    
    switch(soundName) {
      case 'ghost_groan':
        // Sonido bajo y cavernoso
        this.playTone(ctx, 50, 100, 0.8, 'sine', volume * 0.7);
        break;
        
      case 'ghost_reappear':
        // Sonido etéreo de reaparición
        this.playTone(ctx, 200, 50, 0.5, 'sine', volume);
        this.playTone(ctx, 300, 50, 0.3, 'sine', volume * 0.5);
        break;
        
      case 'stalker_breath':
        // Respiración pesada y perturbadora
        this.playNoise(ctx, 300, 0.3, volume * 0.6);
        break;
        
      case 'stalker_attack':
        // Grito aterrador
        this.playTone(ctx, 150, 200, 1.0, 'sawtooth', volume);
        break;
        
      case 'stalker_whisper':
        // Susurro inquietante
        this.playNoise(ctx, 4000, 0.2, volume * 0.4);
        break;
        
      case 'stalker_growl':
        // Gruñido profundo
        this.playTone(ctx, 80, 150, 0.6, 'sawtooth', volume * 0.8);
        break;
        
      case 'crawler_screech':
        // Grito estridente de insecto
        this.playTone(ctx, 1500, 100, 0.9, 'sine', volume);
        this.playTone(ctx, 1200, 100, 0.7, 'sine', volume * 0.7);
        break;
        
      case 'crawler_stun':
        // Sonido de aturdimiento
        this.playTone(ctx, 800, 200, 0.8, 'sine', volume);
        break;
        
      case 'heartbeat':
        // Latido cardíaco acelerado
        this.playPulse(ctx, 40, 0.5, volume * 0.5);
        break;
        
      case 'jumpscare':
        // SUSTO FUERTE
        this.playNoise(ctx, 8000, 0.3, volume);
        this.playTone(ctx, 300, 200, 0.8, 'sawtooth', volume * 0.8);
        break;
        
      case 'damage':
        // Sonido de daño recibido
        this.playTone(ctx, 200, 100, 0.7, 'sine', volume);
        this.playNoise(ctx, 5000, 0.1, volume * 0.5);
        break;

      case 'door_open':
        // Golpe metalico corto ascendente
        this.playTone(ctx, 180, 80, 0.45, 'triangle', volume);
        this.playTone(ctx, 260, 60, 0.30, 'triangle', volume * 0.8);
        break;

      case 'door_close':
        // Cierre seco descendente
        this.playTone(ctx, 220, 70, 0.45, 'square', volume);
        this.playTone(ctx, 120, 90, 0.35, 'square', volume * 0.9);
        break;

      case 'battery_pickup':
        // Pickup brillante
        this.playTone(ctx, 520, 70, 0.35, 'sine', volume);
        this.playTone(ctx, 780, 90, 0.28, 'sine', volume * 0.9);
        break;

      case 'key_pickup':
        // Tinte metalico corto para llave
        this.playTone(ctx, 660, 55, 0.35, 'triangle', volume);
        this.playTone(ctx, 980, 75, 0.28, 'triangle', volume * 0.85);
        break;

      case 'lever_activate':
        // Activacion electrica
        this.playTone(ctx, 140, 120, 0.45, 'sawtooth', volume);
        this.playNoise(ctx, 1800, 0.15, volume * 0.35);
        break;

      case 'box_activate':
        // Encendido de sistema
        this.playTone(ctx, 90, 180, 0.4, 'triangle', volume);
        this.playTone(ctx, 170, 220, 0.25, 'triangle', volume * 0.8);
        break;
    }
  }


  playTone(ctx, frequency, duration, amplitude, type, volume) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = type;
    osc.frequency.value = frequency;
    gain.gain.setValueAtTime(amplitude * volume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration / 1000);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + duration / 1000);
  }

  playNoise(ctx, frequency, duration, volume) {
    const bufferSize = ctx.sampleRate * (duration / 1000);
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }
    
    const source = ctx.createBufferSource();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();
    
    filter.type = 'highpass';
    filter.frequency.value = frequency;
    
    source.buffer = noiseBuffer;
    gain.gain.setValueAtTime(volume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration / 1000);
    
    source.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    
    source.start(ctx.currentTime);
  }

  playPulse(ctx, frequency, duration, volume) {
    this.playTone(ctx, frequency, 80, volume, 'sine', 1.0);
    setTimeout(() => {
      this.playTone(ctx, frequency + 20, 60, volume * 0.7, 'sine', 1.0);
    }, 100);
  }


  triggerJumpscare(reason) {
    // Sonido aterrador
    this.playSound('jumpscare', 1.0);
    
    // Efecto visual: destello y cambio de color
    if (canvas) {
      canvas.style.filter = 'brightness(0.6) hue-rotate(30deg)';
      setTimeout(() => {
        canvas.style.filter = 'brightness(1) hue-rotate(0deg)';
      }, 200);
    }
    
    // Aumentar miedo
    this.scareLevel = Math.min(100, this.scareLevel + 40);
    
    // Screen shake
    this.screenShake = 0.5;
  }

  playEnemySound(enemyType) {
    const soundMap = {
      'ghost': ['ghost_groan', 'ghost_reappear'],
      'stalker': ['stalker_breath', 'stalker_whisper', 'stalker_growl'],
      'crawler': ['crawler_screech']
    };
    
    const sounds = soundMap[enemyType] || [];
    if (sounds.length > 0) {
      const sound = sounds[Math.floor(Math.random() * sounds.length)];
      this.playSound(sound, 0.7);
    }
  }

  updateAmbience(roomId) {
    if (this.currentRoom === roomId) return;
    
    this.currentRoom = roomId;

    this.playAmbient(roomId);
  }

  updateScareLevel(dt, playerInDanger) {
    if (playerInDanger) {
      this.scareLevel = Math.min(100, this.scareLevel + dt * 30);
    } else {
      this.scareLevel = Math.max(0, this.scareLevel - dt * this.scareDecreaseRate);
    }
    
    // Reproducir latido cardíaco si tiene pánico
    if (this.scareLevel > 70 && Math.random() < dt * 0.3) {
      this.playSound('heartbeat', 0.4);
    }
  }

  applyDamageEffect(amount) {
    this.playSound('damage', 0.8);
    this.scareLevel += amount * 5;
    this.screenShake = Math.min(1, this.screenShake + amount * 0.1);
    
    // Destello rojo de daño
    if (canvas) {
      canvas.style.filter = 'brightness(1.2) hue-rotate(10deg)';
      setTimeout(() => {
        canvas.style.filter = 'brightness(1) hue-rotate(0deg)';
      }, 150);
    }
  }

  updateVignette() {
    const vignetteStrength = this.scareLevel / 100;
    const css = `radial-gradient(circle, transparent 0%, rgba(0,0,0,${vignetteStrength * 0.5}) 100%)`;
    
    // Se aplicaría mediante un canvas overlay en main.js
    return css;
  }

  getScreenShakeOffset() {
    if (this.screenShake <= 0) return { x: 0, y: 0 };
    
    this.screenShake -= 0.03;
    return {
      x: (Math.random() - 0.5) * this.screenShake * 2,
      y: (Math.random() - 0.5) * this.screenShake * 2
    };
  }


  debug() {
    return {
      scareLevel: Math.round(this.scareLevel),
      activeEnemies: enemies.length,
      currentRoom: this.currentRoom
    };
  }
}

// Instancia global
var horrorSystem = new HorrorSystem();
