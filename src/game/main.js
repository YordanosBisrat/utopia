import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { sound } from './audio.js';

// User gesture unlock for Web Audio
window.addEventListener('click', () => sound.init(), { once: true });
window.addEventListener('keydown', () => sound.init(), { once: true });

// ============================================================================
// 1. SCENE SETUP & BASE LIGHTING
// ============================================================================
const canvas = document.querySelector('#webgl-canvas');
const scene = new THREE.Scene();

scene.background = new THREE.Color(0x0e1724);
scene.fog = new THREE.FogExp2(0x0e1724, 0.015);

const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true,
  powerPreference: 'high-performance'
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.7;

// 2.5D Camera
const camera = new THREE.PerspectiveCamera(36, window.innerWidth / window.innerHeight, 0.1, 150);
const CAMERA_OFFSET = new THREE.Vector3(0, 3.2, 11.5);
camera.position.copy(CAMERA_OFFSET);

const ambient = new THREE.AmbientLight(0x5c799a, 2.4);
scene.add(ambient);

const moonRimLight = new THREE.DirectionalLight(0xb5d4f5, 4.0);
moonRimLight.position.set(-8, 16, -6);
moonRimLight.castShadow = true;
moonRimLight.shadow.mapSize.set(2048, 2048);
scene.add(moonRimLight);

const frontFill = new THREE.DirectionalLight(0x9fc0e0, 2.0);
frontFill.position.set(0, 10, 14);
scene.add(frontFill);

// ============================================================================
// 2. DYNAMIC FLAME & SILHOUETTE SYSTEMS
// ============================================================================
const campFires = [];

// Mounted Roadside Torch
function createTorch(x, z) {
  const woodMat = new THREE.MeshStandardMaterial({ color: 0x2d1f14, roughness: 0.9 });
  const torchPost = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.08, 2.2, 6), woodMat);
  torchPost.position.set(x, 1.1, z);
  torchPost.castShadow = true;
  scene.add(torchPost);

  const flameMat = new THREE.MeshBasicMaterial({ color: 0xffaa22 });
  const flameMesh = new THREE.Mesh(new THREE.DodecahedronGeometry(0.18), flameMat);
  flameMesh.position.set(x, 2.2, z);
  scene.add(flameMesh);

  const light = new THREE.PointLight(0xff7722, 3.8, 10, 1.8);
  light.position.set(x, 2.25, z);
  light.castShadow = true;
  scene.add(light);

  campFires.push({
    light,
    flameMesh,
    baseIntensity: 3.8,
    baseY: 2.25,
    seed: Math.random() * 100
  });
}

// Low Ground Campfire
function createCampfire(x, z) {
  const fireGlowMat = new THREE.MeshBasicMaterial({ color: 0xff5500 });
  const fireMesh = new THREE.Mesh(new THREE.DodecahedronGeometry(0.35), fireGlowMat);
  fireMesh.position.set(x, 0.25, z);
  scene.add(fireMesh);

  const ringGeo = new THREE.TorusGeometry(0.55, 0.12, 6, 12);
  const stoneMat = new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 0.95 });
  const ring = new THREE.Mesh(ringGeo, stoneMat);
  ring.rotation.x = -Math.PI / 2;
  ring.position.set(x, 0.08, z);
  scene.add(ring);

  const campLight = new THREE.PointLight(0xff6e1a, 5.2, 16, 1.6);
  campLight.position.set(x, 1.2, z);
  campLight.castShadow = true;
  scene.add(campLight);

  campFires.push({
    light: campLight,
    flameMesh: fireMesh,
    baseIntensity: 5.2,
    baseY: 1.2,
    seed: Math.random() * 100
  });
}

// Procedural Flame Flickering Loop
function updateFlickeringLights(elapsedTime) {
  campFires.forEach((fire) => {
    const t = (elapsedTime + fire.seed) * 8.0;

    const flicker =
      Math.sin(t * 1.0) * 0.18 +
      Math.sin(t * 2.3) * 0.12 +
      Math.sin(t * 5.7) * 0.08 +
      (Math.random() - 0.5) * 0.05;

    fire.light.intensity = Math.max(0.2, fire.baseIntensity * (1.0 + flicker));
    fire.light.position.y = fire.baseY + flicker * 0.05;

    if (fire.flameMesh) {
      const scale = 1.0 + flicker * 0.25;
      fire.flameMesh.scale.set(scale, scale * 1.2, scale);
    }
  });
}

