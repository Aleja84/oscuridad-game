var CONFIG = {
  PLAYER_SPEED:         5,
  PLAYER_RADIUS:        0.35,
  PLAYER_HEIGHT:        1.7,
  INTERACT_DIST:        3.0,
  ROOM_HEIGHT:          4,
  WALL_THICKNESS:       0.3,
  DOOR_WIDTH:           2.4,
  DOOR_HEIGHT:          3.2,
  CORRIDOR_WIDTH:       4,     // ancho del túnel (radio = 2)
  FLASHLIGHT_INTENSITY: 24,
  FLASHLIGHT_RANGE:     28,
};

  // CONFIGURACIÓN DE ENEMIGOS
  var ENEMY_CONFIG = {
    ghost: {
      health: 50,
      speed: 6,
      detectionRange: 25,
      attackRange: 2,
      damage: 15,
      minPlayerDistance: 1.2,
      hitRecoil: 1.5
    },
    stalker: {
      health: 80,
      speed: 7,
      detectionRange: 30,
      attackRange: 2.2,
      damage: 12,
      attackCooldown: 1.4,
      minPlayerDistance: 1.05,
      hitRecoil: 1.35
    },
    crawler: {
      health: 30,
      speed: 8,
      detectionRange: 15,
      attackRange: 1.2,
      damage: 8,
      attackCooldown: 1.6,
      minPlayerDistance: 0.9,
      hitRecoil: 1.1
    }
  };

  // SPAWN POINTS DE ENEMIGOS POR SALA
  // 0=Central, 1=Lab, 2=Cocina, 3=Biblioteca, 4=Sótano, 5=Secreto, 6=Morgue, 7=Final
  var ENEMY_SPAWNS = {
    3: [  // BIBLIOTECA - Crawler acechando estanterias
      { type: 'crawler', x: -2, z: -52 }
    ],
    4: [  // SÓTANO - Stalkers aterradores
      { type: 'stalker', x: 0, z: 35 },
      { type: 'stalker', x: 5, z: 45 }
    ],
    6: [  // MORGUE - Ghosts espectrales
      { type: 'ghost', x: -55, z: 35 },
      { type: 'ghost', x: -55, z: 50 }
    ],
    5: [  // CUARTO SECRETO - Crawlers 
      { type: 'crawler', x: 55, z: 40 },
      { type: 'crawler', x: 55, z: 45 },
      { type: 'crawler', x: 50, z: 50 }
    ],
    7: [  // SALA FINAL - Boss 
      { type: 'stalker', x: 55, z: 70 }
    ]
  };

/*
  MAPA 150x150  (de -75 a +75 en X y Z)

  Distribución:

      [R3 Biblioteca (-30,0)]
              |pasillo vertical
      [R0 Central (0,0)]----pasillo horizontal----[R1 Lab (30,0)]
              |                                         |
        pasillo vertical                          pasillo vertical
              |                                         |
      [R4 Sótano (0,30)]                       [R5 Secreto (30,55)]
              |                                         |
        pasillo horizontal                        pasillo vertical
              |                                         |
      [R6 Morgue (-30,55)]                     [R7 Final (30,80)]
      [R2 Cocina (-55,0)]----pasillo horizontal----[R0]

  Todas las coordenadas diseñadas para que los pasillos
  conecten EXACTAMENTE borde con borde de las habitaciones.

  Habitación: posición = centro, w/d = semiancho/semilargo
  Borde Este  = x + w
  Borde Oeste = x - w
  Borde Sur   = z + d
  Borde Norte = z - d

  Pasillo entre sala A y sala B:
  - Si horizontal (mismo Z): va de borde_este_A a borde_oeste_B
  - Si vertical   (mismo X): va de borde_sur_A  a borde_norte_B

  IMPORTANTE: las salas 1,2,3 están cerradas con llave.
  El jugador empieza en sala 0.
*/

var ROOMS = [
  { id:0, x:  0, z:  0, w:10, d:10, name:'Sala Central'   },
  { id:1, x: 55, z:  0, w: 8, d: 8, name:'Laboratorio'    },  // bloqueada
  { id:2, x:-55, z:  0, w: 8, d: 8, name:'Cocina'         },  // bloqueada
  { id:3, x:  0, z:-52, w:10, d: 8, name:'Biblioteca'     },  // bloqueada
  { id:4, x:  0, z: 40, w: 9, d: 9, name:'Sótano'         },
  { id:5, x: 55, z: 40, w: 8, d: 8, name:'Cuarto Secreto' },
  { id:6, x:-55, z: 40, w: 8, d: 8, name:'Morgue'         },
  { id:7, x: 55, z: 70, w: 8, d: 8, name:'Sala Final'     },
];

var LOCKED_ROOMS  = [1, 2, 3];
var KEY_ROOMS     = [4, 1, 6];   // Sótano→llave Lab | Lab→llave Cocina | Morgue→llave Biblioteca
var BATTERY_ROOMS = [0, 2, 3];   // Central | Cocina | Biblioteca
var STUN_ROOMS    = [5];          // Cuarto Secreto → aturdidor

/*
  PASILLOS — definidos como conexiones entre dos salas.
  El sistema los construye automáticamente alineados con las paredes.
  { a: idA, sideA: 'E'|'W'|'N'|'S', b: idB, sideB: 'E'|'W'|'N'|'S' }
  sideA = qué pared de A tiene la puerta hacia B
  sideB = qué pared de B tiene la puerta hacia A
*/
var CONNECTIONS = [
  { a:0, sideA:'E', b:1, sideB:'W' },   // Central → Lab       (horizontal)
  { a:0, sideA:'W', b:2, sideB:'E' },   // Central → Cocina    (horizontal)
  { a:0, sideA:'N', b:3, sideB:'S' },   // Central → Biblioteca(vertical)
  { a:0, sideA:'S', b:4, sideB:'N' },   // Central → Sótano    (vertical)
  { a:1, sideA:'S', b:5, sideB:'N' },   // Lab     → Secreto   (vertical)
  { a:4, sideA:'W', b:6, sideB:'E' },   // Sótano  → Morgue    (horizontal)
  { a:5, sideA:'S', b:7, sideB:'N' },   // Secreto → Final     (vertical)
];
