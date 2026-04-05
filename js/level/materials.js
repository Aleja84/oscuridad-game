let MAT = null;

function createMaterials(THREE) {
  const loader = new THREE.TextureLoader();

  function loadRepeatTexture(path, repeatX, repeatY) {
    const tex = loader.load(path);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(repeatX, repeatY);
    tex.encoding = THREE.sRGBEncoding;
    return tex;
  }

  const floorMap = loadRepeatTexture('texturas/pasadizo_piso/textures/stone_tiles_diff_1k.jpg', 5, 5);
  const wallMap = loadRepeatTexture('texturas/pasadizo_pared/textures/coast_sand_rocks_02_diff_1k.jpg', 4, 2);
  const ceilingMap = loadRepeatTexture('texturas/techo/textures/white_plaster_02_diff_1k.jpg', 4, 4);
  const doorMap = loadRepeatTexture('texturas/puerta/Chip006_1K-JPG_Color.jpg', 1, 1);

  const centralFloorMap = loadRepeatTexture('texturas/central_piso/Marble007_1K-JPG_Color.jpg', 4, 4);
  const centralWallMap = loadRepeatTexture('texturas/central_pared/Marble020_1K-JPG_Color.jpg', 3, 2);

  const cocinaFloorMap = loadRepeatTexture('texturas/cocina_piso/textures/brown_floor_tiles_diff_1k.jpg', 4, 4);
  const cocinaWallMap = loadRepeatTexture('texturas/cocina_pared/textures/interior_tiles_diff_1k.jpg', 3, 2);

  const laboratorioFloorMap = loadRepeatTexture('texturas/laboratorio_piso/Granite007A_1K-JPG_Color.jpg', 4, 4);
  const laboratorioWallMap = loadRepeatTexture('texturas/laboratorio_pared/Granite003A_1K-JPG_Color.jpg', 3, 2);

  const bibliotecaFloorMap = loadRepeatTexture('texturas/biblioteca_piso/textures/wood_cabinet_worn_long_diff_1k.jpg', 4, 4);
  const bibliotecaWallMap = loadRepeatTexture('texturas/biblioteca_pared/textures/wooden_garage_door_diff_1k.jpg', 3, 2);

  const sotanoFloorMap = loadRepeatTexture('texturas/sotano_piso/WoodFloor043_1K-JPG_Color.jpg', 4, 4);
  const sotanoWallMap = loadRepeatTexture('texturas/sotano_pared/textures/wood_shutter_diff_1k.jpg', 3, 2);

  const morgueFloorMap = loadRepeatTexture('texturas/morgue_piso/Terrazzo005_1K-JPG_Color.jpg', 4, 4);
  const morgueWallMap = loadRepeatTexture('texturas/morgue_pared/OfficeCeiling006_1K-JPG_Color.jpg', 3, 2);

  const secretoFloorMap = loadRepeatTexture('texturas/secreto_piso/textures/wood_planks_grey_diff_1k.jpg', 4, 4);
  const secretoWallMap = loadRepeatTexture('texturas/secreto_pared/textures/weathered_brown_planks_diff_1k.jpg', 3, 2);

  const finalFloorMap = loadRepeatTexture('texturas/final_piso/textures/metal_grate_rusty_diff_1k.jpg', 4, 4);
  const finalWallMap = loadRepeatTexture('texturas/final_pared/textures/rusty_metal_grid_diff_1k.jpg', 3, 2);

  MAT = {
    floor: new THREE.MeshLambertMaterial({ color: 0x707070, map: floorMap }),
    wall: new THREE.MeshLambertMaterial({ color: 0x9b8f82, map: wallMap }),
    ceiling: new THREE.MeshLambertMaterial({ color: 0xd4d0c8, map: ceilingMap }),

    door: new THREE.MeshLambertMaterial({ color: 0x7b5e43, map: doorMap }),
    doorLocked: new THREE.MeshLambertMaterial({ color: 0x8a6b2a, map: doorMap }),
    doorFrameClosed: new THREE.MeshLambertMaterial({ color: 0x7b5e43, map: doorMap }),
    doorFrameOpen: new THREE.MeshLambertMaterial({ color: 0x8a8f98 }),

    key: new THREE.MeshLambertMaterial({
      color: 0xffcc00,
      emissive: new THREE.Color(0x443300)
    }),

    battery: new THREE.MeshLambertMaterial({
      color: 0x00ff66,
      emissive: new THREE.Color(0x003311)
    }),

    metal: new THREE.MeshLambertMaterial({ color: 0x5b6166 }),
    metalDark: new THREE.MeshLambertMaterial({ color: 0x2f3438 }),
    tileBlue: new THREE.MeshLambertMaterial({ color: 0x3f474c }),
    whitePanel: new THREE.MeshLambertMaterial({
      color: 0x7b746b,
      emissive: new THREE.Color(0x151311)
    }),
    glass: new THREE.MeshLambertMaterial({
      color: 0x9ea8ad,
      transparent: true,
      opacity: 0.08
    }),
    curtain: new THREE.MeshLambertMaterial({
      color: 0x666666,
      transparent: true,
      opacity: 0.16
    }),

    roomSurface: {
      default: {
        floor: new THREE.MeshLambertMaterial({ color: 0x707070, map: floorMap }),
        wall: new THREE.MeshLambertMaterial({ color: 0x9b8f82, map: wallMap })
      },
      0: {
        floor: new THREE.MeshLambertMaterial({ color: 0x707070, map: centralFloorMap }),
        wall: new THREE.MeshLambertMaterial({ color: 0x9b8f82, map: centralWallMap })
      },
      1: {
        floor: new THREE.MeshLambertMaterial({ color: 0x6f6f6f, map: laboratorioFloorMap }),
        wall: new THREE.MeshLambertMaterial({ color: 0x8f8f8f, map: laboratorioWallMap })
      },
      2: {
        floor: new THREE.MeshLambertMaterial({ color: 0x8b8173, map: cocinaFloorMap }),
        wall: new THREE.MeshLambertMaterial({ color: 0x9a9087, map: cocinaWallMap })
      },
      3: {
        floor: new THREE.MeshLambertMaterial({ color: 0x74685a, map: bibliotecaFloorMap }),
        wall: new THREE.MeshLambertMaterial({ color: 0x837569, map: bibliotecaWallMap })
      },
      4: {
        floor: new THREE.MeshLambertMaterial({ color: 0x707070, map: sotanoFloorMap }),
        wall: new THREE.MeshLambertMaterial({ color: 0x7b7268, map: sotanoWallMap })
      },
      5: {
        floor: new THREE.MeshLambertMaterial({ color: 0x746d66, map: secretoFloorMap }),
        wall: new THREE.MeshLambertMaterial({ color: 0x73665a, map: secretoWallMap })
      },
      6: {
        floor: new THREE.MeshLambertMaterial({ color: 0x727272, map: morgueFloorMap }),
        wall: new THREE.MeshLambertMaterial({ color: 0xb9c0c3, map: morgueWallMap })
      },
      7: {
        floor: new THREE.MeshLambertMaterial({ color: 0x838383, map: finalFloorMap }),
        wall: new THREE.MeshLambertMaterial({ color: 0x7a7070, map: finalWallMap })
      }
    }
  };

  return MAT;
}

function getRoomSurfaceMaterial(roomId) {
  if (!MAT || !MAT.roomSurface) return null;
  return MAT.roomSurface.hasOwnProperty(roomId)
    ? MAT.roomSurface[roomId]
    : MAT.roomSurface.default;
}