// Ethiopian Warrior Silhouette (Spear & Gasha Shield)
function createWarriorSilhouette(x, z, facingDirection = 1) {
  const group = new THREE.Group();
  const silhouetteMat = new THREE.MeshStandardMaterial({
    color: 0x05080d,
    roughness: 1.0,
    metalness: 0.1
  });

  // Robe / Body
  const bodyGeo = new THREE.CylinderGeometry(0.24, 0.36, 1.35, 8);
  const body = new THREE.Mesh(bodyGeo, silhouetteMat);
  body.position.y = 0.95;
  body.castShadow = true;
  group.add(body);

  // Head
  const headGeo = new THREE.SphereGeometry(0.18, 12, 12);
  const head = new THREE.Mesh(headGeo, silhouetteMat);
  head.position.y = 1.8;
  head.castShadow = true;
  group.add(head);

  // Spear (Tor)
  const spear = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 2.6, 6), silhouetteMat);
  spear.position.set(0.35 * facingDirection, 1.3, 0.15);
  spear.rotation.z = -0.15 * facingDirection;
  spear.castShadow = true;
  group.add(spear);

  // Shield (Gasha)
  const shield = new THREE.Mesh(new THREE.ConeGeometry(0.38, 0.8, 12), silhouetteMat);
  shield.position.set(-0.25 * facingDirection, 1.0, 0.2);
  shield.rotation.x = Math.PI / 2;
  shield.castShadow = true;
  group.add(shield);

  group.position.set(x, 0, z);
  scene.add(group);
}

// ============================================================================
// 3. PROCEDURAL ENVIRONMENT & WORLD POPULATION
// ============================================================================
function buildFullWorldEnvironment() {
  const groundGeo = new THREE.PlaneGeometry(160, 18);
  const groundMat = new THREE.MeshStandardMaterial({ color: 0x1f262e, roughness: 0.92 });
  const ground = new THREE.Mesh(groundGeo, groundMat);
  ground.rotation.x = -Math.PI / 2;
  ground.position.set(25, -0.05, 0);
  ground.receiveShadow = true;
  scene.add(ground);

  const mountainGeo = new THREE.ConeGeometry(16, 20, 5);
  const mountainMat = new THREE.MeshStandardMaterial({ color: 0x090f18, roughness: 1.0 });

  for (let i = -4; i <= 12; i++) {
    const m = new THREE.Mesh(mountainGeo, mountainMat);
    m.position.set(i * 12 + (Math.random() * 3), 7, -14 - (Math.random() * 5));
    m.scale.set(1 + Math.random() * 0.4, 1 + Math.random() * 0.4, 1);
    scene.add(m);
  }

  const tentMatGreen = new THREE.MeshStandardMaterial({ color: 0x1e3a24, roughness: 0.8 });
  const tentMatGold  = new THREE.MeshStandardMaterial({ color: 0x8a6d2b, roughness: 0.8 });
  const tentMatRed   = new THREE.MeshStandardMaterial({ color: 0x6e2222, roughness: 0.8 });
  const woodMat      = new THREE.MeshStandardMaterial({ color: 0x3d2b1f, roughness: 0.9 });

  function createWarTent(x, z, scale = 1.0, mat = tentMatGreen) {
    const tentGeo = new THREE.ConeGeometry(2.4 * scale, 3.2 * scale, 4);
    const tent = new THREE.Mesh(tentGeo, mat);
    tent.position.set(x, (3.2 * scale) / 2, z);
    tent.rotation.y = Math.PI / 4;
    tent.castShadow = true;
    tent.receiveShadow = true;
    scene.add(tent);

    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 3.4 * scale), woodMat);
    pole.position.set(x, (3.4 * scale) / 2, z + 0.1);
    scene.add(pole);
  }

  function createSupplyCrates(x, z) {
    const crateGeo = new THREE.BoxGeometry(0.9, 0.9, 0.9);
    for (let c = 0; c < 3; c++) {
      const crate = new THREE.Mesh(crateGeo, woodMat);
      crate.position.set(x + (c * 0.8), 0.45, z);
      crate.castShadow = true;
      scene.add(crate);
    }
  }

  // Act 1 Campfire
  createCampfire(9.5, 1.2);

  // Act 2 Encampment Tents & Crates
  createWarTent(17, -2.5, 1.1, tentMatGreen);
  createSupplyCrates(23, -2.2);
  createWarTent(27, -3.0, 1.2, tentMatGold);
  createWarTent(30, -2.0, 1.0, tentMatRed);
  createSupplyCrates(36, -2.4);
  createWarTent(40, -2.8, 1.3, tentMatGold);
  createWarTent(46, -3.2, 2.2, tentMatGold); // Grand Council Pavilion

  // Act 2 Campfires
  createCampfire(20, -1.2);
  createCampfire(33, -1.0);
  createCampfire(46, 0.5);

  // Act 2 Roadside Torches
  createTorch(15.5, 1.2);
  createTorch(25.0, 1.4);
  createTorch(31.5, 1.2);
  createTorch(41.0, 1.5);
  createTorch(44.0, -1.4);

  // Act 2 Silhouette Sentries
  createWarriorSilhouette(19.0, -1.8, 1);
  createWarriorSilhouette(21.2, -0.6, -1);
  createWarriorSilhouette(28.5, -2.5, 1);
  createWarriorSilhouette(34.2, -1.6, -1);
  createWarriorSilhouette(44.8, 1.4, -1);
  createWarriorSilhouette(47.2, 1.2, 1);
}

