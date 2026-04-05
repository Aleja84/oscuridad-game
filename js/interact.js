function findNearestInteractable() {
  var pos  = camera.position;
  var best = null;
  var bestD = CONFIG.INTERACT_DIST;
  for (var i = 0; i < interactables.length; i++) {
    var o = interactables[i];
    if (o.collected) continue;
    var d = pos.distanceTo(o.position);
    if (d < bestD) { bestD = d; best = o; }
  }
  return best;
}

function interact() {
  if (!nearestInteractable) return;
  var o = nearestInteractable;
  switch (o.type) {
    case 'key':            collectKey(o);           break;
    case 'battery':        collectBattery(o);       break;
    case 'stun_item':      collectStunItem(o);      break;
    case 'door':           tryOpenDoor(o);          break;
    case 'electric_box':   tryActivateBox(o);       break;
    case 'electric_lever': activateElectricLever(o); break;
    case 'exit':           tryExit();               break;
  }
}

function collectKey(o) {
  if (o.collected) return;
  o.collected = true;
  scene.remove(o.mesh);
  scene.remove(o.glow);
  if (typeof horrorSystem !== 'undefined') {
    horrorSystem.playSound('key_pickup', 0.85);
  }
  state.heldKeys.push(o.unlocksRoomId);
  updateHUD();
  showMessage('🗝️ Llave de ' + getRoomById(o.unlocksRoomId).name + ' recogida');
}

function collectBattery(o) {
  if (o.collected) return;
  o.collected = true;
  scene.remove(o.mesh);
  scene.remove(o.glow);
  state.batteries++;
  state.batterySlots[o.batIdx] = true;
  if (typeof horrorSystem !== 'undefined') {
    horrorSystem.playSound('battery_pickup', 0.8);
  }
  updateHUD();
  showMessage('🔋 Batería recogida');
}

function tryOpenDoor(o) {
  var door = o.door;

  // Puerta ya abierta — cerrar
  if (door.isOpen) {
    closeDoor(door);
    return;
  }

  // Puerta bloqueada
  if (door.isLocked) {
    var keyIdx = state.heldKeys.indexOf(door.lockedRoomId);
    if (keyIdx !== -1) {
      unlockAllDoorsOfRoom(door.lockedRoomId);
      updateHUD();
      showMessage('🗝️ ¡' + getRoomById(door.lockedRoomId).name + ' desbloqueado!');
    } else {
      showMessage('🔒 Necesitas la llave de ' + getRoomById(door.lockedRoomId).name);
    }
    return;
  }

  // Puerta libre — abrir
  openDoor(door);
}

// Desbloquea y abre TODAS las puertas que dan acceso a la misma sala bloqueada, consumiendo la llave
function unlockAllDoorsOfRoom(lockedRoomId) {
  var keyIdx = state.heldKeys.indexOf(lockedRoomId);
  if (keyIdx !== -1) state.heldKeys.splice(keyIdx, 1);
  if (state.unlockedRooms.indexOf(lockedRoomId) === -1) state.unlockedRooms.push(lockedRoomId);
  for (var i = 0; i < doors.length; i++) {
    var d = doors[i];
    if (d.lockedRoomId === lockedRoomId && d.isLocked) {
      d.isLocked = false;
      d.mesh.material = MAT.door.clone();
      if (d.frameMesh && MAT && MAT.doorFrameClosed) {
        d.frameMesh.material = MAT.doorFrameClosed.clone();
      }
      // Actualizar label del interactuable correspondiente
      for (var j = 0; j < interactables.length; j++) {
        if (interactables[j].type === 'door' && interactables[j].door === d) {
          interactables[j].label = 'Abrir / Cerrar puerta';
        }
      }
      openDoor(d);
    }
  }
  showMessage('🗝️ ¡' + getRoomById(lockedRoomId).name + ' desbloqueado!');
}

