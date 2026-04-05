
var damageBlockedUntil = 0;

function setDamageGrace(seconds) {
  var now = performance.now() / 1000;
  damageBlockedUntil = Math.max(damageBlockedUntil, now + seconds);
}

function playerTakeDamage(amount) {
  var currentTime = performance.now() / 1000;

  if (currentTime < damageBlockedUntil) {
    return false;
  }
  
  // Evitar daño muy frecuente
  if (currentTime - lastDamageTime < damageCooldown) {
    return false;
  }
  
  lastDamageTime = currentTime;
  playerHealth = Math.max(0, playerHealth - amount);
  
  // Efectos visuales
  horrorSystem.applyDamageEffect(amount);
  
  // Mostrar mensaje
  showMessage('💔 -' + amount + ' HP (' + Math.round(playerHealth) + '/' + playerMaxHealth + ')');
  
  // Actualizar HUD
  updateHUD();
  
  // Si muere el jugador
  if (playerHealth <= 0) {
    playerDied();
  }

  return true;
}

function playerDied() {
  gameStarted = false;
  isLocked = false;
  if (document.pointerLockElement) {
    document.exitPointerLock();
  }
  horrorSystem.playSound('jumpscare', 1.0);
  
  setTimeout(() => {
    var loseScreen = document.getElementById('lose-screen');
    if (loseScreen) {
      loseScreen.style.display = 'flex';
    }
  }, 1000);
}


function getCurrentRoomId() {
  var playerPos = camera.position;
  var insideMargin = 0.35;

  for (let i = 0; i < ROOMS.length; i++) {
    let room = ROOMS[i];
    let insideX = playerPos.x >= (room.x - room.w + insideMargin) && playerPos.x <= (room.x + room.w - insideMargin);
    let insideZ = playerPos.z >= (room.z - room.d + insideMargin) && playerPos.z <= (room.z + room.d - insideMargin);
    if (insideX && insideZ) {
      return room.id;
    }
  }

  // -1 = en pasillo o fuera de una sala
  return -1;
}

// Variable para trackear la sala anterior
var previousRoomId = -1;


function updateRoomEnemies() {
  var currentRoomId = getCurrentRoomId();
  
  if (currentRoomId !== previousRoomId) {
    // Cambio de sala
    previousRoomId = currentRoomId;
    
    // Limpiar enemigos de la sala anterior
    clearEnemies();
    
    // Si está en pasillo, no spawnear enemigos
    if (currentRoomId === -1) {
      return;
    }

    // Spawnear nuevos enemigos (incluye salas actualizadas dinamicamente)
    spawnEnemiesInRoom(currentRoomId, THREE);
    setDamageGrace(2.2);
    console.log('Entrada a sala:', ROOMS[currentRoomId].name);
  }
}
