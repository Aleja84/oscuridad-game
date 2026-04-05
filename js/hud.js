function updateHUD() {
  // Baterías
  for (var i = 0; i < 3; i++) {
    var el = document.getElementById('bat' + i);
    var f  = state.batterySlots[i];
    el.className = 'battery-icon' + (f ? '' : ' empty');
    el.style.filter = f ? 'none' : 'grayscale(1)';
  }
  // Aturdidor
  var stunHud = document.getElementById('stun-hud');
  stunHud.style.opacity = 0;
  document.getElementById('stun-charges').textContent = '';

  // Llaves — LOCKED_ROOMS = [1,2,3] → slots key-slot-1, key-slot-2, key-slot-3
  for (var j = 0; j < LOCKED_ROOMS.length; j++) {
    var roomId = LOCKED_ROOMS[j];
    var slot   = document.getElementById('key-slot-' + roomId);
    if (!slot) continue;
    var held   = state.heldKeys.indexOf(roomId) !== -1;
    var used   = state.unlockedRooms.indexOf(roomId) !== -1;
    slot.className = 'key-slot' + (used ? ' used' : held ? ' held' : '');
  }


    // Salud del jugador
    var healthHud = document.getElementById('health-hud');
    if (healthHud && typeof playerHealth !== 'undefined') {
      healthHud.textContent = '❤️ ' + Math.round(playerHealth) + '/' + playerMaxHealth;
      var healthPercent = playerHealth / playerMaxHealth;
    
      // Cambiar color según salud
      if (healthPercent > 0.66) {
        healthHud.style.color = '#00ff44';  // Verde
      } else if (healthPercent > 0.33) {
        healthHud.style.color = '#ffaa00';  // Naranja
      } else {
        healthHud.style.color = '#ff0000';  // Rojo
      }
    }
  }

var _msgT;
function showMessage(msg) {
  var el = document.getElementById('message');
  el.textContent = msg;
  el.style.opacity = 1;
  clearTimeout(_msgT);
  _msgT = setTimeout(function() { el.style.opacity = 0; }, 3000);
}

function updateInteractPrompt() {
  nearestInteractable = findNearestInteractable();
  var p = document.getElementById('interact-prompt');
  if (nearestInteractable) {
    p.style.opacity = 1;
    p.innerHTML = '<span>E</span> — ' + nearestInteractable.label;
  } else {
    p.style.opacity = 0;
  }
}

function showWinScreen()  { document.getElementById('win-screen').style.display  = 'flex'; }
function showLoseScreen() { document.getElementById('lose-screen').style.display = 'flex'; }
