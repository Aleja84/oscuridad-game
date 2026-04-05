function decorKitchenRoom(room) {
  const { THREE } = getLevelContext();
  const x = room.x;
  const z = room.z;
  const w = room.w;
  const d = room.d;

  const cabinetMat = new THREE.MeshLambertMaterial({ color: 0x2f6a22 });
  const cabinetDark = new THREE.MeshLambertMaterial({ color: 0x234d19 });
  const counterTop = new THREE.MeshLambertMaterial({ color: 0x4a2a12 });
  const appliance = new THREE.MeshLambertMaterial({ color: 0xbdbdbd });
  const fridgeMat = new THREE.MeshLambertMaterial({ color: 0xd8d8d8 });
  const darkDet = new THREE.MeshLambertMaterial({ color: 0x101010 });
  const handleMat = new THREE.MeshLambertMaterial({ color: 0xe0d6b8 });
  const sinkMat = new THREE.MeshLambertMaterial({ color: 0x6f7f88 });

  const nz = z - d + 1.2;
  const cw = w * 1.35;

  mkMesh(new THREE.BoxGeometry(cw, 0.92, 1.0), cabinetMat, x, 0.46, nz, true);
  mkMesh(new THREE.BoxGeometry(cw + 0.12, 0.06, 1.10), counterTop, x, 0.94, nz, false);

  for (let i = 0; i < 4; i++) {
    mkMeshRaw(
      new THREE.BoxGeometry(0.04, 0.72, 0.03),
      cabinetDark,
      x - cw / 2 + (i + 1) * (cw / 5),
      0.46,
      nz + 0.48
    );
  }

  for (let i = 0; i < 5; i++) {
    const px = x - cw / 2 + 0.8 + i * ((cw - 1.6) / 4);
    mkMeshRaw(new THREE.BoxGeometry(1.0, 0.72, 0.05), cabinetMat, px, 0.46, nz + 0.52);
    mkMeshRaw(new THREE.BoxGeometry(0.05, 0.16, 0.03), handleMat, px + 0.28, 0.46, nz + 0.56);
  }

  mkMesh(new THREE.BoxGeometry(1.10, 0.04, 0.90), appliance, x - 1.2, 0.97, nz, false);

  [[-0.28, -0.18], [0.28, -0.18], [-0.28, 0.18], [0.28, 0.18]].forEach(function (p) {
    mkMeshRaw(
      new THREE.BoxGeometry(0.22, 0.03, 0.22),
      darkDet,
      x - 1.2 + p[0],
      1.0,
      nz + p[1]
    );
  });

  mkMeshRaw(new THREE.BoxGeometry(0.95, 0.04, 0.65), sinkMat, x + 1.2, 0.98, nz);
  mkMeshRaw(new THREE.BoxGeometry(0.35, 0.18, 0.25), darkDet, x + 1.2, 1.05, nz);
  mkMeshRaw(new THREE.BoxGeometry(0.05, 0.28, 0.05), darkDet, x + 1.12, 1.14, nz);
  mkMeshRaw(new THREE.BoxGeometry(0.18, 0.04, 0.05), darkDet, x + 1.20, 1.24, nz);

  mkMesh(new THREE.BoxGeometry(cw, 0.88, 0.42), cabinetMat, x, 2.55, nz + 0.30, true);

  for (let i = 0; i < 5; i++) {
    const px = x - cw / 2 + 0.8 + i * ((cw - 1.6) / 4);
    mkMeshRaw(new THREE.BoxGeometry(1.0, 0.72, 0.05), cabinetDark, px, 2.55, nz + 0.52);
    mkMeshRaw(new THREE.BoxGeometry(0.05, 0.14, 0.03), handleMat, px + 0.30, 2.55, nz + 0.56);
  }

  mkMesh(new THREE.BoxGeometry(0.90, 0.50, 0.55), appliance, x - 3.0, 1.25, nz + 0.10, false);
  mkMeshRaw(new THREE.BoxGeometry(0.60, 0.28, 0.03), darkDet, x - 3.05, 1.25, nz + 0.39);
  mkMeshRaw(new THREE.BoxGeometry(0.10, 0.10, 0.03), darkDet, x - 2.65, 1.32, nz + 0.39);
  mkMeshRaw(new THREE.BoxGeometry(0.10, 0.10, 0.03), darkDet, x - 2.65, 1.17, nz + 0.39);

  const fx = x + w - 1.15;

  mkMesh(new THREE.BoxGeometry(1.02, 2.95, 0.92), fridgeMat, fx, 1.47, nz + 0.42, true);

  mkMeshRaw(new THREE.BoxGeometry(0.96, 0.04, 0.03), darkDet, fx, 1.58, nz + 0.92);

  mkMeshRaw(new THREE.BoxGeometry(0.05, 0.95, 0.05), appliance, fx - 0.40, 2.05, nz + 0.92);
  mkMeshRaw(new THREE.BoxGeometry(0.05, 0.70, 0.05), appliance, fx - 0.40, 0.95, nz + 0.92);

  mkMeshRaw(new THREE.BoxGeometry(0.92, 0.08, 0.06), darkDet, fx, 0.08, nz + 0.91);

  const wx = x - w + 1.0;

  mkMesh(new THREE.BoxGeometry(1.0, 0.92, d * 0.75), cabinetMat, wx, 0.46, z - 0.6, true);
  mkMesh(new THREE.BoxGeometry(1.1, 0.06, d * 0.75), counterTop, wx, 0.94, z - 0.6, false);

  for (let i = 0; i < 3; i++) {
    const pz = z - 0.6 - (d * 0.75) / 2 + 1.1 + i * 2.1;
    mkMeshRaw(new THREE.BoxGeometry(0.05, 0.72, 1.7), cabinetDark, wx + 0.52, 0.46, pz);
    mkMeshRaw(new THREE.BoxGeometry(0.03, 0.14, 0.05), handleMat, wx + 0.56, 0.46, pz + 0.45);
  }

  mkMesh(new THREE.BoxGeometry(0.52, 2.4, 2.4), cabinetMat, wx + 0.28, 1.2, z + 4.2, true);
  mkMeshRaw(new THREE.BoxGeometry(0.05, 2.15, 2.2), cabinetDark, wx + 0.55, 1.2, z + 4.2);
  mkMeshRaw(new THREE.BoxGeometry(0.03, 0.18, 0.05), handleMat, wx + 0.58, 1.2, z + 4.9);


  placeTable(x + 2.2, z + 3.6);
  placeChair(x + 2.2, z + 5.25, Math.PI);
  placeChair(x + 2.2, z + 1.95, 0);
  placeChair(x + 0.55, z + 3.6, Math.PI / 2);
  placeChair(x + 3.85, z + 3.6, -Math.PI / 2);

  placeTable(x - 2.8, z + 3.6);
  placeChair(x - 2.8, z + 5.25, Math.PI);
  placeChair(x - 2.8, z + 1.95, 0);
  placeChair(x - 4.45, z + 3.6, Math.PI / 2);
  placeChair(x - 1.15, z + 3.6, -Math.PI / 2);

  placeTable(x + 2.2, z - 2.4);
  placeChair(x + 2.2, z - 0.75, Math.PI);
  placeChair(x + 2.2, z - 4.05, 0);
  placeChair(x + 0.55, z - 2.4, Math.PI / 2);
  placeChair(x + 3.85, z - 2.4, -Math.PI / 2);

  placeTable(x - 2.8, z - 2.4);
  placeChair(x - 2.8, z - 0.75, Math.PI);
  placeChair(x - 2.8, z - 4.05, 0);
  placeChair(x - 4.45, z - 2.4, Math.PI / 2);
  placeChair(x - 1.15, z - 2.4, -Math.PI / 2);


  mkMesh(new THREE.CylinderGeometry(0.28, 0.28, 0.65, 10), darkDet, x + 4.6, 0.33, z - 4.7, true);

  mkMesh(new THREE.BoxGeometry(0.35, 0.22, 0.35), appliance, x + 3.0, 1.08, nz - 0.05, false);
  mkMesh(new THREE.BoxGeometry(0.28, 0.18, 0.28), cabinetDark, x + 3.5, 1.06, nz + 0.10, false);

  mkMesh(new THREE.BoxGeometry(6.8, 0.08, 1.2), appliance, x - 0.3, 3.65, z + 0.6, false);

  placeRoomRewards(room);
}