buildFullWorldEnvironment();

// ============================================================================
// 4. PLAYER & ANIMATION CONTROLLER
// ============================================================================
const player = {
  mesh: null,
  mixer: null,
  actions: {},
  currentAction: null,
  isFrozen: true,
  currentAct: 1,
  speed: {
    walk: 4.8,
    run: 9.2,
    crouch: 2.4,
    depth: 3.0
  },
  bounds: {
    minX: -26.0,
    maxX: 26.0,
    minZ: -1.8,
    maxZ: 1.8
  }
};

const keys = {
  left: false,
  right: false,
  up: false,
  down: false,
  sprint: false,
  crouch: false,
  interact: false
};

window.addEventListener('keydown', (e) => {
  const domInstructions = document.getElementById('instructions-backdrop');
  if (domInstructions && !domInstructions.classList.contains('hidden')) {
    if (e.code === 'Space' || e.code === 'Enter') {
      startGameFromInstructions();
      return;
    }
  }

  if (player.isFrozen) {
    if (e.code === 'KeyE') handleDialogueAdvance();
    return;
  }
  if (e.code === 'KeyA' || e.code === 'ArrowLeft') keys.left = true;
  if (e.code === 'KeyD' || e.code === 'ArrowRight') keys.right = true;
  if (e.code === 'KeyW' || e.code === 'ArrowUp') keys.up = true;
  if (e.code === 'KeyS' || e.code === 'ArrowDown') keys.down = true;
  if (e.code === 'ShiftLeft' || e.code === 'ShiftRight') keys.sprint = true;
  if (e.code === 'KeyC' || e.code === 'ControlLeft') keys.crouch = true;
  if (e.code === 'KeyE') {
    keys.interact = true;
    handleInteractionCheck();
  }
});

window.addEventListener('keyup', (e) => {
  if (e.code === 'KeyA' || e.code === 'ArrowLeft') keys.left = false;
  if (e.code === 'KeyD' || e.code === 'ArrowRight') keys.right = false;
  if (e.code === 'KeyW' || e.code === 'ArrowUp') keys.up = false;
  if (e.code === 'KeyS' || e.code === 'ArrowDown') keys.down = false;
  if (e.code === 'ShiftLeft' || e.code === 'ShiftRight') keys.sprint = false;
  if (e.code === 'KeyC' || e.code === 'ControlLeft') keys.crouch = false;
  if (e.code === 'KeyE') keys.interact = false;
});

function playAnimation(name, duration = 0.25, timeScale = 1.0) {
  const targetAction = player.actions[name];
  if (!targetAction || player.currentAction === targetAction) {
    if (targetAction) targetAction.setEffectiveTimeScale(timeScale);
    return;
  }

  const prevAction = player.currentAction;
  player.currentAction = targetAction;

  if (prevAction) {
    prevAction.fadeOut(duration);
  }

  player.currentAction
    .reset()
    .setEffectiveTimeScale(timeScale)
    .setEffectiveWeight(1)
    .fadeIn(duration)
    .play();
}

// ============================================================================
// 5. GLTF LOADER (ROOT MOTION POSITION STRIPPER)
// ============================================================================
const loader = new GLTFLoader();

