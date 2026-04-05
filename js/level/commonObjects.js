function placeTable(x, z) {
  const { THREE } = getLevelContext();
  const mat = new THREE.MeshLambertMaterial({ color: 0x3d2b1f });

  mkMesh(new THREE.BoxGeometry(3.2, 0.14, 1.8), mat, x, 0.95, z, true);

  [[1.35, 0.7], [1.35, -0.7], [-1.35, 0.7], [-1.35, -0.7]].forEach(function (p) {
    mkMesh(new THREE.BoxGeometry(0.12, 0.95, 0.12), mat, x + p[0], 0.47, z + p[1], false);
  });
}

function placeChair(x, z, rotY) {
  const { THREE, scene, collidables } = getLevelContext();
  rotY = rotY || 0;

  const wood = new THREE.MeshLambertMaterial({ color: 0x7a5a3a });
  const seat = new THREE.MeshLambertMaterial({ color: 0xb8926a });

  const chair = new THREE.Group();
  chair.position.set(x, 0, z);
  chair.rotation.y = rotY;
  scene.add(chair);

  function addPart(geo, mat, px, py, pz) {
    const m = new THREE.Mesh(geo, mat);
    m.position.set(px, py, pz);
    m.castShadow = true;
    m.receiveShadow = true;
    chair.add(m);
    return m;
  }

  addPart(new THREE.BoxGeometry(0.78, 0.10, 0.78), seat, 0, 0.52, 0);
  addPart(new THREE.BoxGeometry(0.78, 0.95, 0.12), seat, 0, 1.00, -0.33);

  addPart(new THREE.BoxGeometry(0.08, 0.52, 0.08), wood, -0.28, 0.26, -0.28);
  addPart(new THREE.BoxGeometry(0.08, 0.52, 0.08), wood, 0.28, 0.26, -0.28);
  addPart(new THREE.BoxGeometry(0.08, 0.52, 0.08), wood, -0.28, 0.26, 0.28);
  addPart(new THREE.BoxGeometry(0.08, 0.52, 0.08), wood, 0.28, 0.26, 0.28);

  const col = new THREE.Mesh(
    new THREE.BoxGeometry(0.82, 1.15, 0.82),
    new THREE.MeshBasicMaterial()
  );
  col.position.set(x, 0.58, z);
  col.rotation.y = rotY;
  col.visible = false;
  scene.add(col);
  collidables.push(col);
}

function placeLongTable(x, z) {
  const { THREE } = getLevelContext();

  const wood = new THREE.MeshLambertMaterial({ color: 0x1e1206 });
  const stripe = new THREE.MeshLambertMaterial({ color: 0x0e0904 });

  mkMesh(new THREE.BoxGeometry(4.8, 0.14, 1.5), wood, x, 0.95, z, true);
  mkMeshRaw(new THREE.BoxGeometry(4.6, 0.04, 0.06), stripe, x, 1.02, z);

  [[1.9, 0.55], [1.9, -0.55], [-1.9, 0.55], [-1.9, -0.55], [0, 0.55], [0, -0.55]].forEach(function (p) {
    mkMesh(new THREE.BoxGeometry(0.10, 0.95, 0.10), wood, x + p[0], 0.47, z + p[1], false);
  });
}

function placeBox(x, z) {
  const { THREE } = getLevelContext();

  const s = 0.8 + Math.random() * 0.8;
  const mat = new THREE.MeshLambertMaterial({
    color: 0x2a1f10 + Math.floor(Math.random() * 0x101010)
  });

  const b = mkMesh(new THREE.BoxGeometry(s, s, s), mat, x, s / 2, z, true);
  b.rotation.y = Math.random() * Math.PI;
}

function placePillar(x, z) {
  const { THREE, CONFIG } = getLevelContext();

  mkMesh(
    new THREE.BoxGeometry(0.9, CONFIG.ROOM_HEIGHT, 0.9),
    new THREE.MeshLambertMaterial({ color: 0x2b241f }),
    x,
    CONFIG.ROOM_HEIGHT / 2,
    z,
    true
  );
}

