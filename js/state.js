var state = {
  heldKeys:       [],              // ids de salas cuya llave lleva el jugador
  unlockedRooms:  [],              // ids de salas ya desbloqueadas (llave usada)
  batteries:      0,
  batterySlots:   [false, false, false],
  stunCharges:    0,               // cargas del aturdidor (máx 2)
  boxActivated:   false,
  leverActivated: false,           // palanca del sótano activada
  gameWon:        false,
};

  // SISTEMA DE SALUD
  var playerMaxHealth = 100;
  var playerHealth = playerMaxHealth;
  var lastDamageTime = 0;
  var damageCooldown = 1.0;  // No recibir daño más de una vez por 1.0s

var scene, camera, renderer, clock;
var interactables  = [];
var doors          = [];
var pointLights    = [];
var collidables    = [];
var ceilingMeshes  = [];
var arms, flashlight, flashlightGlass, flashlightFill;

var moveForward  = false;
var moveBackward = false;
var moveLeft     = false;
var moveRight    = false;
var yaw          = 0;
var pitch        = 0;
var isLocked     = false;
var gameStarted  = false;
var flashlightOn = true;
var nearestInteractable = null;
var animT  = 0;
var debugMode = false;
var _debugAmbient = null;
