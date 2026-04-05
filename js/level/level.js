function initLevelContext(ctx) {
  setLevelContext(ctx);
}

function buildLevel() {
  const {
    THREE,
    scene,
    ROOMS,
    CONNECTIONS,
    buildPlayerArms,
    buildFlashlight
  } = getLevelContext();

  createMaterials(THREE);
  scene.add(new THREE.AmbientLight(0x080606, 0.32));

  const wallDoors = computeWallDoors();

  for (let i = 0; i < ROOMS.length; i++) {
    buildRoom(ROOMS[i], wallDoors[ROOMS[i].id] || {});
  }

  for (let j = 0; j < CONNECTIONS.length; j++) {
    buildCorridor(CONNECTIONS[j]);
  }

  buildPlayerArms();
  buildFlashlight();
}

function computeWallDoors() {
  const { CONNECTIONS, LOCKED_ROOMS } = getLevelContext();
  const result = {};

  for (let i = 0; i < CONNECTIONS.length; i++) {
    const c = CONNECTIONS[i];
    const lockedId = LOCKED_ROOMS.indexOf(c.b) !== -1 ? c.b : false;

    if (!result[c.a]) result[c.a] = {};
    result[c.a][c.sideA] = lockedId;

    if (!result[c.b]) result[c.b] = {};
    result[c.b][c.sideB] = lockedId;
  }

  return result;
}

function buildRoom(room, wallDoors) {
  const { THREE, scene, pointLights, ceilingMeshes, CONFIG } = getLevelContext();

  const x = room.x;
  const z = room.z;
  const w = room.w;
  const d = room.d;
  const id = room.id;

  const H = CONFIG.ROOM_HEIGHT;
  const T = CONFIG.WALL_THICKNESS;
  const roomSurface = getRoomSurfaceMaterial(room.id) || { floor: MAT.floor, wall: MAT.wall };
  const roomFloorMat = roomSurface.floor || MAT.floor;
  const roomWallMat = roomSurface.wall || MAT.wall;

  mkMesh(new THREE.BoxGeometry(w * 2, 0.2, d * 2), roomFloorMat, x, -0.1, z, true);
  ceilingMeshes.push(
    mkMesh(new THREE.BoxGeometry(w * 2, 0.2, d * 2), MAT.ceiling, x, H, z, false)
  );

  buildWallSegment(x, z - d, w * 2, H, T, false, wallDoors['N'], id, roomWallMat);
  buildWallSegment(x, z + d, w * 2, H, T, false, wallDoors['S'], id, roomWallMat);
  buildWallSegment(x + w, z, d * 2, H, T, true, wallDoors['E'], id, roomWallMat);
  buildWallSegment(x - w, z, d * 2, H, T, true, wallDoors['W'], id, roomWallMat);

  let pl;
  if (room.id === 6) {
    pl = new THREE.PointLight(0xf4fbff, 1.2, 20);
  } else {
    pl = new THREE.PointLight(0xffaa55, 0.45, 11);
  }

  pl.position.set(x, H - 0.45, z);
  scene.add(pl);
  pointLights.push(pl);

  if (room.id === 1) {
    pl.intensity = 0.25;
  }

  addRoomDecor(room);
}