function placeBookshelves(x, z, w) {
  const { THREE } = getLevelContext();

  const bodyMat = new THREE.MeshLambertMaterial({ color: 0xd8cfbb });
  const sideMat = new THREE.MeshLambertMaterial({ color: 0xc9bda6 });
  const doorMat = new THREE.MeshLambertMaterial({ color: 0xe6dcc8 });
  const trimMat = new THREE.MeshLambertMaterial({ color: 0xb59864 });
  const shadowMat = new THREE.MeshLambertMaterial({ color: 0xb8ac93 });

  for (let i = 0; i < 4; i++) {
    const sx = x - w * 0.5 + i * (w / 3);
    const sz = z - 5;

    mkMesh(new THREE.BoxGeometry(1.4, 3.0, 1.0), bodyMat, sx, 1.5, sz, true);

    mkMeshRaw(new THREE.BoxGeometry(1.24, 2.82, 0.86), sideMat, sx, 1.45, sz);

    mkMeshRaw(new THREE.BoxGeometry(0.08, 2.95, 1.0), sideMat, sx - 0.66, 1.5, sz);
    mkMeshRaw(new THREE.BoxGeometry(0.08, 2.95, 1.0), sideMat, sx + 0.66, 1.5, sz);

    mkMeshRaw(new THREE.BoxGeometry(1.28, 0.08, 0.92), sideMat, sx, 2.96, sz);
    mkMeshRaw(new THREE.BoxGeometry(1.22, 0.10, 0.88), shadowMat, sx, 0.08, sz);
    const frontZ = sz + 0.47;

    mkMeshRaw(new THREE.BoxGeometry(0.60, 2.72, 0.06), doorMat, sx - 0.31, 1.45, frontZ);
    mkMeshRaw(new THREE.BoxGeometry(0.60, 2.72, 0.06), doorMat, sx + 0.31, 1.45, frontZ);

    mkMeshRaw(new THREE.BoxGeometry(0.06, 2.75, 0.07), trimMat, sx, 1.45, frontZ);

    mkMeshRaw(new THREE.BoxGeometry(1.24, 0.05, 0.07), trimMat, sx, 0.92, frontZ);
    mkMeshRaw(new THREE.BoxGeometry(1.24, 0.05, 0.07), trimMat, sx, 1.98, frontZ);

    mkMeshRaw(new THREE.BoxGeometry(0.04, 0.16, 0.03), trimMat, sx - 0.06, 1.45, frontZ + 0.03);
    mkMeshRaw(new THREE.BoxGeometry(0.04, 0.16, 0.03), trimMat, sx + 0.06, 1.45, frontZ + 0.03);

    mkMeshRaw(new THREE.BoxGeometry(1.22, 2.72, 0.04), sideMat, sx, 1.45, sz - 0.47);
  }
}


function placeShelfRow(x, z, count) {
  const { THREE } = getLevelContext();

  const body = new THREE.MeshLambertMaterial({
    color: 0x4a6a5a,
    polygonOffset: true,
    polygonOffsetFactor: 1,
    polygonOffsetUnits: 1
  });

  const dark = new THREE.MeshLambertMaterial({ color: 0x2a3d33 });
  const handle = new THREE.MeshLambertMaterial({ color: 0xc8d8d0 });
  const trim = new THREE.MeshLambertMaterial({ color: 0x1e2e28 });

  const ROWS = 5;
  const drawerH = 0.44;
  const spacing = 2.0;

  for (let i = 0; i < count; i++) {
    const zz = z + (i - (count - 1) / 2) * spacing;

    mkMesh(new THREE.BoxGeometry(1.18, 2.9, 0.88), body, x, 1.45, zz, true);

    mkMeshRaw(new THREE.BoxGeometry(1.2, 0.06, 0.9), dark, x, 2.93, zz);
    mkMeshRaw(new THREE.BoxGeometry(1.2, 0.06, 0.9), dark, x, 0.03, zz);

    mkMeshRaw(new THREE.BoxGeometry(0.06, 2.9, 0.9), dark, x - 0.57, 1.45, zz);
    mkMeshRaw(new THREE.BoxGeometry(0.06, 2.9, 0.9), dark, x + 0.57, 1.45, zz);

    for (let d = 0; d < ROWS; d++) {
      const dy = 0.30 + d * drawerH;

      const frontOffset = 0.50;

      mkMeshRaw(
        new THREE.BoxGeometry(1.06, drawerH - 0.04, 0.04),
        body,
        x,
        dy + drawerH / 2,
        zz - frontOffset
      );

      mkMeshRaw(
        new THREE.BoxGeometry(1.10, 0.02, 0.05),
        trim,
        x,
        dy,
        zz - frontOffset
      );

      mkMeshRaw(
        new THREE.BoxGeometry(0.28, 0.04, 0.03),
        handle,
        x,
        dy + drawerH / 2,
        zz - frontOffset - 0.03
      );

      mkMeshRaw(
        new THREE.BoxGeometry(1.06, drawerH - 0.04, 0.04),
        body,
        x,
        dy + drawerH / 2,
        zz + frontOffset
      );

      mkMeshRaw(
        new THREE.BoxGeometry(1.10, 0.02, 0.05),
        trim,
        x,
        dy,
        zz + frontOffset
      );

      mkMeshRaw(
        new THREE.BoxGeometry(0.28, 0.04, 0.03),
        handle,
        x,
        dy + drawerH / 2,
        zz + frontOffset + 0.03
      );
    }
  }
}

