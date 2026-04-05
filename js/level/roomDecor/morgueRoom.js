function decorMorgue(room) {
  const { THREE, scene, pointLights, CONFIG } = getLevelContext();
  const x = room.x;
  const z = room.z;
  const w = room.w;
  const d = room.d;
  const H = CONFIG.ROOM_HEIGHT;

  placeCeilingLightPanel(x - 4.5, H - 0.08, z - 3.5, 2.4, 2.0);
  placeCeilingLightPanel(x,       H - 0.08, z - 3.5, 2.4, 2.0);
  placeCeilingLightPanel(x + 4.5, H - 0.08, z - 3.5, 2.4, 2.0);

  placeCeilingLightPanel(x - 4.5, H - 0.08, z, 2.4, 2.0);
  placeCeilingLightPanel(x,       H - 0.08, z, 2.4, 2.0);
  placeCeilingLightPanel(x + 4.5, H - 0.08, z, 2.4, 2.0);

  placeMorgueTable(x - 3.0, z);
  placeMorgueTable(x + 3.0, z);
  placeMorgueTable(x, z + 3.3);

  placeMetalCart(x + 4.8, z + 5.3);

  placeBodyLockers(x - 3.8, z - d + 1.25, 4, 2);
  placeBodyLockers(x + 3.8, z - d + 1.25, 4, 2);

  placeSinkCounter(x + w - 2.2, z - 1.8, 6.0);
  placeMetalBench(x - w + 2.0, z + 2.4, 3.6);
  placeCurtainDivider(x, z - 1.8, 7.5);

  const morgueFill = new THREE.PointLight(0xdff6ff, 0.8, 18);
  morgueFill.position.set(x, 2.8, z);
  scene.add(morgueFill);
  pointLights.push(morgueFill);

  placeRoomRewards(room);
}