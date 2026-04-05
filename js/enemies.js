class Enemy {
  constructor(x, z, type, config) {
    this.position = { x: x, z: z };
    this.type = type;           // 'ghost', 'stalker', 'crawler'
    this.state = 'idle';        // idle, alert, attacking, dying, fleeing
    this.health = config.health || 100;
    this.maxHealth = this.health;
    this.speed = config.speed || 5;
    this.detectionRange = config.detectionRange || 20;
    this.attackRange = config.attackRange || 3;
    this.damage = config.damage || 10;
    
    // Visuales
    this.opacity = 1.0;
    this.isVisible = true;
    this.mesh = null;
    this.material = null;
    
    // Audio
    this.soundPlaying = false;
    this.lastSoundTime = 0;
    this.soundInterval = 3;     // Sonido cada 3 segundos aprox
    
    // AI
    this.targetPos = null;
    this.patrolIndex = 0;
    this.patrolPoints = [];
    this.lastPlayerSeen = null;
    this.timeSeenPlayer = 0;
    this.delayBeforeAttack = 0.5;  // segundos antes de atacar
    
    // Stats
    this.timeAlive = 0;
    this.hasAttackedPlayer = false;
    this.lastAttackAt = 0;
    this.attackCooldown = config.attackCooldown || 1.2;
    this.minPlayerDistance = config.minPlayerDistance || 1.05;
    this.hitRecoil = config.hitRecoil || 1.35;
  }

  // Crear la malla visual
  createMesh(THREE) {
    return null;
  }

  // Actualizar enemigo cada frame
  update(dt, playerPos, playerHealth, flashlightActive, flashlightPos) {
    this.timeAlive += dt;
    
    // Actualizar sonido
    this.updateSound(dt);
    
    // Detectar jugador
    const distToPlayer = this.distanceTo(playerPos);
    const canSeePlayer = distToPlayer < this.detectionRange;
    
    // Comportamiento según estado
    switch(this.state) {
      case 'idle':
        if (canSeePlayer) {
          this.state = 'alert';
          this.timeSeenPlayer = 0;
        } else {
          this.patrol(dt);
        }
        break;
        
      case 'alert':
        this.timeSeenPlayer += dt;
        if (distToPlayer < this.attackRange && this.timeSeenPlayer > this.delayBeforeAttack) {
          this.state = 'attacking';
          this.hasAttackedPlayer = true;
        } else if (!canSeePlayer) {
          this.state = 'idle';
          this.timeSeenPlayer = 0;
        } else {
          this.moveTowards(playerPos, dt);
        }
        break;
        
      case 'attacking':
        if (distToPlayer > this.attackRange + 2) {
          this.state = 'alert';
        } else {
          this.moveTowards(playerPos, dt);
        }
        break;
        
      case 'fleeing':
        this.moveAwayFrom(playerPos, dt);
        break;
    }
    
    // Reaccionar a la linterna 
    this.reactToFlashlight(flashlightActive, flashlightPos);
    
    // Actualizar posición de malla
    if (this.mesh) {
      this.mesh.position.set(this.position.x, 1.0, this.position.z);
      if (this.material) {
        this.material.opacity = this.opacity;
      }
    }
  }

  // Distancia al jugador
  distanceTo(pos) {
    const dx = this.position.x - pos.x;
    const dz = this.position.z - pos.z;
    return Math.sqrt(dx * dx + dz * dz);
  }

  // Moverse hacia el jugador
  moveTowards(targetPos, dt) {
    const dx = targetPos.x - this.position.x;
    const dz = targetPos.z - this.position.z;
    const dist = Math.sqrt(dx * dx + dz * dz);
    
    if (dist > 0.1) {
      const moveX = (dx / dist) * this.speed * dt;
      const moveZ = (dz / dist) * this.speed * dt;
      this.position.x += moveX;
      this.position.z += moveZ;
    }
  }

  // Alejarse del jugador
  moveAwayFrom(targetPos, dt) {
    const dx = this.position.x - targetPos.x;
    const dz = this.position.z - targetPos.z;
    const dist = Math.sqrt(dx * dx + dz * dz);
    
    if (dist > 0.1) {
      const moveX = (dx / dist) * this.speed * dt;
      const moveZ = (dz / dist) * this.speed * dt;
      this.position.x += moveX;
      this.position.z += moveZ;
    }
  }

  // Patrullar puntos aleatorios
  patrol(dt) {
    if (!this.targetPos) {
      this.targetPos = {
        x: this.position.x + (Math.random() - 0.5) * 20,
        z: this.position.z + (Math.random() - 0.5) * 20
      };
    }
    
    const distToTarget = this.distanceTo(this.targetPos);
    if (distToTarget < 1) {
      this.targetPos = null;
    } else {
      this.moveTowards(this.targetPos, dt * 0.5);
    }
  }

  // Reaccionar a la linterna 
  reactToFlashlight(isActive, flashlightPos) {
  }

  // Actualizar sonidos
  updateSound(dt) {
    this.lastSoundTime += dt;
    
    if (this.state === 'alert' || this.state === 'attacking') {
      if (this.lastSoundTime > this.soundInterval) {
        this.playSound();
        this.lastSoundTime = 0;
        this.soundInterval = 2 + Math.random() * 3;  // Variable
      }
    }
  }

  // Reproducir sonido
  playSound() {
    horrorSystem.playEnemySound(this.type);
  }

  // Recibir daño
  takeDamage(amount) {
    this.health -= amount;
    if (this.health <= 0) {
      this.state = 'dying';
    }
  }

 // ¿Debe atacar al jugador?
  shouldAttackPlayer(distToPlayer) {
    return this.state === 'attacking' && distToPlayer < this.attackRange;
  }
  debugDraw(camera) {
  }
}