loader.load(
  '/models/kassa_scout_animated.glb',
  (gltf) => {
    player.mesh = gltf.scene;
    player.mesh.position.set(-5.0, 0.0, 0.0);
    player.mesh.rotation.y = Math.PI / 2;

    player.mesh.traverse((c) => {
      if (c.isMesh) {
        c.castShadow = true;
        c.receiveShadow = true;
      }
    });

    scene.add(player.mesh);
    player.mixer = new THREE.AnimationMixer(player.mesh);

    gltf.animations.forEach((clip) => {
      clip.tracks = clip.tracks.filter((track) => {
        const isPositionTrack = track.name.endsWith('.position');
        const trackNameLower = track.name.toLowerCase();
        const isRootOrHips =
          trackNameLower.includes('hips') ||
          trackNameLower.includes('root') ||
          trackNameLower.includes('armature');
        return !(isPositionTrack && isRootOrHips);
      });

      const clipAction = player.mixer.clipAction(clip);
      clipAction.setLoop(THREE.LoopRepeat);
      clipAction.clampWhenFinished = false;

      const lower = clip.name.toLowerCase();
      if (lower.includes('idle')) player.actions['Idle'] = clipAction;
      else if (lower.includes('run') || lower.includes('sprint')) player.actions['Run'] = clipAction;
      else if (lower.includes('crouch') || lower.includes('sneak')) player.actions['Crouch'] = clipAction;
      else if (lower.includes('talk') || lower.includes('speak') || lower.includes('reach')) player.actions['Talk'] = clipAction;
      else if (lower.includes('walk')) player.actions['Walk'] = clipAction;
      else {
        player.actions[clip.name] = clipAction;
      }
    });

    if (!player.actions['Walk'] && player.actions['Run']) player.actions['Walk'] = player.actions['Run'];
    if (!player.actions['Run'] && player.actions['Walk']) player.actions['Run'] = player.actions['Walk'];
    if (!player.actions['Crouch'] && player.actions['Walk']) player.actions['Crouch'] = player.actions['Walk'];
    if (!player.actions['Talk'] && player.actions['Idle']) player.actions['Talk'] = player.actions['Idle'];

    playAnimation('Idle', 0.1);
  },
  undefined,
  (err) => console.error('Error loading Kassa:', err)
);

loader.load(
  '/models/adwa_environment.glb',
  (gltf) => {
    const env = gltf.scene;
    env.traverse((c) => {
      if (c.isMesh) {
        c.receiveShadow = true;
        c.castShadow = true;
      }
    });
    scene.add(env);
  },
  undefined,
  () => console.log('Procedural backdrop active.')
);

// ============================================================================
// 6. INSTRUCTIONS MODAL CONTROLLER
// ============================================================================
const domInstructions = document.getElementById('instructions-backdrop');
const domStartGameBtn = document.getElementById('start-game-btn');

function startGameFromInstructions() {
  sound.init();
  domInstructions.classList.add('hidden');
  player.isFrozen = false;
}

domStartGameBtn.addEventListener('click', startGameFromInstructions);

// ============================================================================
// 7. ACT 1 STEALTH SEARCHLIGHT SYSTEM
// ============================================================================
const stealth = {
  light: null,
  targetObj: null,
  sweep: {
    minX: 1.5,
    maxX: 7.5,
    speed: 1.8,
    direction: 1,
    currentX: 3.0,
    radius: 1.8
  },
  coverZones: [
    { name: 'Sangar_Left', minX: -3.5, maxX: -1.2 },
    { name: 'Sangar_Mid',  minX:  3.2, maxX:  5.8 }
  ],
  meter: 0.0,
  isDetected: false,
  isCovered: false,
  checkpointX: -5.0
};

function setupSearchlight() {
  stealth.light = new THREE.SpotLight(0xfff3cc, 90.0);
  stealth.light.position.set(4.5, 7.0, -2.8);
  stealth.light.angle = Math.PI / 7;
  stealth.light.penumbra = 0.45;
  stealth.light.castShadow = true;

  stealth.targetObj = new THREE.Object3D();
  stealth.targetObj.position.set(stealth.sweep.currentX, 0, 0);
  scene.add(stealth.targetObj);
  stealth.light.target = stealth.targetObj;
  scene.add(stealth.light);

  const ringGeo = new THREE.RingGeometry(stealth.sweep.radius * 0.9, stealth.sweep.radius, 32);
  const ringMat = new THREE.MeshBasicMaterial({ color: 0xffd57e, side: THREE.DoubleSide, transparent: true, opacity: 0.35 });
  const sweepCircle = new THREE.Mesh(ringGeo, ringMat);
  sweepCircle.rotation.x = -Math.PI / 2;
  sweepCircle.position.y = 0.04;
  stealth.targetObj.add(sweepCircle);
}
setupSearchlight();

const domStealthContainer = document.getElementById('stealth-meter-container');
const domStealthFill = document.getElementById('stealth-bar-fill');
const domDetectionFlash = document.getElementById('detection-flash');