function buildWallSegment(cx, cz, len, H, T, alongZ, hasDoor, roomId, wallMat) {
  const { THREE, scene, collidables, doors, interactables, CONFIG } = getLevelContext();

  const DW = CONFIG.DOOR_WIDTH;
  const DH = CONFIG.DOOR_HEIGHT;
  const sw = (len - DW) / 2;

  if (hasDoor === undefined) {
    if (alongZ) {
      mkMesh(new THREE.BoxGeometry(T, H, len), wallMat || MAT.wall, cx, H / 2, cz, true);
    } else {
      mkMesh(new THREE.BoxGeometry(len, H, T), wallMat || MAT.wall, cx, H / 2, cz, true);
    }
    return;
  }

  const isLocked = hasDoor !== false;
  const lockedRoomId = isLocked ? hasDoor : -1;

  if (alongZ) {
    mkMesh(new THREE.BoxGeometry(T, H, sw), wallMat || MAT.wall, cx, H / 2, cz - DW / 2 - sw / 2, true);
    mkMesh(new THREE.BoxGeometry(T, H, sw), wallMat || MAT.wall, cx, H / 2, cz + DW / 2 + sw / 2, true);
    mkMesh(new THREE.BoxGeometry(T, H - DH, DW), wallMat || MAT.wall, cx, DH + (H - DH) / 2, cz, true);
  } else {
    mkMesh(new THREE.BoxGeometry(sw, H, T), wallMat || MAT.wall, cx - DW / 2 - sw / 2, H / 2, cz, true);
    mkMesh(new THREE.BoxGeometry(sw, H, T), wallMat || MAT.wall, cx + DW / 2 + sw / 2, H / 2, cz, true);
    mkMesh(new THREE.BoxGeometry(DW, H - DH, T), wallMat || MAT.wall, cx, DH + (H - DH) / 2, cz, true);
  }

  const frameMat = MAT.doorFrameClosed.clone();

  let frameMesh;

  if (alongZ) {
    frameMesh = mkMeshRaw(new THREE.BoxGeometry(T * 0.3, DH + 0.2, DW + 0.3), frameMat, cx, DH / 2, cz);
  } else {
    frameMesh = mkMeshRaw(new THREE.BoxGeometry(DW + 0.3, DH + 0.2, T * 0.3), frameMat, cx, DH / 2, cz);
  }

  const dMat = isLocked ? MAT.doorLocked.clone() : MAT.door.clone();
  const dGeo = alongZ
    ? new THREE.BoxGeometry(T * 0.6, DH - 0.1, DW - 0.15)
    : new THREE.BoxGeometry(DW - 0.15, DH - 0.1, T * 0.6);

  const dMesh = new THREE.Mesh(dGeo, dMat);
  dMesh.position.set(cx, DH / 2, cz);
  scene.add(dMesh);

  const cGeo = alongZ
    ? new THREE.BoxGeometry(T, DH, DW)
    : new THREE.BoxGeometry(DW, DH, T);

  const dCol = new THREE.Mesh(cGeo, new THREE.MeshBasicMaterial({ visible: false }));
  dCol.position.copy(dMesh.position);
  scene.add(dCol);
  collidables.push(dCol);

  const startPos = dMesh.position.clone();
  const targetPos = dMesh.position.clone();
  targetPos.y += DH + 0.35;

  const doorObj = {
    mesh: dMesh,
    frameMesh: frameMesh,
    colMesh: dCol,
    position: dMesh.position.clone(),
    isOpen: false,
    isLocked: isLocked,
    roomId: roomId,
    lockedRoomId: lockedRoomId,
    startPos: startPos.clone(),
    targetPos: targetPos.clone(),
    alongZ: alongZ
  };

  doors.push(doorObj);

  interactables.push({
    type: 'door',
    door: doorObj,
    position: dMesh.position.clone(),
    label: isLocked ? 'Puerta cerrada [necesitas llave]' : 'Abrir / Cerrar puerta'
  });
}

// Añade paneles de MAT.wall en el borde del corredor donde la pared de la
// habitación (con su textura propia) quedaría visible desde el pasadizo.
function buildCorridorCap(cx, cz, facingX, midCoord, H, CW, DW, DH) {
  const { THREE } = getLevelContext();
  const sideW = (CW - DW) / 2;   // franja lateral (cada lado)
  const aboveH = H - DH;          // franja sobre la puerta
  const TH = 0.04;                // grosor del panel

  if (sideW > 0) {
    if (facingX) {
      mkMesh(new THREE.BoxGeometry(TH, H, sideW), MAT.wall, cx, H / 2, midCoord - DW / 2 - sideW / 2, false);
      mkMesh(new THREE.BoxGeometry(TH, H, sideW), MAT.wall, cx, H / 2, midCoord + DW / 2 + sideW / 2, false);
    } else {
      mkMesh(new THREE.BoxGeometry(sideW, H, TH), MAT.wall, midCoord - DW / 2 - sideW / 2, H / 2, cz, false);
      mkMesh(new THREE.BoxGeometry(sideW, H, TH), MAT.wall, midCoord + DW / 2 + sideW / 2, H / 2, cz, false);
    }
  }
  if (aboveH > 0) {
    if (facingX) {
      mkMesh(new THREE.BoxGeometry(TH, aboveH, DW), MAT.wall, cx, DH + aboveH / 2, midCoord, false);
    } else {
      mkMesh(new THREE.BoxGeometry(DW, aboveH, TH), MAT.wall, midCoord, DH + aboveH / 2, cz, false);
    }
  }
}