var enemies = [];
var finalHunter = null;
var corridorGhostCycleStarted = false;
var corridorBlackoutDelay = -1;


function createEnemy(type, x, z, THREE, roomId) {
  let config = ENEMY_CONFIG[type] || ENEMY_CONFIG.stalker;
  let enemy = null;
  
  if (type === 'ghost') {
    enemy = new Ghost(x, z, config);
  } else if (type === 'stalker') {
    enemy = new Stalker(x, z, config);
  } else if (type === 'crawler') {
    enemy = new Crawler(x, z, config);
  }
  
  if (enemy) {
    enemy.roomId = typeof roomId === 'number' ? roomId : null;
    enemy.roomConstraintMargin = 1.2;
    enemy.createMesh(THREE);
    if (enemy.mesh) {
      scene.add(enemy.mesh);
    }
    enemies.push(enemy);
  }
  
  return enemy;
}


function updateAllEnemies(dt, playerPos, playerHealth, flashlightActive, flashlightPos) {
  for (let i = 0; i < enemies.length; i++) {
    let enemy = enemies[i];
    
    if (enemy.state !== 'dying') {
      enemy.update(dt, playerPos, playerHealth, flashlightActive, flashlightPos);
      confineEnemyToRoom(enemy);
      keepEnemyOffPlayer(enemy, playerPos, dt);
      
      // Verificar si ataca al jugador
      if (enemy.shouldAttackPlayer(enemy.distanceTo(playerPos))) {
        var now = performance.now() / 1000;
        if (now - enemy.lastAttackAt >= enemy.attackCooldown) {
          var didHit = playerTakeDamage(enemy.damage);
          if (didHit) {
            enemy.lastAttackAt = now;
            applyEnemyRecoil(enemy, playerPos);
            enemy.state = 'alert';
            horrorSystem.triggerJumpscare('attacked');
            if (!enemy.isFinalHunter) {
              moveEnemyToAnotherRoom(enemy, typeof getCurrentRoomId === 'function' ? getCurrentRoomId() : -1);
            }
            if (typeof setDamageGrace === 'function') {
              setDamageGrace(1.5);
            }
          }
        }
      }
    } else if (enemy.mesh) {
      // Enemigo muerto: desvanecer
      enemy.opacity = Math.max(0, enemy.opacity - dt);
      if (enemy.opacity <= 0 && enemy.mesh && enemy.mesh.parent) {
        scene.remove(enemy.mesh);
        enemies.splice(i, 1);
        i--;
      }
    }
  }
}