function updateStealth(delta) {
  if (!player.mesh || !stealth.light || player.currentAct === 2) return;

  stealth.sweep.currentX += stealth.sweep.speed * stealth.sweep.direction * delta;
  if (stealth.sweep.currentX >= stealth.sweep.maxX) {
    stealth.sweep.currentX = stealth.sweep.maxX;
    stealth.sweep.direction = -1;
  } else if (stealth.sweep.currentX <= stealth.sweep.minX) {
    stealth.sweep.currentX = stealth.sweep.minX;
    stealth.sweep.direction = 1;
  }
  stealth.targetObj.position.x = stealth.sweep.currentX;

  const playerX = player.mesh.position.x;
  const inCoverZone = stealth.coverZones.some((zone) => playerX >= zone.minX && playerX <= zone.maxX);
  stealth.isCovered = inCoverZone && keys.crouch;

  const distanceToLightPool = Math.abs(playerX - stealth.sweep.currentX);
  const insideLightPool = distanceToLightPool <= stealth.sweep.radius;

  if (insideLightPool && !stealth.isCovered && !player.isFrozen) {
    stealth.meter = Math.min(1.0, stealth.meter + (delta / 1.4));
    stealth.light.color.setHex(0xff2222);
    if (Math.random() < 0.2) sound.playDetectionBlip(stealth.meter);
  } else {
    stealth.meter = Math.max(0.0, stealth.meter - (delta / 1.0));
    stealth.light.color.setHex(0xfff3cc);
  }

  if (stealth.meter > 0.05) {
    domStealthContainer.classList.remove('hidden');
    domStealthFill.style.width = `${Math.round(stealth.meter * 100)}%`;
  } else {
    domStealthContainer.classList.add('hidden');
  }

  if (stealth.meter >= 1.0 && !stealth.isDetected) {
    handlePlayerCaptured();
  }
}

function handlePlayerCaptured() {
  stealth.isDetected = true;
  player.isFrozen = true;
  domDetectionFlash.classList.add('active');
  sound.playAlarmHorn();

  setTimeout(() => {
    player.mesh.position.x = stealth.checkpointX;
    player.mesh.position.z = 0;
    stealth.meter = 0.0;
    stealth.isDetected = false;
    player.isFrozen = false;
    domDetectionFlash.classList.remove('active');
    domStealthContainer.classList.add('hidden');
    playAnimation('Idle', 0.1);
  }, 900);
}

// ============================================================================
// 8. ACT 1 SLUICE PUZZLE
// ============================================================================
const sluice = {
  gatePlanks: [],
  waterMesh: null,
  winchWheel: null,
  isOpened: false,
  triggerX: 1.6,
  triggerRadius: 1.5,
  holdDuration: 2.2,
  currentHold: 0.0,
  waterStartY: -0.05,
  waterTargetY: -0.75,
  plankStartY: 0.95,
  plankTargetY: 2.9
};

function initSluiceObjects() {
  const woodMat = new THREE.MeshStandardMaterial({ color: 0x3d3024, roughness: 0.8 });
  const waterMat = new THREE.MeshStandardMaterial({
    color: 0x0c2130,
    roughness: 0.1,
    metalness: 0.3,
    transparent: true,
    opacity: 0.85
  });

  const stand = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.1, 1.1, 8), woodMat);
  stand.position.set(sluice.triggerX, 0.55, -0.6);
  scene.add(stand);

  const wheelGeo = new THREE.TorusGeometry(0.24, 0.045, 8, 16);
  sluice.winchWheel = new THREE.Mesh(wheelGeo, woodMat);
  sluice.winchWheel.position.set(sluice.triggerX, 1.05, -0.6);
  sluice.winchWheel.rotation.y = Math.PI / 2;
  scene.add(sluice.winchWheel);

  for (let i = 0; i < 4; i++) {
    const plank = new THREE.Mesh(new THREE.BoxGeometry(0.24, 2.0, 0.08), woodMat);
    plank.position.set(2.55 + (i * 0.3), sluice.plankStartY, 0);
    plank.castShadow = true;
    scene.add(plank);
    sluice.gatePlanks.push(plank);
  }

  const waterGeo = new THREE.PlaneGeometry(3.2, 3.4);
  sluice.waterMesh = new THREE.Mesh(waterGeo, waterMat);
  sluice.waterMesh.rotation.x = -Math.PI / 2;
  sluice.waterMesh.position.set(3.0, sluice.waterStartY, 0);
  scene.add(sluice.waterMesh);
}
initSluiceObjects();