function buildCorridor(conn) {
  const { THREE, scene, pointLights, ceilingMeshes, CONFIG } = getLevelContext();

  const rA = getRoomById(conn.a);
  const rB = getRoomById(conn.b);
  const H = CONFIG.ROOM_HEIGHT;
  const CW = CONFIG.CORRIDOR_WIDTH;
  const DW = CONFIG.DOOR_WIDTH;
  const DH = CONFIG.DOOR_HEIGHT;
  const WT = CONFIG.WALL_THICKNESS;
  const T = 0.25;

  let x1, z1, x2, z2;

  const capOff = WT / 2 + 0.01; // desplazamiento desde el centro de la pared de habitación

  if (conn.sideA === 'E') {
    x1 = rA.x + rA.w; z1 = rA.z;
    x2 = rB.x - rB.w; z2 = rB.z;

    const midX = (x1 + x2) / 2;
    const halfLen = (x2 - x1) / 2;
    const midZ = z1;

    mkMesh(new THREE.BoxGeometry(halfLen * 2, 0.2, CW), MAT.floor, midX, -0.1, midZ, true);
    ceilingMeshes.push(mkMesh(new THREE.BoxGeometry(halfLen * 2, 0.2, CW), MAT.ceiling, midX, H, midZ, false));
    mkMesh(new THREE.BoxGeometry(halfLen * 2, H, T), MAT.wall, midX, H / 2, midZ - CW / 2, true);
    mkMesh(new THREE.BoxGeometry(halfLen * 2, H, T), MAT.wall, midX, H / 2, midZ + CW / 2, true);
    buildCorridorCap(x1 + capOff, midZ, true,  midZ, H, CW, DW, DH);
    buildCorridorCap(x2 - capOff, midZ, true,  midZ, H, CW, DW, DH);

  } else if (conn.sideA === 'W') {
    x1 = rB.x + rB.w; z1 = rB.z;
    x2 = rA.x - rA.w; z2 = rA.z;

    const midX = (x1 + x2) / 2;
    const halfLen = (x2 - x1) / 2;
    const midZ = z1;

    mkMesh(new THREE.BoxGeometry(halfLen * 2, 0.2, CW), MAT.floor, midX, -0.1, midZ, true);
    ceilingMeshes.push(mkMesh(new THREE.BoxGeometry(halfLen * 2, 0.2, CW), MAT.ceiling, midX, H, midZ, false));
    mkMesh(new THREE.BoxGeometry(halfLen * 2, H, T), MAT.wall, midX, H / 2, midZ - CW / 2, true);
    mkMesh(new THREE.BoxGeometry(halfLen * 2, H, T), MAT.wall, midX, H / 2, midZ + CW / 2, true);
    buildCorridorCap(x1 + capOff, midZ, true,  midZ, H, CW, DW, DH);
    buildCorridorCap(x2 - capOff, midZ, true,  midZ, H, CW, DW, DH);

  } else if (conn.sideA === 'S') {
    z1 = rA.z + rA.d; x1 = rA.x;
    z2 = rB.z - rB.d; x2 = rB.x;

    const midZ = (z1 + z2) / 2;
    const halfLen = (z2 - z1) / 2;
    const midX = x1;

    mkMesh(new THREE.BoxGeometry(CW, 0.2, halfLen * 2), MAT.floor, midX, -0.1, midZ, true);
    ceilingMeshes.push(mkMesh(new THREE.BoxGeometry(CW, 0.2, halfLen * 2), MAT.ceiling, midX, H, midZ, false));
    mkMesh(new THREE.BoxGeometry(T, H, halfLen * 2), MAT.wall, midX - CW / 2, H / 2, midZ, true);
    mkMesh(new THREE.BoxGeometry(T, H, halfLen * 2), MAT.wall, midX + CW / 2, H / 2, midZ, true);
    buildCorridorCap(midX, z1 + capOff, false, midX, H, CW, DW, DH);
    buildCorridorCap(midX, z2 - capOff, false, midX, H, CW, DW, DH);

  } else if (conn.sideA === 'N') {
    z1 = rB.z + rB.d; x1 = rB.x;
    z2 = rA.z - rA.d; x2 = rA.x;

    const midZ = (z1 + z2) / 2;
    const halfLen = (z2 - z1) / 2;
    const midX = x1;

    mkMesh(new THREE.BoxGeometry(CW, 0.2, halfLen * 2), MAT.floor, midX, -0.1, midZ, true);
    ceilingMeshes.push(mkMesh(new THREE.BoxGeometry(CW, 0.2, halfLen * 2), MAT.ceiling, midX, H, midZ, false));
    mkMesh(new THREE.BoxGeometry(T, H, halfLen * 2), MAT.wall, midX - CW / 2, H / 2, midZ, true);
    mkMesh(new THREE.BoxGeometry(T, H, halfLen * 2), MAT.wall, midX + CW / 2, H / 2, midZ, true);
    buildCorridorCap(midX, z1 + capOff, false, midX, H, CW, DW, DH);
    buildCorridorCap(midX, z2 - capOff, false, midX, H, CW, DW, DH);
  }

  const pl = new THREE.PointLight(0x1a0d00, 0.35, 14);
  const midPX = (conn.sideA === 'E' || conn.sideA === 'W') ? (rA.x + rB.x) / 2 : rA.x;
  const midPZ = (conn.sideA === 'S' || conn.sideA === 'N') ? (rA.z + rB.z) / 2 : rA.z;

  pl.position.set(midPX, H - 0.5, midPZ);
  scene.add(pl);
  pointLights.push(pl);
}

function addRoomDecor(room) {
  const decorator = ROOM_DECORATORS[room.id];
  if (decorator) decorator(room);
}