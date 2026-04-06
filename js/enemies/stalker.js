class Stalker extends Enemy {
  constructor(x, z, config) {
    super(x, z, 'stalker', config);
    
    this.darkModeSpeed = 12;        
    this.lightModeSpeed = 3;        
    this.currentSpeed = this.speed;
    this.hiddenOpacity = 0.6;      
    this.visibleOpacity = 1.0;
    this.hasUnnaturaGasp = false;
    this.strafeSign = Math.random() < 0.5 ? -1 : 1;
    this.strafeTimer = 0;
    this.passThroughSpeed = 10;
    this.isStunned = false;
    this.stunDuration = 0;
  }

  createMesh(THREE) {

    const geometry = new THREE.CapsuleGeometry(0.3, 1.5, 8, 16);
    
    this.material = new THREE.MeshPhongMaterial({
      color: 0x333333,
      emissive: 0x111111,
      emissiveIntensity: 0.3,
      transparent: true,
      opacity: 0.9,
      side: THREE.DoubleSide,
      wireframe: false
    });
    
    this.mesh = new THREE.Mesh(geometry, this.material);
    this.mesh.castShadow = false;
    this.mesh.receiveShadow = false;
    
    const eyeGeometry = new THREE.SphereGeometry(0.15, 8, 8);
    const eyeMaterial = new THREE.MeshBasicMaterial({ 
      color: 0xff0000,
      emissive: 0xff0000,
      emissiveIntensity: 1.0
    });
    
    const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    leftEye.position.set(-0.2, 0.4, 0.3);
    this.mesh.add(leftEye);
    
    const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    rightEye.position.set(0.2, 0.4, 0.3);
    this.mesh.add(rightEye);
    
    return this.mesh;
  }

  update(dt, playerPos, playerHealth, flashlightActive, flashlightPos) {
    if (this.isStunned) {
      this.stunDuration -= dt;
      this.opacity = 0.35;
      this.speed = 0;
      if (this.stunDuration <= 0) {
        this.isStunned = false;
        this.state = 'alert';
      }

      if (this.mesh) {
        this.mesh.position.set(this.position.x, 1.0, this.position.z);
        if (this.material) this.material.opacity = this.opacity;
      }
      return;
    }

    if (flashlightActive && this.distanceTo(flashlightPos) < 12) {
  
      this.speed = this.lightModeSpeed;
      this.opacity = this.visibleOpacity;
    } else {
    
      this.speed = this.darkModeSpeed;
      this.opacity = this.hiddenOpacity;
    }
    
    const distToPlayer = this.distanceTo(playerPos);
    const canSeePlayer = distToPlayer < this.detectionRange;
    
    switch(this.state) {
      case 'idle':
        if (canSeePlayer) {
          this.state = 'alert';
          this.timeSeenPlayer = 0;
        }
        break;
        
      case 'alert':
        this.timeSeenPlayer += dt;
  
        if (!flashlightActive) {
          this.delayBeforeAttack = 0.1; 
        } else {
          this.delayBeforeAttack = 0.5;
        }
        
        if (distToPlayer < this.attackRange && this.timeSeenPlayer > this.delayBeforeAttack) {
          this.state = 'attacking';
          this.hasAttackedPlayer = true;
          // Gritar cuando ataca
          horrorSystem.playSound('stalker_attack');
        } else if (!canSeePlayer) {
          if (Math.random() < 0.3) {
            // A veces sigue "el olor" del jugador
            this.targetPos = {
              x: playerPos.x + (Math.random() - 0.5) * 4,
              z: playerPos.z + (Math.random() - 0.5) * 4
            };
          } else {
            this.state = 'idle';
          }
        } else {
          this.moveCrossing(playerPos, dt);
        }
        break;
        
      case 'attacking':
        if (distToPlayer > this.attackRange + 3) {
          this.state = 'alert';
        } else {
          this.moveCrossing(playerPos, dt);
        }
        
        if (this.lastSoundTime > 1) {
          horrorSystem.playSound('stalker_breath');
          this.lastSoundTime = 0;
        }
        break;
    }
    
    if (canSeePlayer) {
      const angle = Math.atan2(playerPos.z - this.position.z, playerPos.x - this.position.x);
      this.mesh.rotation.y = angle;
    }
    
    if (this.mesh) {
      this.mesh.position.set(this.position.x, 1.0, this.position.z);
      if (this.material) {
        this.material.opacity = this.opacity;
      }
    }
    
    this.lastSoundTime += dt;
    this.strafeTimer += dt;
  }

  moveCrossing(playerPos, dt) {
    const vx = playerPos.x - this.position.x;
    const vz = playerPos.z - this.position.z;
    const dist = Math.sqrt(vx * vx + vz * vz);
    if (dist < 0.001) return;

    const nx = vx / dist;
    const nz = vz / dist;

    if (this.strafeTimer > 1.2) {
      this.strafeSign *= -1;
      this.strafeTimer = 0;
    }

    const px = -nz * this.strafeSign;
    const pz = nx * this.strafeSign;

    // Si está lejos, se acerca. Si está cerca, cruza lateralmente.
    const chaseWeight = dist > 3.2 ? 0.75 : 0.25;
    const strafeWeight = 1 - chaseWeight;

    const mx = nx * chaseWeight + px * strafeWeight;
    const mz = nz * chaseWeight + pz * strafeWeight;
    const mDist = Math.sqrt(mx * mx + mz * mz) || 1;

    const baseSpeed = dist < 3.2 ? this.passThroughSpeed : this.speed;
    this.position.x += (mx / mDist) * baseSpeed * dt;
    this.position.z += (mz / mDist) * baseSpeed * dt;
  }

  playSound() {
    const sounds = ['stalker_breath', 'stalker_whisper', 'stalker_growl'];
    const randomSound = sounds[Math.floor(Math.random() * sounds.length)];
    horrorSystem.playSound(randomSound, 0.5);
  }
}
