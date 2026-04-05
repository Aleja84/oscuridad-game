function decorFinal(room) {
  const { THREE, scene, pointLights } = getLevelContext();
  const x = room.x;
  const z = room.z;

  const metalDark = new THREE.MeshLambertMaterial({ color: 0x1a2a22 });
  const metalMid = new THREE.MeshLambertMaterial({ color: 0x2e4a3a });
  const metalLight = new THREE.MeshLambertMaterial({ color: 0x3d6050 });
  const panelMat = new THREE.MeshLambertMaterial({ color: 0x1c2e28 });

  const accentGrn = new THREE.MeshLambertMaterial({
    color: 0x00cc66,
    emissive: new THREE.Color(0x003311)
  });

  const accentOrg = new THREE.MeshLambertMaterial({
    color: 0xdd7700,
    emissive: new THREE.Color(0x331a00)
  });

  const pipeMat = new THREE.MeshLambertMaterial({ color: 0x4a6055 });

  function cornerUnit(cx, cz) {
    mkMesh(new THREE.BoxGeometry(2.4, 2.2, 2.4), metalDark, cx, 1.1, cz, true);

    mkMesh(new THREE.BoxGeometry(2.2, 0.6, 0.12), metalMid, cx, 2.1, cz + 1.3, false);
    mkMesh(new THREE.BoxGeometry(2.0, 0.12, 0.1), accentOrg, cx, 1.8, cz + 1.3, false);
    mkMesh(new THREE.BoxGeometry(2.0, 0.12, 0.1), accentOrg, cx, 0.4, cz + 1.3, false);

    mkMeshRaw(
      new THREE.BoxGeometry(0.8, 0.5, 0.06),
      new THREE.MeshLambertMaterial({ color: 0x00ff88, emissive: new THREE.Color(0x004422) }),
      cx - 0.5, 1.4, cz + 1.32
    );

    mkMeshRaw(
      new THREE.BoxGeometry(0.5, 0.5, 0.06),
      new THREE.MeshLambertMaterial({ color: 0x00ff88, emissive: new THREE.Color(0x004422) }),
      cx + 0.6, 1.4, cz + 1.32
    );

    const gl = new THREE.PointLight(0x00ff88, 0.5, 4);
    gl.position.set(cx, 1.8, cz + 1.7);
    scene.add(gl);
    pointLights.push(gl);
  }

  function cornerUnitBack(cx, cz) {
    mkMesh(new THREE.BoxGeometry(2.4, 2.2, 2.4), metalDark, cx, 1.1, cz, true);

    mkMesh(new THREE.BoxGeometry(2.2, 0.6, 0.12), metalMid, cx, 2.1, cz - 1.3, false);
    mkMesh(new THREE.BoxGeometry(2.0, 0.12, 0.1), accentOrg, cx, 1.8, cz - 1.3, false);
    mkMesh(new THREE.BoxGeometry(2.0, 0.12, 0.1), accentOrg, cx, 0.4, cz - 1.3, false);

    mkMeshRaw(
      new THREE.BoxGeometry(0.8, 0.5, 0.06),
      new THREE.MeshLambertMaterial({ color: 0x00ff88, emissive: new THREE.Color(0x004422) }),
      cx - 0.5, 1.4, cz - 1.32
    );

    mkMeshRaw(
      new THREE.BoxGeometry(0.5, 0.5, 0.06),
      new THREE.MeshLambertMaterial({ color: 0x00ff88, emissive: new THREE.Color(0x004422) }),
      cx + 0.6, 1.4, cz - 1.32
    );

    const gl = new THREE.PointLight(0x00ff88, 0.5, 4);
    gl.position.set(cx, 1.8, cz - 1.7);
    scene.add(gl);
    pointLights.push(gl);
  }

  cornerUnit(x - 5.5, z - 5.5);
  cornerUnit(x + 5.5, z - 5.5);
  cornerUnitBack(x - 5.5, z + 5.5);
  cornerUnitBack(x + 5.5, z + 5.5);

  mkMesh(new THREE.BoxGeometry(2.4, 2.0, 0.4), panelMat, x, 1.0, z - 3.5, true);

  for (let p = 0; p < 3; p++) {
    mkMeshRaw(
      new THREE.BoxGeometry(0.5, 0.4, 0.05),
      new THREE.MeshLambertMaterial({ color: 0x00dd77, emissive: new THREE.Color(0x003322) }),
      x - 0.5 + p * 0.5,
      1.2,
      z - 3.3
    );
  }

  mkMesh(new THREE.BoxGeometry(2.2, 0.08, 0.3), accentGrn, x, 0.2, z - 3.5, false);

  mkMesh(new THREE.BoxGeometry(6.0, 0.06, 6.0), metalMid, x, 0.02, z, false);
  mkMesh(new THREE.BoxGeometry(5.6, 0.04, 5.6), metalLight, x, 0.05, z, false);

  const mainLight = new THREE.PointLight(0x44ffaa, 0.9, 18);
  mainLight.position.set(x, 3.0, z);
  scene.add(mainLight);
  pointLights.push(mainLight);

  placeRoomRewards(room);
}