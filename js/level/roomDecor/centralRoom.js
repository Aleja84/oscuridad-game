function decorCentral(room) {
  const { THREE, scene, pointLights } = getLevelContext();
  const x = room.x;
  const z = room.z;

  placeReceptionDesk(x, z + 1.0);

  placeChairWide(x - 1.3, z + 4.0);
  placeChairWide(x + 1.3, z + 4.0);

  placeReceptionMonitor(x - 1.0, z + 0.65, Math.PI);
  placeReceptionMonitor(x + 1.0, z + 0.65, Math.PI);

  placeLobbySofa(x - 6.0, z - 2.5, 0);
  placeLobbySofa(x + 6.0, z - 2.5, 0);

  placeLobbyPedestal(x - 7.0, z + 5.5);
  placeLobbyPedestal(x + 7.0, z + 5.5);

  placeRoomRewards(room);

  const underLight = new THREE.PointLight(0xff0000, 2, 6);
  underLight.position.set(x, 0.3, z + 2.2);
  scene.add(underLight);
  pointLights.push(underLight);
}