function moveEnemyToAnotherRoom(enemy, playerRoomId) {
  var oldRoomId = enemy.roomId;
  var candidateIds = [];
  for (var i = 0; i < ROOMS.length; i++) {
    var id = ROOMS[i].id;
    if (id === enemy.roomId) continue;
    if (id === playerRoomId) continue;
    candidateIds.push(id);
  }

  if (candidateIds.length === 0) return;

  var nextRoomId = candidateIds[Math.floor(Math.random() * candidateIds.length)];
  enemy.roomId = nextRoomId;
  enemy.state = 'idle';
  enemy.targetPos = null;

  // Persistir la migracion para que al entrar a otras salas sí aparezcan
  if (typeof ENEMY_SPAWNS !== 'undefined') {
    if (!ENEMY_SPAWNS[oldRoomId]) ENEMY_SPAWNS[oldRoomId] = [];
    if (!ENEMY_SPAWNS[nextRoomId]) ENEMY_SPAWNS[nextRoomId] = [];

    // Quitar tipo de la sala anterior (solo uno por tipo)
    ENEMY_SPAWNS[oldRoomId] = ENEMY_SPAWNS[oldRoomId].filter(function(s) {
      return s.type !== enemy.type;
    });

    // Insertar tipo en sala destino si no existe
    var exists = ENEMY_SPAWNS[nextRoomId].some(function(s) { return s.type === enemy.type; });
    if (!exists) {
      var roomRef = null;
      for (var rr = 0; rr < ROOMS.length; rr++) {
        if (ROOMS[rr].id === nextRoomId) {
          roomRef = ROOMS[rr];
          break;
        }
      }
      ENEMY_SPAWNS[nextRoomId].push({
        type: enemy.type,
        x: roomRef ? roomRef.x : enemy.position.x,
        z: roomRef ? roomRef.z : enemy.position.z
      });
    }
  }

  var spawn = null;
  var roomSpawns = ENEMY_SPAWNS[nextRoomId] || [];
  for (var j = 0; j < roomSpawns.length; j++) {
    if (roomSpawns[j].type === enemy.type) {
      spawn = roomSpawns[j];
      break;
    }
  }

  if (spawn) {
    enemy.position.x = spawn.x;
    enemy.position.z = spawn.z;
  } else {
    for (var k = 0; k < ROOMS.length; k++) {
      if (ROOMS[k].id === nextRoomId) {
        enemy.position.x = ROOMS[k].x;
        enemy.position.z = ROOMS[k].z;
        break;
      }
    }
  }
}

function keepEnemyOffPlayer(enemy, playerPos, dt) {
  var dx = enemy.position.x - playerPos.x;
  var dz = enemy.position.z - playerPos.z;
  var dist = Math.sqrt(dx * dx + dz * dz);
  var minDist = enemy.minPlayerDistance || 1.0;

  if (dist < minDist) {
    var nx = dist > 0.0001 ? dx / dist : (Math.random() - 0.5);
    var nz = dist > 0.0001 ? dz / dist : (Math.random() - 0.5);
    var push = (minDist - dist) * 0.35;
    enemy.position.x += nx * push;
    enemy.position.z += nz * push;
  }
}

function applyEnemyRecoil(enemy, playerPos) {
  var dx = enemy.position.x - playerPos.x;
  var dz = enemy.position.z - playerPos.z;
  var dist = Math.sqrt(dx * dx + dz * dz) || 1;
  var recoil = enemy.hitRecoil || 1.2;

  enemy.position.x += (dx / dist) * recoil;
  enemy.position.z += (dz / dist) * recoil;
}

function confineEnemyToRoom(enemy) {
  if (enemy.isFinalHunter) return;
  if (enemy.roomId === null || enemy.roomId === undefined) return;

  var room = null;
  for (var i = 0; i < ROOMS.length; i++) {
    if (ROOMS[i].id === enemy.roomId) {
      room = ROOMS[i];
      break;
    }
  }
  if (!room) return;

  var m = enemy.roomConstraintMargin || 1.0;
  var minX = room.x - room.w + m;
  var maxX = room.x + room.w - m;
  var minZ = room.z - room.d + m;
  var maxZ = room.z + room.d - m;

  enemy.position.x = Math.max(minX, Math.min(maxX, enemy.position.x));
  enemy.position.z = Math.max(minZ, Math.min(maxZ, enemy.position.z));
}

function clearEnemies() {
  enemies.forEach(enemy => {
    if (enemy.mesh && enemy.mesh.parent) {
      scene.remove(enemy.mesh);
    }
  });
  enemies = [];
}


function spawnEnemiesInRoom(roomId, THREE) {
  const spawns = ENEMY_SPAWNS[roomId];
  if (!spawns) return;
  const seenTypes = {};

  spawns.forEach(spawn => {
    if (seenTypes[spawn.type]) return; // Solo un tipo por sala
    seenTypes[spawn.type] = true;
    createEnemy(spawn.type, spawn.x, spawn.z, THREE, roomId);
  });
}

// Fantasmas de pasillo: solo susto visual/sonoro, no daño
var corridorGhosts = [];
var corridorGhostTimer = 0;

