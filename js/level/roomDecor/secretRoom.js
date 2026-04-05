function decorSecret(room) {
  const { THREE, scene, collidables, pointLights } = getLevelContext();
  const x = room.x;
  const z = room.z;

  const orangeMat = new THREE.MeshLambertMaterial({ color: 0x7a3800 });
  const metalMat = new THREE.MeshLambertMaterial({ color: 0x4a5548 });
  const sackMat = new THREE.MeshLambertMaterial({ color: 0xa89870 });

  function warehouseUnit(ux, uz) {
    [[-0.9, -0.7], [0.9, -0.7], [-0.9, 0.7], [0.9, 0.7]].forEach(function (p) {
      mkMesh(new THREE.BoxGeometry(0.08, 3.0, 0.08), orangeMat, ux + p[0], 1.5, uz + p[1], false);
    });

    [0.6, 1.5, 2.4].forEach(function (h) {
      mkMesh(new THREE.BoxGeometry(1.85, 0.07, 0.07), orangeMat, ux, h, uz - 0.7, false);
      mkMesh(new THREE.BoxGeometry(1.85, 0.07, 0.07), orangeMat, ux, h, uz + 0.7, false);
      mkMesh(new THREE.BoxGeometry(1.78, 0.05, 1.35), metalMat, ux, h + 0.04, uz, false);

      for (let b = 0; b < 3; b++) {
        const bw = 0.42 + Math.random() * 0.28;
        const bh = 0.32 + Math.random() * 0.22;
        mkMeshRaw(
          new THREE.BoxGeometry(bw, bh, 0.58),
          new THREE.MeshLambertMaterial({
            color: 0x6b4a2b + Math.floor(Math.random() * 0x1a1005)
          }),
          ux - 0.55 + b * 0.55,
          h + bh / 2 + 0.06,
          uz
        );
      }
    });

    for (let s = 0; s < 3; s++) {
      mkMeshRaw(
        new THREE.BoxGeometry(0.48, 0.24, 0.42),
        sackMat,
        ux - 0.48 + s * 0.48,
        0.67,
        uz + (s - 1) * 0.28
      );
    }

    const col = new THREE.Mesh(
      new THREE.BoxGeometry(2.0, 3.2, 1.5),
      new THREE.MeshBasicMaterial()
    );
    col.position.set(ux, 1.6, uz);
    col.visible = false;
    scene.add(col);
    collidables.push(col);
  }

  warehouseUnit(x - 5.5, z - 4.0);
  warehouseUnit(x - 5.5, z);
  warehouseUnit(x - 5.5, z + 4.0);

  warehouseUnit(x + 5.5, z - 4.0);
  warehouseUnit(x + 5.5, z);
  warehouseUnit(x + 5.5, z + 4.0);

  placeStorageBoxes(x - 1.5, z + 3.5);
  placeStorageBoxes(x + 1.2, z - 3.0);

  const lgt1 = new THREE.PointLight(0xffaa55, 0.3, 12);
  lgt1.position.set(x, 3.5, z - 2);
  scene.add(lgt1);
  pointLights.push(lgt1);

  const lgt2 = new THREE.PointLight(0xffaa55, 0.2, 9);
  lgt2.position.set(x, 3.5, z + 4);
  scene.add(lgt2);
  pointLights.push(lgt2);

  placeRoomRewards(room);
}