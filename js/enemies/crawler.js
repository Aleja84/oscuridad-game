class Crawler extends Enemy {
  constructor(x, z, config) {
    super(x, z, 'crawler', config);
    this.crawlSpeed = 8;
    this.legAnimationTime = 0;
    this.isStunned = false;
    this.stunDuration = 0;
  }

  createMesh(THREE) {
    const geometry = new THREE.BoxGeometry(0.4, 0.4, 0.8);
    
    this.material = new THREE.MeshPhongMaterial({
      color: 0x663300,
      specular: 0x111111,
      shininess: 10,
      transparent: true,
      opacity: 0.85
    });
    
    this.mesh = new THREE.Mesh(geometry, this.material);
    this.mesh.castShadow = false;
    this.mesh.receiveShadow = false;
    
    const limbGeometry = new THREE.CylinderGeometry(0.05, 0.05, 0.6, 6);
    const limbMaterial = new THREE.MeshPhongMaterial({ color: 0x4d2600 });

    const positions = [
      [-0.2, -0.1, -0.3],
      [0.2, -0.1, -0.3],
      [-0.2, -0.1, 0.3],
      [0.2, -0.1, 0.3]
    ];
    
    positions.forEach(pos => {
      const limb = new THREE.Mesh(limbGeometry, limbMaterial);
      limb.position.set(pos[0], pos[1], pos[2]);
      this.mesh.add(limb);
    });
    
    return this.mesh;
  }

  update(dt, playerPos, playerHealth, flashlightActive, flashlightPos) {
    this.timeAlive += dt;
    this.legAnimationTime += dt;
    
    const distToPlayer = this.distanceTo(playerPos);
    const canSeePlayer = distToPlayer < this.detectionRange;
    
    // Comportamiento del crawler
    if (this.isStunned) {
      this.stunDuration -= dt;
      if (this.stunDuration <= 0) {
        this.isStunned = false;
      }
      this.opacity = 0.3;  
      return;
    }
    
    switch(this.state) {
      case 'idle':
        if (canSeePlayer) {
          this.state = 'alert';
        } else {
          this.crawl(dt); 
        }
        break;
        
      case 'alert':
        if (distToPlayer < this.attackRange) {
          this.state = 'attacking';
        } else if (canSeePlayer) {
          this.moveTowards(playerPos, dt);
        } else {
          this.state = 'idle';
        }
        break;
        
      case 'attacking':
        if (distToPlayer > this.attackRange + 2) {
          this.state = 'alert';
        } else {
          this.moveTowards(playerPos, dt);
        }
        break;
    }
    
    if ((this.state === 'alert' || this.state === 'attacking') && this.lastSoundTime > 0.5) {
      horrorSystem.playSound('crawler_screech', 0.8);
      this.lastSoundTime = 0;
    }
    
    this.animateCrawling();
    
    if (this.mesh) {
      this.mesh.position.set(this.position.x, 0.5, this.position.z);
      this.mesh.rotation.z = Math.sin(this.legAnimationTime * 4) * 0.2;
      if (this.material) {
        this.material.opacity = this.opacity;
      }
    }
    
    this.lastSoundTime += dt;
  }

  crawl(dt) {
 
    const moveAmount = this.crawlSpeed * 0.3 * dt;
    const angle = (this.timeAlive * 2) % (Math.PI * 2);
    
    this.position.x += Math.cos(angle) * moveAmount;
    this.position.z += Math.sin(angle) * moveAmount;
  }

  animateCrawling() {
    
    if (this.state === 'alert' || this.state === 'attacking') {
      this.mesh.scale.y = 0.8 + Math.sin(this.legAnimationTime * 8) * 0.15;
    }
  }

  stun(duration) {
    this.isStunned = true;
    this.stunDuration = duration;
    this.state = 'idle';
    horrorSystem.playSound('crawler_stun');
  }

  playSound() {
    horrorSystem.playSound('crawler_screech', 0.6);
  }
}
