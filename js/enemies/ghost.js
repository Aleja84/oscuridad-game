class Ghost extends Enemy {
  constructor(x, z, config) {
    super(x, z, 'ghost', config);
    
    // Propiedades específicas del Ghost
    this.fadeSpeed = 0.8;           // Velocidad de desvanecimiento
    this.visibilityThreshold = 0.2; // Opacidad mínima
    this.reappearDistance = 15;     // Distancia donde reaparece
    this.ghostColor = 0x00ff88;     // Verde espectral
    this.flickerSpeed = 2;          // Parpadeo
    this.flickerIntensity = 0.3;
    this.ambushTimer = 0;
    this.ambushCooldown = 4.0 + Math.random() * 2.5;
  }

  createMesh(THREE) {
    if (this.roomId === 6) {
      this.ghostColor = 0x33ff66;
    }

    const geometry = new THREE.SphereGeometry(0.6, 16, 16);
    
    this.material = new THREE.MeshPhongMaterial({
      color: this.ghostColor,
      emissive: this.ghostColor,
      emissiveIntensity: 0.7,
      transparent: true,
      opacity: 0.8,
      wireframe: false,
      fog: false
    });
    
    this.mesh = new THREE.Mesh(geometry, this.material);
    this.mesh.castShadow = false;
    this.mesh.receiveShadow = false;
    
    const auraGeometry = new THREE.SphereGeometry(0.8, 16, 16);
    const auraMaterial = new THREE.MeshBasicMaterial({
      color: this.ghostColor,
      transparent: true,
      opacity: 0.3,
      wireframe: true
    });
    const aura = new THREE.Mesh(auraGeometry, auraMaterial);
    this.mesh.add(aura);
    
    return this.mesh;
  }

  update(dt, playerPos, playerHealth, flashlightActive, flashlightPos) {
    super.update(dt, playerPos, playerHealth, flashlightActive, flashlightPos);
    
    const flicker = Math.sin(this.timeAlive * this.flickerSpeed) * this.flickerIntensity;
    
    if (flashlightActive && this.distanceTo(flashlightPos) < 10) {
      this.opacity = Math.max(this.visibilityThreshold, this.opacity - this.fadeSpeed * dt);
      this.state = 'fleeing';
      
      // Si se desvanece completamente, reaparece lejos
      if (this.opacity <= this.visibilityThreshold) {
        const angle = Math.random() * Math.PI * 2;
        const dist = 12 + Math.random() * 5;
        this.position.x = playerPos.x + Math.cos(angle) * dist;
        this.position.z = playerPos.z + Math.sin(angle) * dist;
        this.opacity = 0.8;
        horrorSystem.playSound('ghost_reappear');
      }
    } else {
      this.opacity = Math.min(1.0, this.opacity + this.fadeSpeed * 0.3 * dt);
      this.opacity += flicker;
    }

    if (this.roomId === 6) {
      this.ambushTimer += dt;
      if (this.ambushTimer >= this.ambushCooldown) {
        this.ambushTimer = 0;
        this.ambushCooldown = 4.0 + Math.random() * 2.5;

        var ang = Math.random() * Math.PI * 2;
        var dist = 2.5 + Math.random() * 2.0;
        this.position.x = playerPos.x + Math.cos(ang) * dist;
        this.position.z = playerPos.z + Math.sin(ang) * dist;
        this.state = 'attacking';
        this.opacity = 0.95;
        horrorSystem.playSound('ghost_reappear', 0.75);
      }
    }
    
    if (this.state === 'alert' || this.state === 'attacking') {
      this.mesh.rotation.z += dt * 0.5;  // Rotación inquietante
    }
  }

  playSound() {
    horrorSystem.playSound('ghost_groan', 0.6);
  }
}
