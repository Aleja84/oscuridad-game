function startGame() {
  document.getElementById('start-screen').style.display = 'none';
  gameStarted = true;
  if (typeof setDamageGrace === 'function') {
    setDamageGrace(4.0);
  }
  document.body.requestPointerLock();
}

function init() {
  try {
    initThree();
    initLevelContext({
      THREE,
      scene,
      ROOMS,
      CONNECTIONS,
      LOCKED_ROOMS,
      KEY_ROOMS,
      BATTERY_ROOMS,
      STUN_ROOMS,
      CONFIG,
      collidables,
      ceilingMeshes,
      pointLights,
      interactables,
      doors,
      buildPlayerArms,
      buildFlashlight
    });
    buildLevel();
    setupInput();
    updateHUD();

    // Inicializar sistema de horror
    horrorSystem.init();
        
    // El spawn se maneja al detectar entrada real a sala (updateRoomEnemies)
    var btn = document.getElementById('start-btn');
    if (btn) {
      btn.addEventListener('click', startGame);
    } else {
      console.error('ERROR: No se encontró #start-btn');
    }

    gameLoop();
    console.log('Juego iniciado correctamente');
  } catch(e) {
    console.error('ERROR en init():', e);
    // Mostrar error en pantalla para diagnosticar
    var msg = document.createElement('div');
    msg.style.cssText = 'position:fixed;top:0;left:0;width:100%;background:#ff0000;color:#fff;padding:20px;z-index:9999;font-family:monospace;font-size:13px;white-space:pre-wrap';
    msg.textContent = 'ERROR: ' + e.message + '\n' + e.stack;
    document.body.appendChild(msg);
  }
}

// ── FPS counter ──────────────────────────────────────────────
var _fpsVisible = false;
var _fpsFrames = 0;
var _fpsLast = performance.now();
var _fpsHud = null;


function toggleFPS() {
  if (!_fpsHud) _fpsHud = document.getElementById('fps-hud');
  _fpsVisible = !_fpsVisible;
  _fpsHud.style.display = _fpsVisible ? 'block' : 'none';
}

function _updateFPS() {
  if (!_fpsVisible) return;
  if (!_fpsHud) _fpsHud = document.getElementById('fps-hud');
  _fpsFrames++;
  var now = performance.now();
  var elapsed = now - _fpsLast;
  if (elapsed >= 500) {
    _fpsHud.textContent = 'FPS: ' + Math.round(_fpsFrames * 1000 / elapsed);
    _fpsFrames = 0;
    _fpsLast = now;
  }
}
// ─────────────────────────────────────────────────────────────

function gameLoop() {
    requestAnimationFrame(gameLoop);
    var dt = Math.min(clock.getDelta(), 0.05);

    if (!gameStarted) {
      renderer.render(scene, camera);
      return;
    }

    movePlayer(dt);
    animateObjects(dt);
    updateInteractPrompt();

    // Actualizar cambio de salas y spawnear enemigos
    if (typeof updateRoomEnemies === 'function') {
      updateRoomEnemies();
    }

    // Actualizar enemigos
    if (enemies && enemies.length > 0) {
      updateAllEnemies(dt, camera.position, playerHealth, flashlightOn, {
        x: camera.position.x,
        y: camera.position.y,
        z: camera.position.z
      });
    }

    // Fantasmas de pasillo: solo susto visual/sonoro
    if (typeof updateCorridorGhosts === 'function') {
      updateCorridorGhosts(dt, camera.position, THREE);
    }

    // Actualizar sistema de horror
    if (typeof horrorSystem !== 'undefined') {
      var playerInDanger = enemies.some(e => e.state === 'attacking' && e.distanceTo(camera.position) < 5);
      horrorSystem.updateScareLevel(dt, playerInDanger);
      horrorSystem.updateAmbience(typeof getCurrentRoomId === 'function' ? getCurrentRoomId() : 0);
    }

    _updateFPS();
    renderer.render(scene, camera);
}
// Esperar a que TODO esté listo — DOM + scripts
document.addEventListener('DOMContentLoaded', function() {
  // Conectar el botón INMEDIATAMENTE cuando el DOM esté listo
  // aunque Three.js aún no haya cargado
  var btn = document.getElementById('start-btn');
  if (btn) {
    btn.addEventListener('click', startGame);
  }
});

window.addEventListener('load', function() {
  // Aquí ya están cargados Three.js y todos los scripts
  init();
});