function placeReceptionDesk(x, z) {
  const { THREE } = getLevelContext();

  const wood = new THREE.MeshLambertMaterial({ color: 0x5a3a24 });
  const trim = new THREE.MeshLambertMaterial({
    color: 0xb88a52,
    emissive: new THREE.Color(0x22160a)
  });

  mkMesh(new THREE.BoxGeometry(6.5, 1.4, 1.8), wood, x, 0.7, z, true);
  mkMesh(new THREE.BoxGeometry(6.8, 0.16, 2.0), trim, x, 1.45, z, false);
  mkMesh(new THREE.BoxGeometry(6.2, 0.22, 0.08), trim, x, 0.55, z + 0.94, false);
}

function placeReceptionMonitor(x, z, rotY) {
  const { THREE } = getLevelContext();

  const standMat = new THREE.MeshLambertMaterial({ color: 0x111111 });
  const frameMat = new THREE.MeshLambertMaterial({ color: 0x555555 });
  const screenMat = new THREE.MeshLambertMaterial({
    color: 0x9fb9cc,
    emissive: new THREE.Color(0x1a2630)
  });

  const base = mkMesh(new THREE.BoxGeometry(0.36, 0.08, 0.36), standMat, x, 1.56, z, false);
  const neck = mkMesh(new THREE.BoxGeometry(0.06, 0.42, 0.06), standMat, x, 1.82, z - 0.10, false);
  const arm = mkMesh(new THREE.BoxGeometry(0.22, 0.06, 0.10), standMat, x, 2.02, z - 0.06, false);
  const frame = mkMesh(new THREE.BoxGeometry(1.12, 0.72, 0.10), frameMat, x, 2.08, z + 0.04, false);
  const screen = mkMeshRaw(new THREE.BoxGeometry(0.90, 0.50, 0.01), screenMat, x, 2.08, z + 0.091);

  base.rotation.y = rotY;
  neck.rotation.y = rotY;
  arm.rotation.y = rotY;
  frame.rotation.y = rotY;
  screen.rotation.y = rotY;
}

function placeChairWide(x, z) {
  const { THREE } = getLevelContext();
  const mat = new THREE.MeshLambertMaterial({ color: 0x2f2016 });

  mkMesh(new THREE.BoxGeometry(1.0, 0.12, 1.0), mat, x, 0.55, z, true);
  mkMesh(new THREE.BoxGeometry(1.0, 1.0, 0.1), mat, x, 1.05, z + 0.42, true);
}

function placeLobbyPedestal(x, z) {
  const { THREE } = getLevelContext();

  const mat = new THREE.MeshLambertMaterial({ color: 0xc9c1b1 });
  mkMesh(new THREE.BoxGeometry(0.9, 1.8, 0.9), mat, x, 0.9, z, true);

  const top = new THREE.MeshLambertMaterial({
    color: 0x8a6a42,
    emissive: new THREE.Color(0x110b04)
  });

  mkMesh(new THREE.BoxGeometry(0.55, 0.35, 0.55), top, x, 1.95, z, false);
}

