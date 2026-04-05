function placeRoomRewards(room) {
  const { KEY_ROOMS, BATTERY_ROOMS, STUN_ROOMS } = getLevelContext();

  const x = room.x;
  const z = room.z;
  const id = room.id;

  const keyPos = {
    4: { x: x + 3.5, z: z + 3.0 },
    1: { x: x - 3.8, z: z - 3.0 },
    6: { x: x + 3.2, z: z - 3.5 }
  };

  const batPos = {
    0: { x: x - 4.8, z: z + 5.2 },
    2: { x: x - 4.5, z: z - 4.5 },
    3: { x: x - 5.75, z: z + 2.0 }
  };

  const stunPos = {
    5: { x: x, z: z }
  };

  if (KEY_ROOMS.indexOf(id) !== -1) {
    placeKey(keyPos[id].x, keyPos[id].z, id);
  }

  if (BATTERY_ROOMS.indexOf(id) !== -1) {
    const bi = BATTERY_ROOMS.indexOf(id);
    placeBattery(batPos[id].x, batPos[id].z, bi);
  }

  if (STUN_ROOMS.indexOf(id) !== -1) {
    placeStunDevice(stunPos[id].x, stunPos[id].z);
  }

  if (id === 7) {
    placeElectricBox(x, z);
    placeExitDoor(x, z + room.d - 0.5);
  }
}

function placeKey(x, z, roomId) {
  const { THREE, scene, interactables, KEY_ROOMS, LOCKED_ROOMS } = getLevelContext();

  const mat = MAT.key.clone();
  const key = new THREE.Group();

  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(0.18, 0.05, 8, 16),
    mat
  );

  const shaft = new THREE.Mesh(
    new THREE.BoxGeometry(0.08, 0.08, 0.6),
    mat
  );
  shaft.position.z = -0.4;

  const tooth1 = new THREE.Mesh(
    new THREE.BoxGeometry(0.12, 0.08, 0.12),
    mat
  );
  tooth1.position.set(0.1, 0, -0.7);

  const tooth2 = new THREE.Mesh(
    new THREE.BoxGeometry(0.08, 0.08, 0.12),
    mat
  );
  tooth2.position.set(-0.05, 0, -0.75);

  key.add(ring, shaft, tooth1, tooth2);
  key.position.set(x, 1.0, z);
  key.rotation.x = Math.PI / 2;

  const glow = new THREE.PointLight(0xffcc00, 1.2, 3);
  glow.position.copy(key.position);

  scene.add(key);
  scene.add(glow);

  const ki = KEY_ROOMS.indexOf(roomId);
  const unlocksRoomId = LOCKED_ROOMS[ki];

  interactables.push({
    type: 'key',
    mesh: key,
    glow: glow,
    position: key.position.clone(),
    label: '¡Llave de ' + getRoomById(unlocksRoomId).name + '!',
    collected: false,
    unlocksRoomId: unlocksRoomId
  });
}

function placeBattery(x, z, bi) {
  const { THREE, scene, interactables } = getLevelContext();

  const bm = new THREE.Mesh(
    new THREE.CylinderGeometry(0.12, 0.12, 0.4, 8),
    MAT.battery.clone()
  );
  bm.position.set(x, 0.35, z);

  const g = new THREE.PointLight(0x00ff66, 0.55, 1.4);
  g.position.copy(bm.position);

  scene.add(bm);
  scene.add(g);

  interactables.push({
    type: 'battery',
    mesh: bm,
    glow: g,
    position: bm.position.clone(),
    batIdx: bi,
    label: '¡Batería! — E para recoger',
    collected: false
  });
}

function placeElectricBox(x, z) {
  const { THREE, scene, interactables } = getLevelContext();

  const mat = new THREE.MeshLambertMaterial({
    color: 0x334455,
    emissive: new THREE.Color(0x001122)
  });

  const b = mkMesh(new THREE.BoxGeometry(1, 1.5, 0.3), mat, x, 0.75, z, true);

  for (let i = 0; i < 3; i++) {
    mkMeshRaw(
      new THREE.BoxGeometry(0.15, 0.3, 0.05),
      new THREE.MeshLambertMaterial({ color: 0x111111 }),
      x - 0.3 + i * 0.3,
      0.9,
      z - 0.18
    );
  }

  const g = new THREE.PointLight(0x0055ff, 0.7, 4);
  g.position.set(x, 1.5, z);
  scene.add(g);

  interactables.push({
    type: 'electric_box',
    mesh: b,
    glow: g,
    position: b.position.clone(),
    label: 'Caja eléctrica — necesitas 3 baterías'
  });
}

function placeStunDevice(x, z) {
  const { THREE, scene, interactables } = getLevelContext();

  const mat = new THREE.MeshLambertMaterial({
    color: 0x5522aa,
    emissive: new THREE.Color(0x220044)
  });

  const stun = new THREE.Group();

  const handle = new THREE.Mesh(
    new THREE.CylinderGeometry(0.08, 0.08, 0.6, 8),
    mat
  );
  handle.rotation.z = Math.PI / 2;

  const head = new THREE.Mesh(
    new THREE.BoxGeometry(0.25, 0.2, 0.2),
    mat
  );
  head.position.x = 0.35;

  const prong1 = new THREE.Mesh(
    new THREE.CylinderGeometry(0.02, 0.02, 0.3),
    mat
  );
  prong1.position.set(0.5, 0.05, 0);

  const prong2 = new THREE.Mesh(
    new THREE.CylinderGeometry(0.02, 0.02, 0.3),
    mat
  );
  prong2.position.set(0.5, -0.05, 0);

  stun.add(handle, head, prong1, prong2);
  stun.position.set(x, 0.8, z);

  const glow = new THREE.PointLight(0xaa55ff, 1.2, 3);
  glow.position.copy(stun.position);

  scene.add(stun);
  scene.add(glow);

  interactables.push({
    type: 'stun_item',
    mesh: stun,
    glow: glow,
    position: stun.position.clone(),
    label: '¡Kit de vida! — E para recoger',
    collected: false
  });
}

function placeExitDoor(x, z) {
  const { THREE, scene, interactables } = getLevelContext();

  const mat = new THREE.MeshLambertMaterial({
    color: 0x001100,
    emissive: new THREE.Color(0x000800)
  });

  const d = mkMesh(new THREE.BoxGeometry(3, 3.5, 0.3), mat, x, 1.75, z, true);

  mkMeshRaw(
    new THREE.BoxGeometry(3.4, 3.9, 0.1),
    new THREE.MeshLambertMaterial({
      color: 0x003300,
      emissive: new THREE.Color(0x001800)
    }),
    x,
    1.95,
    z + 0.12
  );

  const g = new THREE.PointLight(0x00ff44, 0, 5);
  g.position.set(x, 2.5, z - 0.5);
  scene.add(g);

  interactables.push({
    type: 'exit',
    mesh: d,
    glow: g,
    position: d.position.clone(),
    label: 'SALIDA — activa la caja eléctrica primero'
  });
}