const domInteractPrompt = document.getElementById('interaction-prompt');
const domPromptFill = document.getElementById('prompt-progress-fill');

function updateSluice(delta) {
  if (!player.mesh || sluice.isOpened || player.currentAct === 2) return;

  const playerX = player.mesh.position.x;
  const distToWinch = Math.abs(playerX - sluice.triggerX);

  if (distToWinch <= sluice.triggerRadius && !player.isFrozen) {
    domInteractPrompt.classList.remove('hidden');

    if (keys.interact) {
      sluice.currentHold += delta;
      playAnimation('Talk', 0.2);

      if (sluice.winchWheel) sluice.winchWheel.rotation.x += delta * 5.0;
      if (Math.floor(sluice.currentHold * 8) !== Math.floor((sluice.currentHold - delta) * 8)) {
        sound.playWinchRatchet();
      }

      const progress = Math.min(1.0, sluice.currentHold / sluice.holdDuration);
      domPromptFill.style.width = `${Math.round(progress * 100)}%`;

      sluice.gatePlanks.forEach((plank) => {
        plank.position.y = THREE.MathUtils.lerp(sluice.plankStartY, sluice.plankTargetY, progress);
      });
      if (sluice.waterMesh) {
        sluice.waterMesh.position.y = THREE.MathUtils.lerp(sluice.waterStartY, sluice.waterTargetY, progress);
      }

      if (progress >= 1.0) {
        sluice.isOpened = true;
        domInteractPrompt.classList.add('hidden');
        playAnimation('Idle', 0.2);

        openDialogue({
          speaker: 'Empress Taytu',
          text: 'The water flow to their lower camp is severed. The wells will run dry before noon, forcing Baratieri into our terrain.',
          choices: null
        });
      }
    } else {
      sluice.currentHold = Math.max(0, sluice.currentHold - (delta * 2.0));
      domPromptFill.style.width = `${Math.round((sluice.currentHold / sluice.holdDuration) * 100)}%`;
    }
  } else {
    domInteractPrompt.classList.add('hidden');
    sluice.currentHold = 0;
  }
}

// ============================================================================
// 9. DIALOGUE TRIGGERS (ACT 1 & ACT 2)
// ============================================================================
const triggers = [
  {
    id: 'scout_report_trigger',
    act: 1,
    x: -0.5,
    radius: 1.2,
    triggered: false,
    speaker: 'Ras Alula',
    text: 'The mist is breaking over Kidane Mehret. What did your scouts spot along the valley road, Kassa?',
    choices: [
      { text: 'A. Albertone’s brigade took the wrong spur. They are isolated.', next: 'branch_a' },
      { text: 'B. Italian forces are advancing together in a single mass.', next: 'branch_b' }
    ]
  },
  {
    id: 'gebeyehu_briefing',
    act: 2,
    x: 22.0,
    radius: 1.5,
    triggered: false,
    speaker: 'Fitawrari Gebeyehu',
    text: 'Kassa! The vanguard is ready. Albertone has led his brigade into the ravine without artillery support. Shall we spring the trap?',
    choices: [
      { text: 'A. Strike now while they are disorganized in the rocky defile.', next: 'branch_strike' },
      { text: 'B. Wait until the Empress’s wing encircles their retreat path.', next: 'branch_wait' }
    ]
  },
  {
    id: 'depot_check',
    act: 2,
    x: 35.0,
    radius: 1.4,
    triggered: false,
    speaker: 'Imperial Quartermaster',
    text: 'We have distributed French Gras rifles and Remington carbines to every front battalion. The line will hold.',
    choices: null
  }
];

const branches = {
  branch_a: {
    speaker: 'Ras Alula',
    text: 'Then their maps have failed them just as we anticipated. We cut them off before Baratieri realizes his left flank is stranded.',
    choices: null
  },
  branch_b: {
    speaker: 'Ras Alula',
    text: 'Look closer with your own eyes, lad. That ridge divides them into three separate columns. Albertone is already out of position!',
    choices: null
  },
  branch_strike: {
    speaker: 'Fitawrari Gebeyehu',
    text: 'Forward, sons of Ethiopia! We will break their center before the morning sun crests Mount Semayata!',
    choices: null
  },
  branch_wait: {
    speaker: 'Fitawrari Gebeyehu',
    text: 'Wise counsel. Empress Taytu’s cavalry is taking the heights. Not a single invader will escape the basin.',
    choices: null
  }
};

let typewriterInterval = null;
let isTyping = false;
let fullTextBuffer = '';