function updateCorridorGhosts(dt, playerPos, THREE) {
  if (typeof getCurrentRoomId !== 'function') return;
  var roomId = getCurrentRoomId();

  // Fuera de pasillos, limpiar apariciones
  if (roomId !== -1) {
    clearCorridorGhosts();
    corridorGhostTimer = 0;
    corridorGhostCycleStarted = false;
    corridorBlackoutDelay = -1;
    return;
  }

  // Al entrar al pasillo: fantasma inmediato
  if (!corridorGhostCycleStarted) {
    spawnCorridorGhost(playerPos, THREE);
    corridorGhostCycleStarted = true;
    corridorGhostTimer = 0;
    corridorBlackoutDelay = 1.0; // esperar 1s antes de apagar
  }

  // Apagon retardado 1 segundo despues de aparecer
  if (corridorBlackoutDelay >= 0) {
    corridorBlackoutDelay -= dt;
    if (corridorBlackoutDelay <= 0) {
      corridorBlackoutDelay = -1;
      if (typeof forceFlashlightOffFor === 'function') {
        forceFlashlightOffFor(1200);
      }
    }
  }

  // Luego se repite cada 6 segundos
  corridorGhostTimer += dt;
  if (corridorGhostTimer >= 6.0) {
    spawnCorridorGhost(playerPos, THREE);
    corridorGhostTimer = 0;
    corridorBlackoutDelay = 1.0;
  }

  for (var i = corridorGhosts.length - 1; i >= 0; i--) {
    var g = corridorGhosts[i];
    g.life -= dt;
    if (g.mesh && g.mesh.material) {
      g.mesh.material.opacity = Math.max(0, Math.min(0.45, g.life / g.maxLife));
    }
    if (g.life <= 0) {
      if (g.mesh && g.mesh.parent) scene.remove(g.mesh);
      corridorGhosts.splice(i, 1);
    }
  }
}

function spawnCorridorGhost(playerPos, THREE) {
  var angle = Math.random() * Math.PI * 2;
  var dist = 3.5 + Math.random() * 3.5;
  var x = playerPos.x + Math.cos(angle) * dist;
  var z = playerPos.z + Math.sin(angle) * dist;

  var mesh = new THREE.Mesh(
    new THREE.SphereGeometry(0.6, 14, 14),
    new THREE.MeshPhongMaterial({
      color: 0x66ffee,
      emissive: 0x66ffee,
      emissiveIntensity: 0.6,
      transparent: true,
      opacity: 0.0,
      depthWrite: false
    })
  );
  mesh.position.set(x, 1.1, z);
  scene.add(mesh);

  corridorGhosts.push({ mesh: mesh, life: 1.0, maxLife: 1.0 });
  if (typeof horrorSystem !== 'undefined') {
    horrorSystem.playSound('ghost_reappear', 0.5);
  }
}

function clearCorridorGhosts() {
  for (var i = 0; i < corridorGhosts.length; i++) {
    var g = corridorGhosts[i];
    if (g.mesh && g.mesh.parent) scene.remove(g.mesh);
  }
  corridorGhosts = [];
}

function activateFinalHunter(THREE) {
  if (finalHunter && finalHunter.state !== 'dying') return;
  var room7 = null;
  for (var i = 0; i < ROOMS.length; i++) {
    if (ROOMS[i].id === 7) { room7 = ROOMS[i]; break; }
  }
  if (!room7) return;

  finalHunter = createEnemy('stalker', room7.x, room7.z, THREE, null);
  if (!finalHunter) return;

  finalHunter.isFinalHunter = true;
  finalHunter.roomId = null;
  finalHunter.damage = 14;
  finalHunter.attackCooldown = 1.0;
  if (typeof finalHunter.darkModeSpeed === 'number') finalHunter.darkModeSpeed = 9;
  if (typeof finalHunter.lightModeSpeed === 'number') finalHunter.lightModeSpeed = 5;
  finalHunter.speed = 8;
  showMessage('☠️ Algo te esta cazando... Usa el aturdidor (R)');
}

function useStunGun() {
  if (!gameStarted) return;
  if (state.stunCharges <= 0) {
    showMessage('💜 Sin cargas de aturdidor');
    return;
  }

  var range = 7.0;
  var minDot = 0.55;
  var dir = new THREE.Vector3();
  camera.getWorldDirection(dir);

  var best = null;
  var bestScore = -Infinity;

  for (var i = 0; i < enemies.length; i++) {
    var e = enemies[i];
    if (!e || e.state === 'dying') continue;

    var toEnemy = new THREE.Vector3(
      e.position.x - camera.position.x,
      0,
      e.position.z - camera.position.z
    );
    var dist = toEnemy.length();
    if (dist > range || dist < 0.001) continue;

    toEnemy.normalize();
    var dot = dir.x * toEnemy.x + dir.z * toEnemy.z;
    if (dot < minDot) continue;

    var score = dot * 10 - dist + (e.isFinalHunter ? 100 : 0);
    if (score > bestScore) {
      bestScore = score;
      best = e;
    }
  }

  if (!best) {
    showMessage('💜 No hay enemigo en mira');
    return;
  }

  state.stunCharges--;
  updateHUD();

  best.isStunned = true;
  best.stunDuration = 3.0;
  best.state = 'idle';
  best.targetPos = null;
  best.opacity = 0.35;

  if (typeof horrorSystem !== 'undefined') {
    horrorSystem.playSound('crawler_stun', 0.9);
  }
  showMessage(best.isFinalHunter ? '💥 Perseguidor aturdido (3s)' : '💥 Enemigo aturdido (3s)');
}
