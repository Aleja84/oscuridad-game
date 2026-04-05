function decorLibrary(room) {
  const { THREE, scene, pointLights } = getLevelContext();
  const x = room.x;
  const z = room.z;
  const w = room.w;

  placeShelfRow(x - 7.5, z + 2.0, 4, false);
  placeShelfRow(x - 4.0, z + 2.0, 4, true);

  placeBookshelves(x + 1.8, z - 1.2, w * 0.95);

  placeLongTable(x + 5.8, z - 2.6);
  placeLongTable(x + 5.8, z + 0.6);
  placeLongTable(x + 5.8, z + 3.8);

  placeChair(x + 5.8, z - 1.4, Math.PI);
  placeChair(x + 5.8, z - 3.4, 0);
  placeChair(x + 3.5, z - 2.6, Math.PI / 2);
  placeChair(x + 8.1, z - 2.6, -Math.PI / 2);

  placeChair(x + 5.8, z + 1.8, Math.PI);
  placeChair(x + 5.8, z - 0.2, 0);
  placeChair(x + 3.5, z + 0.6, Math.PI / 2);
  placeChair(x + 8.1, z + 0.6, -Math.PI / 2);

  placeChair(x + 5.8, z + 5.0, Math.PI);
  placeChair(x + 5.8, z + 3.0, 0);
  placeChair(x + 3.5, z + 3.8, Math.PI / 2);
  placeChair(x + 8.1, z + 3.8, -Math.PI / 2);

  const lamp1 = new THREE.PointLight(0xffe4b5, 0.45, 6);
  lamp1.position.set(x + 5.8, 2.4, z - 2.6);
  scene.add(lamp1);
  pointLights.push(lamp1);

  const lamp2 = new THREE.PointLight(0xffe4b5, 0.45, 6);
  lamp2.position.set(x + 5.8, 2.4, z + 0.6);
  scene.add(lamp2);
  pointLights.push(lamp2);

  const lamp3 = new THREE.PointLight(0xffe4b5, 0.45, 6);
  lamp3.position.set(x + 5.8, 2.4, z + 3.8);
  scene.add(lamp3);
  pointLights.push(lamp3);

  placeRoomRewards(room);
}