function placeLobbySofa(x, z, rotY) {
  const { THREE, scene, collidables } = getLevelContext();
  rotY = rotY || 0;

  const baseMat = new THREE.MeshLambertMaterial({ color: 0x5a4636 });
  const seatMat = new THREE.MeshLambertMaterial({ color: 0xd9cfbf });

  const sofa = new THREE.Group();
  sofa.position.set(x, 0, z);
  sofa.rotation.y = rotY;
  scene.add(sofa);

  function addPart(geo, mat, px, py, pz) {
    const m = new THREE.Mesh(geo, mat);
    m.position.set(px, py, pz);
    m.castShadow = true;
    m.receiveShadow = true;
    sofa.add(m);
    return m;
  }

  addPart(new THREE.BoxGeometry(2.6, 0.75, 1.1), baseMat, 0, 0.38, 0);
  addPart(new THREE.BoxGeometry(2.3, 0.22, 0.9), seatMat, 0, 0.7, 0);
  addPart(new THREE.BoxGeometry(2.3, 0.9, 0.18), seatMat, 0, 1.05, -0.44);
  addPart(new THREE.BoxGeometry(0.22, 0.8, 1.0), baseMat, -1.18, 0.75, 0);
  addPart(new THREE.BoxGeometry(0.22, 0.8, 1.0), baseMat, 1.18, 0.75, 0);

  const col = new THREE.Mesh(
    new THREE.BoxGeometry(2.7, 1.5, 1.2),
    new THREE.MeshBasicMaterial()
  );
  col.position.set(x, 0.75, z);
  col.rotation.y = rotY;
  col.visible = false;
  scene.add(col);
  collidables.push(col);
}

function placeOperationTableDetailed(x, z) {
  const { THREE, scene, collidables } = getLevelContext();

  const metal = new THREE.MeshLambertMaterial({ color: 0x5f666b });
  const dark = new THREE.MeshLambertMaterial({ color: 0x1e2124 });
  const top = new THREE.MeshLambertMaterial({ color: 0x7a8086 });

  const col = new THREE.Mesh(
    new THREE.BoxGeometry(3.8, 1.45, 1.95),
    new THREE.MeshBasicMaterial()
  );
  col.position.set(x, 0.73, z);
  col.visible = false;
  scene.add(col);
  collidables.push(col);

  mkMesh(new THREE.BoxGeometry(0.28, 0.9, 0.95), metal, x - 1.45, 0.45, z, false);
  mkMesh(new THREE.BoxGeometry(0.28, 0.9, 0.95), metal, x + 1.45, 0.45, z, false);
  mkMesh(new THREE.BoxGeometry(0.55, 0.07, 1.2), metal, x - 1.45, 0.04, z, false);
  mkMesh(new THREE.BoxGeometry(0.55, 0.07, 1.2), metal, x + 1.45, 0.04, z, false);
  mkMesh(new THREE.BoxGeometry(2.8, 0.1, 0.1), metal, x, 0.1, z, false);

  mkMesh(new THREE.BoxGeometry(3.5, 0.13, 1.5), top, x, 0.97, z, false);
  mkMesh(new THREE.BoxGeometry(3.15, 0.11, 1.28), dark, x, 1.09, z, false);
  mkMesh(new THREE.BoxGeometry(0.82, 0.13, 1.28), top, x - 1.45, 1.2, z, false);

  const rz1 = z - 0.84;
  mkMesh(new THREE.BoxGeometry(0.05, 0.33, 0.05), metal, x - 1.1, 1.14, rz1, false);
  mkMesh(new THREE.BoxGeometry(0.05, 0.33, 0.05), metal, x, 1.14, rz1, false);
  mkMesh(new THREE.BoxGeometry(0.05, 0.33, 0.05), metal, x + 1.1, 1.14, rz1, false);
  mkMesh(new THREE.BoxGeometry(2.45, 0.05, 0.05), metal, x, 1.30, rz1, false);
  mkMesh(new THREE.BoxGeometry(2.45, 0.05, 0.05), metal, x, 1.10, rz1, false);

  const rz2 = z + 0.84;
  mkMesh(new THREE.BoxGeometry(0.05, 0.33, 0.05), metal, x - 1.1, 1.14, rz2, false);
  mkMesh(new THREE.BoxGeometry(0.05, 0.33, 0.05), metal, x, 1.14, rz2, false);
  mkMesh(new THREE.BoxGeometry(0.05, 0.33, 0.05), metal, x + 1.1, 1.14, rz2, false);
  mkMesh(new THREE.BoxGeometry(2.45, 0.05, 0.05), metal, x, 1.30, rz2, false);
  mkMesh(new THREE.BoxGeometry(2.45, 0.05, 0.05), metal, x, 1.10, rz2, false);

  mkMesh(new THREE.BoxGeometry(0.07, 2.1, 0.07), metal, x - 1.9, 1.05, z - 0.5, false);
  mkMesh(new THREE.BoxGeometry(0.07, 0.07, 0.55), metal, x - 1.9, 2.1, z - 0.25, false);
}

