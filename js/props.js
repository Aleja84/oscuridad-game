function placeChair(x, z, rotY) {
  rotY = rotY || 0;
  var wood = new THREE.MeshLambertMaterial({ color: 0x7a5a3a });
  var seat = new THREE.MeshLambertMaterial({ color: 0xb8926a });
  var chair = new THREE.Group();
  chair.position.set(x, 0, z);
  chair.rotation.y = rotY;
  scene.add(chair);
  function addPart(geo, mat, px, py, pz) {
    var m = new THREE.Mesh(geo, mat);
    m.position.set(px, py, pz);
    m.castShadow = true; m.receiveShadow = true;
    chair.add(m);
  }
  addPart(new THREE.BoxGeometry(0.78, 0.10, 0.78), seat, 0, 0.52, 0);
  addPart(new THREE.BoxGeometry(0.78, 0.85, 0.10), seat, 0, 0.95, -0.34);
  addPart(new THREE.BoxGeometry(0.08, 0.52, 0.08), wood, -0.28, 0.26, -0.28);
  addPart(new THREE.BoxGeometry(0.08, 0.52, 0.08), wood,  0.28, 0.26, -0.28);
  addPart(new THREE.BoxGeometry(0.08, 0.52, 0.08), wood, -0.28, 0.26,  0.28);
  addPart(new THREE.BoxGeometry(0.08, 0.52, 0.08), wood,  0.28, 0.26,  0.28);
  var col = new THREE.Mesh(new THREE.BoxGeometry(0.82, 1.15, 0.82), new THREE.MeshBasicMaterial());
  col.position.set(x, 0.58, z);
  col.rotation.y = rotY;
  col.visible = false;
  scene.add(col); collidables.push(col);
}

function placeTable(x, z) {
  var mat = new THREE.MeshLambertMaterial({ color: 0x3d2b1f });
  mkMesh(new THREE.BoxGeometry(3.2, 0.14, 1.8), mat, x, 0.95, z, true);
  [[1.35,0.7],[1.35,-0.7],[-1.35,0.7],[-1.35,-0.7]].forEach(function(p) {
    mkMesh(new THREE.BoxGeometry(0.12, 0.95, 0.12), mat, x + p[0], 0.47, z + p[1], false);
  });
}

function placeBox(x, z) {
  var s = 0.8 + Math.random() * 0.8;
  var mat = new THREE.MeshLambertMaterial({ color: 0x2a1f10 + Math.floor(Math.random() * 0x101010) });
  var b = mkMesh(new THREE.BoxGeometry(s, s, s), mat, x, s / 2, z, true);
  b.rotation.y = Math.random() * Math.PI;
}

function placePillar(x, z) {
  mkMesh(
    new THREE.BoxGeometry(0.9, CONFIG.ROOM_HEIGHT, 0.9),
    new THREE.MeshLambertMaterial({ color: 0x2b241f }),
    x, CONFIG.ROOM_HEIGHT / 2, z, true
  );
}

function placeGurneySingle(x, z) {
  mkMesh(new THREE.BoxGeometry(0.7, 0.1, 2),
    new THREE.MeshLambertMaterial({ color: 0x888888 }), x, 0.9, z, true);
  mkMeshRaw(new THREE.BoxGeometry(0.55, 0.18, 1.8),
    new THREE.MeshLambertMaterial({ color: 0xd8d0c0 }), x, 1.05, z);
}

function placeSmallPedestal(x, z) {
  mkMesh(new THREE.CylinderGeometry(0.45, 0.55, 0.9, 10),
    new THREE.MeshLambertMaterial({ color: 0x4a4a52 }), x, 0.45, z, true);
}

function placeCounter(x, z, len) {
  mkMesh(new THREE.BoxGeometry(len, 1.2, 1.1),
    new THREE.MeshLambertMaterial({ color: 0x6d6d6d }), x, 0.6, z, true);
}

function placeComputer(x, z) {
  mkMesh(new THREE.BoxGeometry(0.8, 0.6, 0.1),
    new THREE.MeshLambertMaterial({ color: 0x111111 }), x, 1.3, z, true);
  mkMeshRaw(new THREE.BoxGeometry(0.7, 0.5, 0.02),
    new THREE.MeshLambertMaterial({ color: 0x002244, emissive: new THREE.Color(0x001122) }), x, 1.3, z - 0.07);
  var g = new THREE.PointLight(0x004488, 0.3, 2);
  g.position.set(x, 1.3, z - 0.2); scene.add(g);
}