const domDialogueContainer = document.getElementById('dialogue-container');
const domDialogueSpeaker   = document.getElementById('dialogue-speaker');
const domDialogueBody      = document.getElementById('dialogue-body');
const domDialogueChoices   = document.getElementById('dialogue-choices');
const domDialoguePrompt    = document.getElementById('dialogue-prompt');

function openDialogue(data) {
  player.isFrozen = true;
  playAnimation('Idle', 0.15);

  domDialogueSpeaker.textContent = data.speaker;
  domDialogueChoices.innerHTML = '';
  domDialogueChoices.classList.add('hidden');
  domDialoguePrompt.classList.remove('hidden');
  domDialogueContainer.classList.remove('hidden');

  startTypewriter(data.text, () => {
    if (data.choices && data.choices.length > 0) {
      renderChoices(data.choices);
    }
  });
}

function startTypewriter(text, onComplete) {
  clearInterval(typewriterInterval);
  isTyping = true;
  fullTextBuffer = text;
  domDialogueBody.textContent = '';
  let index = 0;

  typewriterInterval = setInterval(() => {
    domDialogueBody.textContent = text.substring(0, index + 1);

    if (text[index] !== ' ') {
      sound.playTypewriterTick();
    }

    index++;
    if (index >= text.length) {
      clearInterval(typewriterInterval);
      isTyping = false;
      if (onComplete) onComplete();
    }
  }, 24);
}

function renderChoices(choices) {
  domDialoguePrompt.classList.add('hidden');
  domDialogueChoices.innerHTML = '';
  domDialogueChoices.classList.remove('hidden');

  choices.forEach((choice) => {
    const btn = document.createElement('button');
    btn.className = 'choice-btn';
    btn.textContent = choice.text;
    btn.onclick = () => {
      const nextData = branches[choice.next];
      if (nextData) openDialogue(nextData);
      else closeDialogue();
    };
    domDialogueChoices.appendChild(btn);
  });
}

function handleDialogueAdvance() {
  if (isTyping) {
    clearInterval(typewriterInterval);
    domDialogueBody.textContent = fullTextBuffer;
    isTyping = false;
    return;
  }
  if (domDialogueChoices.classList.contains('hidden')) {
    closeDialogue();
  }
}

function closeDialogue() {
  domDialogueContainer.classList.add('hidden');
  player.isFrozen = false;
}

function handleInteractionCheck() {
  if (!player.mesh) return;
  triggers.forEach((trig) => {
    if (trig.act === player.currentAct) {
      const dist = Math.abs(player.mesh.position.x - trig.x);
      if (dist <= trig.radius) openDialogue(trig);
    }
  });
}

// ============================================================================
// 10. GATES & CODEX COMPLETION
// ============================================================================
const levelGate = { targetX: 11.5, isCompleted: false };
const actTwoGate = { targetX: 47.0, isCompleted: false };

const domCodexBackdrop = document.getElementById('codex-backdrop');
const domCodexCloseBtn = document.getElementById('codex-close-btn');

function triggerLevelComplete() {
  if (levelGate.isCompleted) return;
  levelGate.isCompleted = true;
  player.isFrozen = true;
  playAnimation('Idle', 0.2);
  sound.playCodexChime();

  setTimeout(() => {
    domCodexBackdrop.classList.remove('hidden');
  }, 400);
}

function triggerActTwoComplete() {
  if (actTwoGate.isCompleted) return;
  actTwoGate.isCompleted = true;
  player.isFrozen = true;
  playAnimation('Idle', 0.2);
  sound.playCodexChime();

  const domTitle = document.getElementById('codex-title');
  const domBody = document.getElementById('codex-body');
  const domBadge = document.querySelector('#codex-header .codex-badge');

  if (domTitle) domTitle.textContent = "Victory at Adwa";
  if (domBadge) domBadge.textContent = "CAMPAIGN VICTORY";
  if (domBody) {
    domBody.innerHTML = `
      <p>Through disciplined reconnaissance, tactical water interdiction, and the coordinated assault of over 100,000 Ethiopian warriors, the forces of <strong>Emperor Menelik II</strong> routed the Italian army at the Battle of Adwa.</p>
      <p>This historic triumph safeguarded Ethiopian independence and ignited anti-colonial movements across Africa and the world.</p>
    `;
  }
  domCodexCloseBtn.textContent = "Restart Campaign ↺";
  domCodexCloseBtn.onclick = () => window.location.reload();

  setTimeout(() => {
    domCodexBackdrop.classList.remove('hidden');
  }, 400);
}