function placeLabCabinet(x, z) {
  const { THREE, scene, collidables } = getLevelContext();

  const body = new THREE.MeshLambertMaterial({ color: 0x4e7070 });
  const door = new THREE.MeshLambertMaterial({ color: 0x6a9292 });
  const trim = new THREE.MeshLambertMaterial({ color: 0x2e4848 });
  const handle = new THREE.MeshLambertMaterial({ color: 0xc8e0e0 });

  const col = new THREE.Mesh(
    new THREE.BoxGeometry(1.6, 2.4, 1.5),
    new THREE.MeshBasicMaterial()
  );
  col.position.set(x, 1.2, z);
  col.visible = false;
  scene.add(col);
  collidables.push(col);

  mkMesh(new THREE.BoxGeometry(1.5, 2.35, 1.4), body, x, 1.18, z, false);

  const fz = z + 0.72;
  mkMesh(new THREE.BoxGeometry(0.68, 1.05, 0.06), door, x - 0.38, 1.78, fz, false);
  mkMesh(new THREE.BoxGeometry(0.68, 1.05, 0.06), door, x + 0.38, 1.78, fz, false);
  mkMesh(new THREE.BoxGeometry(0.05, 1.12, 0.08), trim, x, 1.78, fz, false);
  mkMesh(new THREE.BoxGeometry(1.55, 0.06, 0.09), trim, x, 1.2, fz, false);

  mkMesh(new THREE.BoxGeometry(0.68, 0.88, 0.06), door, x - 0.38, 0.6, fz, false);
  mkMesh(new THREE.BoxGeometry(0.68, 0.88, 0.06), door, x + 0.38, 0.6, fz, false);
  mkMesh(new THREE.BoxGeometry(0.05, 0.95, 0.08), trim, x, 0.6, fz, false);

  mkMesh(new THREE.BoxGeometry(0.22, 0.04, 0.04), handle, x - 0.38, 1.35, fz + 0.04, false);
  mkMesh(new THREE.BoxGeometry(0.22, 0.04, 0.04), handle, x + 0.38, 1.35, fz + 0.04, false);
  mkMesh(new THREE.BoxGeometry(0.22, 0.04, 0.04), handle, x - 0.38, 0.62, fz + 0.04, false);
  mkMesh(new THREE.BoxGeometry(0.22, 0.04, 0.04), handle, x + 0.38, 0.62, fz + 0.04, false);
}

function placeLabConsole(x, z) {
  const { THREE, scene, collidables } = getLevelContext();

  const body = new THREE.MeshLambertMaterial({ color: 0x3e4a4f });
  const screen = new THREE.MeshLambertMaterial({
    color: 0x9fd8d8,
    emissive: new THREE.Color(0x1d4444)
  });

  const col = new THREE.Mesh(
    new THREE.BoxGeometry(1.5, 1.5, 0.8),
    new THREE.MeshBasicMaterial()
  );
  col.position.set(x, 0.75, z);
  col.visible = false;
  scene.add(col);
  collidables.push(col);

  mkMesh(new THREE.BoxGeometry(1.5, 0.75, 0.7), body, x, 0.38, z, false);
  mkMesh(new THREE.BoxGeometry(1.5, 0.10, 0.78), body, x, 0.78, z, false);

  mkMesh(new THREE.BoxGeometry(0.64, 0.52, 0.07), body, x - 0.37, 1.18, z, false);
  mkMeshRaw(new THREE.BoxGeometry(0.50, 0.38, 0.02), screen, x - 0.37, 1.18, z + 0.04);

  mkMesh(new THREE.BoxGeometry(0.64, 0.52, 0.07), body, x + 0.37, 1.18, z, false);
  mkMeshRaw(new THREE.BoxGeometry(0.50, 0.38, 0.02), screen, x + 0.37, 1.18, z + 0.04);
}

