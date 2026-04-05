function mkMesh(geo, mat, x, y, z, addCol) {
  const { THREE, scene, collidables } = getLevelContext();

  const m = new THREE.Mesh(geo, mat);
  m.position.set(x, y, z);
  m.receiveShadow = true;
  m.castShadow = true;
  scene.add(m);

  if (addCol) collidables.push(m);
  return m;
}

function mkMeshRaw(geo, mat, x, y, z) {
  const { THREE, scene } = getLevelContext();

  const m = new THREE.Mesh(geo, mat);
  m.position.set(x, y, z);
  scene.add(m);
  return m;
}

function getRoomById(id) {
  const { ROOMS } = getLevelContext();
  for (let i = 0; i < ROOMS.length; i++) {
    if (ROOMS[i].id === id) return ROOMS[i];
  }
  return null;
}