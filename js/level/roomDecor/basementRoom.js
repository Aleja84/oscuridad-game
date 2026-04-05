function decorBasement(room) {
  const { CONFIG } = getLevelContext();
  const x = room.x;
  const z = room.z;
  const w = room.w;
  const d = room.d;
  const H = CONFIG.ROOM_HEIGHT;

  placeCeilingLightPanel(x - 2.8, H - 0.08, z - 1.8, 2.4, 2.0);
  placeCeilingLightPanel(x + 2.8, H - 0.08, z + 2.0, 2.4, 2.0);

  placePillar(x - w + 1.5, z - d + 1.5);
  placePillar(x + w - 1.5, z - d + 1.5);

  placeCylinderCanister(x - 4.2, z - 1.3);
  placeCylinderCanister(x - 2.2, z + 1.0);

  placeMetalCart(x + w - 1.8, z - 1.0);
  placeMetalBench(x, z + d - 1.4, 2.8);

  placeBasementCrate(x - w + 2.4, z + d - 2.1, 1.5, 1.2, 1.3);
  placeBasementCrate(x + w - 2.4, z + d - 2.0, 1.4, 1.0, 1.2);
  placeBasementCrate(x - 0.2, z + 2.0, 1.0, 0.9, 1.0);
  placeBasementCrate(x + 2.6, z - 1.8, 0.9, 0.8, 0.9);

  placeElectricLever(x, z);

  placeRoomRewards(room);
}