function placeCylinderCanister(x, z) {
  const { THREE, scene, collidables } = getLevelContext();

  const body = new THREE.MeshLambertMaterial({ color: 0x8ab7b7 });
  const top = new THREE.MeshLambertMaterial({ color: 0xcdeeee });

  const col = new THREE.Mesh(
    new THREE.CylinderGeometry(0.45, 0.45, 1.7, 12),
    new THREE.MeshBasicMaterial()
  );
  col.position.set(x, 0.85, z);
  col.visible = false;
  scene.add(col);
  collidables.push(col);

  mkMesh(new THREE.CylinderGeometry(0.42, 0.45, 1.55, 16), body, x, 0.78, z, false);
  mkMesh(new THREE.CylinderGeometry(0.30, 0.30, 0.08, 16), top, x, 1.60, z, false);
  mkMesh(new THREE.CylinderGeometry(0.10, 0.10, 0.22, 10), top, x, 1.72, z, false);
}

function placeStorageBoxes(x, z) {
  const { THREE } = getLevelContext();

  for (let i = 0; i < 3; i++) {
    const s = 0.8 + Math.random() * 0.6;

    mkMesh(
      new THREE.BoxGeometry(s, s, s),
      new THREE.MeshLambertMaterial({ color: 0x5a3a22 }),
      x + (Math.random() - 0.5) * 1.5,
      s / 2,
      z + (Math.random() - 0.5) * 1.5,
      true
    );
  }
}

function placeCeilingLightPanel(x, y, z, w, d) {
  const { THREE, scene, pointLights } = getLevelContext();

  const panel = new THREE.Mesh(
    new THREE.BoxGeometry(w, 0.06, d),
    MAT.whitePanel
  );
  panel.position.set(x, y, z);
  scene.add(panel);

  const light = new THREE.PointLight(0xf7fcff, 1.15, 10);
  light.position.set(x, y - 0.15, z);
  scene.add(light);
  pointLights.push(light);
}

function placeMorgueTable(x, z) {
  const { THREE, scene, collidables } = getLevelContext();

  const metal = MAT.metal;
  const metalDark = MAT.metalDark;

  const col = new THREE.Mesh(
    new THREE.BoxGeometry(2.8, 1.2, 1.2),
    new THREE.MeshBasicMaterial()
  );
  col.position.set(x, 0.6, z);
  col.visible = false;
  scene.add(col);
  collidables.push(col);

  mkMesh(new THREE.BoxGeometry(2.6, 0.12, 1.0), metal, x, 0.95, z, false);
  mkMesh(new THREE.BoxGeometry(2.3, 0.04, 0.7), metalDark, x, 1.02, z, false);

  mkMesh(new THREE.BoxGeometry(0.08, 0.85, 0.08), metal, x - 1.0, 0.42, z - 0.35, false);
  mkMesh(new THREE.BoxGeometry(0.08, 0.85, 0.08), metal, x + 1.0, 0.42, z - 0.35, false);
  mkMesh(new THREE.BoxGeometry(0.08, 0.85, 0.08), metal, x - 1.0, 0.42, z + 0.35, false);
  mkMesh(new THREE.BoxGeometry(0.08, 0.85, 0.08), metal, x + 1.0, 0.42, z + 0.35, false);

  mkMesh(new THREE.BoxGeometry(2.1, 0.05, 0.05), metalDark, x, 0.18, z - 0.35, false);
  mkMesh(new THREE.BoxGeometry(2.1, 0.05, 0.05), metalDark, x, 0.18, z + 0.35, false);
}

