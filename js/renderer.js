function initThree() {
  scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x000000, 0.005);

  camera = new THREE.PerspectiveCamera(75, innerWidth / innerHeight, 0.1, 200);
  camera.position.set(0, CONFIG.PLAYER_HEIGHT, -4);

  renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('canvas'), antialias: false });
  renderer.setSize(innerWidth, innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ReinhardToneMapping;
  renderer.toneMappingExposure = 0.55;

  clock = new THREE.Clock();

  window.addEventListener('resize', function() {
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(innerWidth, innerHeight);
  });
}

function buildFlashlight() {
  flashlight = new THREE.SpotLight(0xfff0dd, CONFIG.FLASHLIGHT_INTENSITY,
    CONFIG.FLASHLIGHT_RANGE, Math.PI / 7, 0.25, 1.5);
  flashlight.castShadow = true;
  flashlight.shadow.mapSize.width = flashlight.shadow.mapSize.height = 256;
  camera.add(flashlight);
  camera.add(flashlight.target);
  flashlight.target.position.set(0, 0, -1);
  flashlightFill = new THREE.PointLight(0xfff0dd, 9.0, 16, 1.2);
  flashlightFill.position.set(0, 0, -0.3);
  camera.add(flashlightFill);

  scene.add(camera);
}

function buildPlayerArms() {
  arms = new THREE.Group();
  var skin   = new THREE.MeshLambertMaterial({ color: 0xd4a882 });
  var sleeve = new THREE.MeshLambertMaterial({ color: 0x1a1a2a });

  var lArm = new THREE.Mesh(new THREE.BoxGeometry(0.12,0.4,0.12), sleeve);
  lArm.position.set(-0.25,-0.35,-0.5); lArm.rotation.x = -0.2; arms.add(lArm);
  var lHand = new THREE.Mesh(new THREE.BoxGeometry(0.1,0.12,0.1), skin);
  lHand.position.set(-0.25,-0.55,-0.52); arms.add(lHand);

  var rArm = new THREE.Mesh(new THREE.BoxGeometry(0.12,0.4,0.12), sleeve);
  rArm.position.set(0.25,-0.35,-0.5); rArm.rotation.x = -0.2; arms.add(rArm);
  var rHand = new THREE.Mesh(new THREE.BoxGeometry(0.1,0.12,0.1), skin);
  rHand.position.set(0.25,-0.55,-0.52); arms.add(rHand);

  var lantMat = new THREE.MeshLambertMaterial({ color:0x888888, emissive:new THREE.Color(0x222222) });
  var lantern = new THREE.Mesh(new THREE.CylinderGeometry(0.05,0.07,0.25,8), lantMat);
  lantern.position.set(0.25,-0.43,-0.6); lantern.rotation.x = Math.PI/2; arms.add(lantern);

  flashlightGlass = new THREE.Mesh(new THREE.CylinderGeometry(0.04,0.05,0.05,8),
    new THREE.MeshLambertMaterial({ color:0xfff0aa, emissive:new THREE.Color(0x887733), transparent:true, opacity:0.9 }));
  flashlightGlass.position.set(0,0.15,0); lantern.add(flashlightGlass);

  camera.add(arms);
}

var _flashlightRestoreTimer = null;

function setFlashlightState(nextOn, silent) {
  flashlightOn = !!nextOn;

  if (flashlight) {
    flashlight.intensity = flashlightOn ? CONFIG.FLASHLIGHT_INTENSITY : 0;
  }
  if (flashlightFill) {
    flashlightFill.intensity = flashlightOn ? 9.0 : 0;
  }

  // Vidrio de la linterna: brilla encendida, apagada se oscurece
  if (flashlightGlass && flashlightGlass.material) {
    flashlightGlass.material.emissive.setHex(flashlightOn ? 0x887733 : 0x111100);
    flashlightGlass.material.opacity = flashlightOn ? 0.9 : 0.4;
  }

  // Overlay circular en pantalla
  var ov = document.getElementById('flashlight-overlay');
  if (ov) {
    ov.className = flashlightOn ? 'fl-on' : 'fl-off';
  }

  if (!silent) {
    showMessage(flashlightOn ? '🔦 Linterna encendida' : '🔦 Linterna apagada');
  }
}