function openDoor(door) {
  door.isOpen = true;
  if (door.frameMesh && MAT && MAT.doorFrameOpen) {
    door.frameMesh.material = MAT.doorFrameOpen.clone();
  }
  if (door.colMesh) {
    var idx = collidables.indexOf(door.colMesh);
    if (idx > -1) collidables.splice(idx, 1);
    scene.remove(door.colMesh);
    door.colMesh = null;
  }
  animDoor(door, door.targetPos);
  if (typeof horrorSystem !== 'undefined') {
    horrorSystem.playSound('door_open', 0.7);
  }

  if (door._autoCloseTimer) clearTimeout(door._autoCloseTimer);
  door._autoCloseTimer = setTimeout(function() {
    if (door.isOpen) closeDoor(door);
  }, 2000);
}

function closeDoor(door) {
  door.isOpen = false;
  if (door.frameMesh && MAT && MAT.doorFrameClosed) {
    door.frameMesh.material = MAT.doorFrameClosed.clone();
  }
  var DW = CONFIG.DOOR_WIDTH, DH = CONFIG.DOOR_HEIGHT, T = CONFIG.WALL_THICKNESS;
  var cGeo = door.alongZ
    ? new THREE.BoxGeometry(T, DH, DW)
    : new THREE.BoxGeometry(DW, DH, T);
  var dc = new THREE.Mesh(cGeo, new THREE.MeshBasicMaterial({ visible: false }));
  dc.position.copy(door.startPos);
  scene.add(dc);
  collidables.push(dc);
  door.colMesh = dc;
  animDoor(door, door.startPos);
  if (typeof horrorSystem !== 'undefined') {
    horrorSystem.playSound('door_close', 0.75);
  }
}

function animDoor(door, target) {
  var start = door.mesh.position.clone();
  var elapsed = 0;
  function step() {
    elapsed += 0.016;
    var t = Math.min(elapsed / 0.7, 1);
    door.mesh.position.lerpVectors(start, target, t);
    if (t < 1) requestAnimationFrame(step);
  }
  step();
}

function tryActivateBox(o) {
  if (state.batteries >= 3) {
    if (!state.boxActivated) {
      state.boxActivated = true;
      o.glow.color.setHex(0x00ff44);
      o.glow.intensity = 2.5;
      o.mesh.material.emissive = new THREE.Color(0x003322);
      o.mesh.material.color.setHex(0x225544);
      if (typeof horrorSystem !== 'undefined') {
        horrorSystem.playSound('box_activate', 0.95);
      }
      showMessage('⚡ ¡Energía conectada! Ahora activa la palanca en el sótano para salir');
    } else {
      showMessage('⚡ Energía ya conectada — ve al sótano');
    }
  } else {
    showMessage('🔋 Faltan ' + (3 - state.batteries) + ' baterías (' + state.batteries + '/3)');
  }
}

function activateElectricLever(o) {
  if (state.leverActivated) {
    showMessage('La palanca ya fue activada');
    return;
  }
  if (!state.boxActivated) {
    showMessage('Conecta las 3 baterías en la caja eléctrica primero');
    return;
  }

  state.leverActivated = true;

  // Animar brazo hacia arriba
  var startRotation = o.leverArm.rotation.z;
  var targetRotation = Math.PI / 6; // gira hacia arriba
  var elapsed = 0;
  function stepArm() {
    elapsed += 0.016;
    var t = Math.min(elapsed / 0.4, 1);
    o.leverArm.rotation.z = startRotation + (targetRotation - startRotation) * t;
    if (t < 1) requestAnimationFrame(stepArm);
  }
  stepArm();

  if (typeof horrorSystem !== 'undefined') {
    horrorSystem.playSound('lever_activate', 1.0);
  }

  showMessage('⚡ ¡Palanca activada! ¡Puerta abierta!');
}

function collectStunItem(o) {
  if (o.collected) return;
  o.collected = true;
  scene.remove(o.mesh);
  scene.remove(o.glow);
  var prev = playerHealth;
  playerHealth = Math.min(playerMaxHealth, playerHealth + 40);
  var healed = Math.round(playerHealth - prev);
  updateHUD();
  showMessage('💚 Kit de vida: +' + healed + ' HP');
}

function tryExit() {
  if (state.leverActivated) {
    winGame();
  } else if (state.boxActivated) {
    showMessage('Activa la palanca en el sótano para salir');
  } else {
    showMessage('Conecta las 3 baterías en la caja eléctrica primero');
  }
}

function winGame() {
  state.gameWon = true;
  document.exitPointerLock();
  showWinScreen();
}
