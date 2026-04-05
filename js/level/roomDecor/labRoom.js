function decorLab(room) {
  const { THREE, scene, pointLights } = getLevelContext();
  const x = room.x;
  const z = room.z;

  placeOperationTableDetailed(x, z);

  placeLabConsole(x - 5.0, z - 4.2);
  placeLabConsole(x + 5.0, z - 4.2);

  placeLabCabinet(x - 6.0, z + 5.5);
  placeLabCabinet(x + 6.0, z + 5.5);

  placeCylinderCanister(x - 3.0, z + 3.0);
  placeCylinderCanister(x + 3.2, z + 3.0);

  const lampMat = new THREE.MeshLambertMaterial({ color: 0xaaaaaa });
  const glowMat = new THREE.MeshLambertMaterial({
    color: 0xaaffaa,
    emissive: new THREE.Color(0x44bb44)
  });

  mkMesh(new THREE.BoxGeometry(0.12, 0.9, 0.12), lampMat, x, 3.25, z, false);
  mkMesh(new THREE.BoxGeometry(0.85, 0.22, 0.85), lampMat, x, 2.75, z, false);
  mkMesh(new THREE.BoxGeometry(0.65, 0.08, 0.65), glowMat, x, 2.63, z, false);

  const labLight = new THREE.PointLight(0x55ff88, 2.0, 10);
  labLight.position.set(x, 2.6, z);
  scene.add(labLight);
  pointLights.push(labLight);

  const labFill = new THREE.PointLight(0x33cc66, 1.2, 18);
  labFill.position.set(x, 2.8, z);
  scene.add(labFill);
  pointLights.push(labFill);

  placeRoomRewards(room);
}