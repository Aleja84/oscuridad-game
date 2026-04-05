function setupInput() {
  document.addEventListener('keydown', function(e) {
    switch (e.code) {
      case 'KeyW': moveForward  = true;  break;
      case 'KeyS': moveBackward = true;  break;
      case 'KeyA': moveLeft     = true;  break;
      case 'KeyD': moveRight    = true;  break;
      case 'KeyE': interact();           break;
      case 'KeyF': toggleFlashlight();   break;
      case 'KeyM': toggleMapView();      break;
      case 'KeyB': toggleFPS();          break;
    }
    // Debug en teclado ES y fallback por código físico
    if (e.key === 'ñ' || e.key === 'Ñ' || e.code === 'Semicolon' || e.code === 'Quote') {
      toggleDebug();
      e.preventDefault();
    }
  });

  document.addEventListener('keyup', function(e) {
    switch (e.code) {
      case 'KeyW': moveForward  = false; break;
      case 'KeyS': moveBackward = false; break;
      case 'KeyA': moveLeft     = false; break;
      case 'KeyD': moveRight    = false; break;
    }
  });

  document.addEventListener('mousemove', function(e) {
    if (!isLocked) return;
    yaw   -= e.movementX * 0.002;
    pitch -= e.movementY * 0.002;
    pitch  = Math.max(-Math.PI/2 + 0.05, Math.min(Math.PI/2 - 0.05, pitch));
    camera.rotation.set(pitch, yaw, 0, 'YXZ');
  });

  document.addEventListener('wheel', function(e) {
    if (!_mapViewActive) return;
    camera.position.y = Math.max(15, Math.min(180, camera.position.y + e.deltaY * 0.08));
    e.preventDefault();
  }, { passive: false });

  document.addEventListener('click', function() {
    if (gameStarted && !isLocked) document.body.requestPointerLock();
  });

  document.addEventListener('pointerlockchange', function() {
    isLocked = document.pointerLockElement === document.body;
  });
}

function movePlayer(dt) {
  if (!isLocked || state.gameWon || _mapViewActive) return;

  var dir = new THREE.Vector3();
  var fwd = new THREE.Vector3(-Math.sin(yaw), 0, -Math.cos(yaw));
  var rgt = new THREE.Vector3( Math.cos(yaw), 0, -Math.sin(yaw));

  if (moveForward)  dir.add(fwd);
  if (moveBackward) dir.sub(fwd);
  if (moveLeft)     dir.sub(rgt);
  if (moveRight)    dir.add(rgt);

  if (dir.length() > 0) {
    dir.normalize();
    var newPos = camera.position.clone().addScaledVector(dir, CONFIG.PLAYER_SPEED * dt);
    newPos.y = CONFIG.PLAYER_HEIGHT;

    var blocked    = false;
    var sphereHigh = new THREE.Sphere(newPos, CONFIG.PLAYER_RADIUS);
    var sphereLow  = new THREE.Sphere(new THREE.Vector3(newPos.x, 0.9, newPos.z), CONFIG.PLAYER_RADIUS);
    var shortTop   = CONFIG.PLAYER_HEIGHT - CONFIG.PLAYER_RADIUS; // 1.35
    var box3       = new THREE.Box3();
    for (var i = 0; i < collidables.length; i++) {
      if (!collidables[i].geometry) continue;
      collidables[i].updateMatrixWorld();
      box3.setFromObject(collidables[i]);
      box3.expandByScalar(-0.01);
      if (box3.intersectsSphere(sphereHigh)) { blocked = true; break; }
      if (box3.max.y < shortTop && box3.intersectsSphere(sphereLow)) { blocked = true; break; }
    }
    if (!blocked) camera.position.copy(newPos);
  }
  camera.position.y = CONFIG.PLAYER_HEIGHT;
}

function animateObjects(dt) {
  animT += dt;
  for (var i = 0; i < interactables.length; i++) {
    var o = interactables[i];
    if (o.type === 'key' && !o.collected && o.mesh) {
      o.mesh.rotation.z += dt * 1.8;
      o.mesh.position.y  = 1.0 + Math.sin(animT * 2) * 0.06;
      o.position.y       = o.mesh.position.y;
    }
    if (o.type === 'battery' && !o.collected && o.mesh) {
      o.mesh.rotation.y += dt * 1.2;
      o.mesh.position.y  = 0.35 + Math.sin(animT * 1.5) * 0.05;
      o.position.y       = o.mesh.position.y;
    }
  }

  // Parpadeo ocasional de luces
  if (Math.random() < 0.003) {
    for (var j = 0; j < pointLights.length; j++)
      pointLights[j].intensity = 0.05 + Math.random() * 0.25;
  }

  // Balanceo de brazos
  if (arms) {
    var mv = moveForward || moveBackward || moveLeft || moveRight;
    arms.position.y = mv ? Math.sin(animT*8)*0.015  : Math.sin(animT*1.5)*0.005;
    arms.position.x = mv ? Math.sin(animT*4)*0.005  : 0;
  }
}