function forceFlashlightOffFor(ms) {
  setFlashlightState(false, true);

  if (_flashlightRestoreTimer) {
    clearTimeout(_flashlightRestoreTimer);
  }

  _flashlightRestoreTimer = setTimeout(function() {
    if (gameStarted && !_mapViewActive && !debugMode) {
      setFlashlightState(true, true);
    }
    _flashlightRestoreTimer = null;
  }, Math.max(0, ms || 0));
}

function toggleFlashlight() {
  setFlashlightState(!flashlightOn, false);
}

// ─────────────────────────────────────────────────────────────
// VISTA AÉREA DEL MAPA — tecla M
// Cámara a y=100 mirando recto hacia abajo, iluminación total,
// sin niebla. Cubre todo el mapa (-67..67 en X, -67..82 en Z).
// ─────────────────────────────────────────────────────────────
var _mapViewActive = false;
var _mapAmbient    = null;
var _savedCamPos, _savedYaw, _savedPitch;

function toggleMapView() {
  _mapViewActive = !_mapViewActive;

  if (_mapViewActive) {
    // Guardar estado del jugador
    _savedCamPos = camera.position.clone();
    _savedYaw    = yaw;
    _savedPitch  = pitch;

    // Cámara centrada sobre el mapa mirando recto hacia abajo
    // Centro del mapa: X=0, Z=7.5 (media entre z=-67 y z=82)
    // A y=100 el FOV de 75° cubre exactamente todo el mapa
    camera.position.set(0, 100, 7.5);
    camera.rotation.set(-Math.PI / 2, 0, 0, 'YXZ');

    // Iluminación total
    _mapAmbient = new THREE.AmbientLight(0xffffff, 5);
    scene.add(_mapAmbient);
    scene.fog = null;
    renderer.toneMappingExposure = 2.0;

    // Ocultar techos para ver el interior desde arriba
    for (var i = 0; i < ceilingMeshes.length; i++)
      ceilingMeshes[i].visible = false;

    showMessage('🗺️ Vista aérea — M para volver | Scroll = zoom');
  } else {
    // Restaurar cámara y estado
    camera.position.copy(_savedCamPos);
    yaw   = _savedYaw;
    pitch = _savedPitch;
    camera.rotation.set(pitch, yaw, 0, 'YXZ');

    if (_mapAmbient) { scene.remove(_mapAmbient); _mapAmbient = null; }

    // Restaurar techos
    for (var i = 0; i < ceilingMeshes.length; i++)
      ceilingMeshes[i].visible = true;

    if (!debugMode) {
      scene.fog = new THREE.FogExp2(0x000000, 0.035);
      renderer.toneMappingExposure = 0.55;
    } else {
      renderer.toneMappingExposure = 2.0;
    }

    showMessage('🗺️ Vista aérea desactivada');
  }
}

function toggleDebug() {
  debugMode = !debugMode;
  if (debugMode) {
    _debugAmbient = new THREE.AmbientLight(0xffffff, 6);
    scene.add(_debugAmbient);
    for (var i = 0; i < pointLights.length; i++) {
      pointLights[i]._origInt = pointLights[i].intensity;
      pointLights[i].intensity = 3;
    }
    if (flashlight) {
      flashlight._origInt = flashlight.intensity;
      flashlight.intensity = 20;
    }
    scene.fog = null;
    renderer.toneMappingExposure = 2.0;
    var flOv = document.getElementById('flashlight-overlay');
    if (flOv) flOv.className = '';
    showMessage('🔦 DEBUG ON — Ñ para apagar');
  } else {
    if (_debugAmbient) { scene.remove(_debugAmbient); _debugAmbient = null; }
    for (var i = 0; i < pointLights.length; i++) {
      pointLights[i].intensity = pointLights[i]._origInt !== undefined ? pointLights[i]._origInt : 0.3;
    }
    if (flashlight) {
      flashlight.intensity = flashlight._origInt !== undefined ? flashlight._origInt : (flashlightOn ? CONFIG.FLASHLIGHT_INTENSITY : 0);
    }
    scene.fog = new THREE.FogExp2(0x000000, 0.035);
    renderer.toneMappingExposure = 0.55;
    var flOv = document.getElementById('flashlight-overlay');
    if (flOv) flOv.className = flashlightOn ? 'fl-on' : 'fl-off';
    showMessage('🔦 DEBUG OFF');
  }
  var el = document.getElementById('debug-hud');
  if (el) el.style.opacity = debugMode ? 1 : 0;
}