function placeMetalCart(x, z) {
  const { THREE, scene, collidables } = getLevelContext();

  const metal = MAT.metal;
  const dark = MAT.metalDark;

  const col = new THREE.Mesh(
    new THREE.BoxGeometry(1.4, 1.4, 0.9),
    new THREE.MeshBasicMaterial()
  );
  col.position.set(x, 0.7, z);
  col.visible = false;
  scene.add(col);
  collidables.push(col);

  mkMesh(new THREE.BoxGeometry(1.2, 0.08, 0.8), metal, x, 0.95, z, false);
  mkMesh(new THREE.BoxGeometry(1.2, 0.08, 0.8), metal, x, 0.35, z, false);

  mkMesh(new THREE.BoxGeometry(0.06, 0.95, 0.06), dark, x - 0.5, 0.48, z - 0.3, false);
  mkMesh(new THREE.BoxGeometry(0.06, 0.95, 0.06), dark, x + 0.5, 0.48, z - 0.3, false);
  mkMesh(new THREE.BoxGeometry(0.06, 0.95, 0.06), dark, x - 0.5, 0.48, z + 0.3, false);
  mkMesh(new THREE.BoxGeometry(0.06, 0.95, 0.06), dark, x + 0.5, 0.48, z + 0.3, false);

  mkMesh(new THREE.CylinderGeometry(0.08, 0.08, 0.05, 10), dark, x - 0.5, 0.08, z - 0.3, false);
  mkMesh(new THREE.CylinderGeometry(0.08, 0.08, 0.05, 10), dark, x + 0.5, 0.08, z - 0.3, false);
  mkMesh(new THREE.CylinderGeometry(0.08, 0.08, 0.05, 10), dark, x - 0.5, 0.08, z + 0.3, false);
  mkMesh(new THREE.CylinderGeometry(0.08, 0.08, 0.05, 10), dark, x + 0.5, 0.08, z + 0.3, false);
}

function placeBodyLockers(x, z, cols, rows) {
  const { THREE, scene, collidables } = getLevelContext();

  const body = new THREE.MeshLambertMaterial({ color: 0x4c555b });
  const door = new THREE.MeshLambertMaterial({ color: 0x9aa6ad });
  const handle = new THREE.MeshLambertMaterial({ color: 0xe3eaee });

  const totalW = cols * 1.15;
  const totalH = rows * 1.25;

  const col = new THREE.Mesh(
    new THREE.BoxGeometry(totalW, totalH, 1.1),
    new THREE.MeshBasicMaterial()
  );
  col.position.set(x, totalH / 2, z);
  col.visible = false;
  scene.add(col);
  collidables.push(col);

  mkMesh(new THREE.BoxGeometry(totalW, totalH, 1.0), body, x, totalH / 2, z, false);

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const px = x - totalW / 2 + 0.575 + c * 1.15;
      const py = 0.625 + r * 1.25;
      const pz = z + 0.52;

      mkMeshRaw(new THREE.BoxGeometry(1.0, 1.05, 0.05), door, px, py, pz);
      mkMeshRaw(new THREE.BoxGeometry(0.18, 0.06, 0.06), handle, px, py, pz + 0.03);
    }
  }
}

function placeSinkCounter(x, z, len) {
  const { THREE, scene, collidables } = getLevelContext();

  const base = new THREE.MeshLambertMaterial({ color: 0x7b8c95 });
  const top = new THREE.MeshLambertMaterial({ color: 0xa8b7be });
  const dark = new THREE.MeshLambertMaterial({ color: 0x4e5b61 });

  const col = new THREE.Mesh(
    new THREE.BoxGeometry(1.0, 1.0, len),
    new THREE.MeshBasicMaterial()
  );
  col.position.set(x, 0.5, z);
  col.visible = false;
  scene.add(col);
  collidables.push(col);

  mkMesh(new THREE.BoxGeometry(0.9, 0.9, len), base, x, 0.45, z, false);
  mkMesh(new THREE.BoxGeometry(1.05, 0.08, len + 0.1), top, x, 0.94, z, false);

  mkMeshRaw(new THREE.BoxGeometry(0.42, 0.06, 0.7), dark, x, 0.98, z - 1.6);
  mkMeshRaw(new THREE.BoxGeometry(0.42, 0.06, 0.7), dark, x, 0.98, z + 1.6);

  mkMeshRaw(new THREE.BoxGeometry(0.05, 0.35, 0.05), dark, x, 1.18, z - 1.6);
  mkMeshRaw(new THREE.BoxGeometry(0.18, 0.05, 0.05), dark, x + 0.08, 1.33, z - 1.6);

  mkMeshRaw(new THREE.BoxGeometry(0.05, 0.35, 0.05), dark, x, 1.18, z + 1.6);
  mkMeshRaw(new THREE.BoxGeometry(0.18, 0.05, 0.05), dark, x + 0.08, 1.33, z + 1.6);
}