function startActTwo() {
  domCodexBackdrop.classList.add('hidden');
  player.currentAct = 2;

  player.bounds.minX = 12.0;
  player.bounds.maxX = 52.0;

  player.mesh.position.set(14.0, 0.0, 0.0);
  camera.position.x = 14.0;

  if (stealth.light) stealth.light.intensity = 0;
  domStealthContainer.classList.add('hidden');

  player.isFrozen = false;
  playAnimation('Idle', 0.1);

  console.log("Act II Encampment Active: X = 14 to 52.");
}

domCodexCloseBtn.addEventListener('click', () => {
  if (player.currentAct === 1) startActTwo();
});

window.addEventListener('keydown', (e) => {
  if (e.code === 'Escape' && !domCodexBackdrop.classList.contains('hidden')) {
    if (player.currentAct === 1) startActTwo();
  }
});

// ============================================================================
// 11. MAIN LOOP & ANIMATION UPDATE
// ============================================================================
const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);

  const delta = Math.min(clock.getDelta(), 0.1);
  const elapsedTime = clock.getElapsedTime();

  if (player.mixer) player.mixer.update(delta);

  // Animate dynamic torch and campfire flames across the scene
  updateFlickeringLights(elapsedTime);

  updateStealth(delta);
  updateSluice(delta);

  if (player.mesh) {
    let moveX = 0;
    let moveZ = 0;

    if (!player.isFrozen) {
      if (keys.left)  moveX -= 1;
      if (keys.right) moveX += 1;
      if (keys.up)    moveZ -= 1;
      if (keys.down)  moveZ += 1;

      let currentSpeed = player.speed.walk;
      let activeAction = 'Walk';
      let animSpeed = 1.0;

      if (keys.crouch) {
        currentSpeed = player.speed.crouch;
        activeAction = 'Crouch';
        animSpeed = 0.9;
      } else if (keys.sprint && moveX !== 0) {
        currentSpeed = player.speed.run;
        activeAction = 'Run';
        animSpeed = 1.25;
      }

      if (moveX !== 0 || moveZ !== 0) {
        player.mesh.position.x += moveX * currentSpeed * delta;
        player.mesh.position.z += moveZ * player.speed.depth * delta;

        player.mesh.position.x = THREE.MathUtils.clamp(player.mesh.position.x, player.bounds.minX, player.bounds.maxX);
        player.mesh.position.z = THREE.MathUtils.clamp(player.mesh.position.z, player.bounds.minZ, player.bounds.maxZ);

        if (moveX !== 0) {
          const targetRotation = moveX > 0 ? Math.PI / 2 : -Math.PI / 2;
          player.mesh.rotation.y = THREE.MathUtils.lerp(player.mesh.rotation.y, targetRotation, 0.2);
        }

        const stepInterval = keys.crouch ? 0.55 : (keys.sprint ? 0.26 : 0.42);
        sound.footstepTimer = (sound.footstepTimer || 0) + delta;
        if (sound.footstepTimer >= stepInterval) {
          sound.playFootstep(keys.crouch, keys.sprint);
          sound.footstepTimer = 0;
        }

        playAnimation(activeAction, 0.2, animSpeed);
      } else {
        if (!keys.interact) {
          if (keys.crouch) {
            playAnimation('Crouch', 0.2);
          } else {
            playAnimation('Idle', 0.25);
          }
        }
      }

      triggers.forEach((trig) => {
        if (trig.act === player.currentAct && !trig.triggered) {
          const dist = Math.abs(player.mesh.position.x - trig.x);
          if (dist <= 0.8) {
            trig.triggered = true;
            openDialogue(trig);
          }
        }
      });

      if (player.currentAct === 1 && player.mesh.position.x >= levelGate.targetX && !levelGate.isCompleted) {
        triggerLevelComplete();
      }

      if (player.currentAct === 2 && player.mesh.position.x >= actTwoGate.targetX && !actTwoGate.isCompleted) {
        triggerActTwoComplete();
      }
    }

    const horizontalLead = (moveX || 0) * 1.1;
    const targetCamX = player.mesh.position.x + horizontalLead;
    const targetCamY = player.mesh.position.y + CAMERA_OFFSET.y;

    camera.position.x = THREE.MathUtils.lerp(camera.position.x, targetCamX, 0.05);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetCamY, 0.05);
    camera.lookAt(player.mesh.position.x, player.mesh.position.y + 1.2, 0);
  }

  renderer.render(scene, camera);
}

animate();

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});