function placeMetalBench(x, z, len) {
  const { THREE, scene, collidables } = getLevelContext();

  const metal = MAT.metal;
  const dark = MAT.metalDark;

  const col = new THREE.Mesh(
    new THREE.BoxGeometry(len, 1.1, 0.8),
    new THREE.MeshBasicMaterial()
  );
  col.position.set(x, 0.55, z);
  col.visible = false;
  scene.add(col);
  collidables.push(col);

  mkMesh(new THREE.BoxGeometry(len, 0.08, 0.7), metal, x, 0.95, z, false);

  mkMesh(new THREE.BoxGeometry(0.06, 0.9, 0.06), dark, x - len / 2 + 0.2, 0.45, z - 0.25, false);
  mkMesh(new THREE.BoxGeometry(0.06, 0.9, 0.06), dark, x + len / 2 - 0.2, 0.45, z - 0.25, false);
  mkMesh(new THREE.BoxGeometry(0.06, 0.9, 0.06), dark, x - len / 2 + 0.2, 0.45, z + 0.25, false);
  mkMesh(new THREE.BoxGeometry(0.06, 0.9, 0.06), dark, x + len / 2 - 0.2, 0.45, z + 0.25, false);
}

function placeCurtainDivider(x, z, len) {
  mkMesh(new THREE.BoxGeometry(len, 0.05, 0.05), MAT.metalDark, x, 1.82, z, true);
  mkMesh(new THREE.BoxGeometry(len, 1.7, 0.06), MAT.curtain, x, 0.92, z, true);
}


function placeBasementCrate(x, z, sx, sy, sz) {
  const { THREE } = getLevelContext();

  const wood = new THREE.MeshLambertMaterial({ color: 0x3a2c20 });
  const trim = new THREE.MeshLambertMaterial({ color: 0x22170f });

  sx = sx || 1.2;
  sy = sy || 1.0;
  sz = sz || 1.2;

  mkMesh(new THREE.BoxGeometry(sx, sy, sz), wood, x, sy / 2, z, true);

  mkMeshRaw(new THREE.BoxGeometry(sx + 0.02, 0.06, sz + 0.02), trim, x, sy - 0.08, z);
  mkMeshRaw(new THREE.BoxGeometry(0.08, sy - 0.12, sz + 0.02), trim, x - sx * 0.32, sy / 2, z);
  mkMeshRaw(new THREE.BoxGeometry(0.08, sy - 0.12, sz + 0.02), trim, x + sx * 0.32, sy / 2, z);
}


function placeElectricLever(x, z) {
  const { THREE, scene, interactables } = getLevelContext();

  const metal = new THREE.MeshLambertMaterial({ color: 0x3d4d5f });
  const handle = new THREE.MeshLambertMaterial({ color: 0xc0d0e0 });

  mkMesh(new THREE.BoxGeometry(0.4, 0.8, 0.4), metal, x, 0.4, z, false);
  mkMesh(new THREE.BoxGeometry(0.35, 0.05, 0.35), metal, x, 0.08, z, false);

  const leverArm = new THREE.Mesh(
    new THREE.BoxGeometry(0.12, 0.6, 0.12),
    handle
  );
  leverArm.position.set(x, 0.9, z);
  leverArm.rotation.z = -Math.PI / 6; // inclinado hacia abajo
  scene.add(leverArm);

  interactables.push({
    type: 'electric_lever',
    mesh: leverArm,
    position: new THREE.Vector3(x, 0.9, z),
    label: 'Enciende la energía',
    leverArm: leverArm,
    x: x,
    z: z
  });
}


