import * as THREE from "three";
import { createShooter, moveShooter } from './js/shooter.js';
import { createInvaders, moveInvaders } from './js/invaders.js';
import { shootProjectile, moveProjectiles } from './js/projectiles.js';
import { detectCollisions } from './js/collision.js';
import { checkVictory as victoryCheck } from './js/victory.js'; // Renommer l'import pour éviter les conflits
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { _GLTFLoader, _TextureLoader } from './js/loaders.js';
import { clone } from 'three/addons/utils/SkeletonUtils.js';

let scene, camera, renderer, light, lightHelper, spaceship, invader, ambientLight, shooter, invaders, projectiles, controls, camTarget;
let lives = 3;
let lv = 0;
let ok = false;
let shootTimer = new Number(0);
let shootDelay = 25

const ROOT = '';
const startButton = document.getElementById('startButton');
const continueButton = document.getElementById('continueButton');
const retryButton = document.getElementById('retryButton');
const livesDisplay = document.getElementById('lives');
const lvDisplay = document.getElementById('lv');


startButton.addEventListener('click', startGame);
continueButton.addEventListener('click', continueGame);
retryButton.addEventListener('click', retryGame);

startButton.style.display = 'none';
function init() {
	scene = new THREE.Scene();

	camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 1000);
	camera.userData.name = 'camera'

	renderer = new THREE.WebGLRenderer({
		antialias: true,
		alpha: true
	});
	renderer.shadowMap.enabled = true
	renderer.shadowMap.type = THREE.PCFSoftShadowMap;
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
	// renderer.autoClear = true
	// renderer.toneMapping = THREE.ACESFilmicToneMapping
	// renderer.toneMappingExposure = 1
	// renderer.setClearColor(0x000000, 1.0);
	light = new THREE.DirectionalLight(0xffffff, 1);

	lightHelper = new THREE.DirectionalLightHelper(light, 5, 0xffff00);


	light.userData.name = 'light'

	light.userData.amplitude = { range: 5, sens: 1 };
	light.position.set(5, 10, 5);

	// Configuration des paramètres de l'ombre
	light.shadow.mapSize.width = 1024; // Par défaut 512
	light.shadow.mapSize.height = 1024; // Par défaut 512
	light.shadow.camera.near = 0.5; // Par défaut 0.5
	light.shadow.camera.far = 500; // Par défaut 500

	light.castShadow = true;

	scene.add(light);

	ambientLight = new THREE.AmbientLight(0xffffff, 1);
	ambientLight.userData.name = 'ambientLight'
	scene.add(ambientLight);

	const camTargetGeometry = new THREE.SphereGeometry(.5, 32, 32);
	const camTargetMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0 });
	camTarget = new THREE.Mesh(camTargetGeometry, camTargetMaterial);
	camTarget.position.set(0, 0, 2);
	camTarget.receiveShadow = true
	camTarget.castShadow = true
	scene.add(camTarget);

	camera.position.z = 6; // hauteur de la camera
	camera.position.y = -12; // recul de la camera


	camera.lookAt(camTarget.position.x, camTarget.position.y, camTarget.positionz);
	camera.updateProjectionMatrix();

	document.addEventListener('keydown', handleKeyDown);




	// const floorGeometry = new THREE.BoxGeometry(15, 2, 1);
	// const floorMaterial = new THREE.MeshBasicMaterial({ color: 0xFFFFFF, transparent: true, opacity: 0.2 });
	// const floor = new THREE.Mesh(floorGeometry, floorMaterial);
	// floor.position.set(0, 0, -.5);
	// floor.name = 'floor';
	// // floor.transparent = true;
	// // floor.opacity = .1;
	// floor.receiveShadow = true;
	// floor.castShadow = true
	// floor.userData.name = 'floor'
	// scene.add(floor);

	controls = new OrbitControls(camera, renderer.domElement); // Initialisation des OrbitControls
	controls.enableDamping = false;
	controls.enablePan = false;
	controls.enableRotate = false;
	// // controls.panSpeed = 0.5;
	// controls.minPolarAngle = Math.PI / 2;
	// controls.maxPolarAngle = Math.PI;
	controls.target.set(camTarget.position.x, camTarget.position.y, camTarget.position.z)
	controls.minDistance = 2

	// controls.dampingFactor = 0.25;
	controls.enableZoom = true;
	renderer.render(scene, camera);

	document.body.appendChild(renderer.domElement);



	window.addEventListener('resize', () => {
		console.log('resize')
		renderer.setSize(window.innerWidth, window.innerHeight);
		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();
		renderer.render(scene, camera);
	});
	controls.update();
}


function shoot() {
	if (ok) {
		shootProjectile(shooter, projectiles, scene, lv);
	}
}

function initshooter(scene) {
	shooter = createShooter(scene, spaceship);
	projectiles = [];
}

function initinvaders(scene, invader) {
	invaders = createInvaders(scene, invader);
}

function handleKeyDown(event) {
	moveShooter(event, shooter);
	if (event.key === ' ' && shootTimer < 1) {
		shootTimer = 1
		shootProjectile(shooter, projectiles, scene, lv);
	}
}

function animate() {
	if (ok === true) {
		requestAnimationFrame(animate);
		camera.lookAt(camTarget.position);
		camera.updateProjectionMatrix();
		moveInvaders(invaders, 10, lv);
		moveProjectiles(projectiles);
		detectCollisions(projectiles, invaders, shooter, scene, onCollision);
		victoryCheck(invaders, onVictory);
		controls.update();
		renderer.render(scene, camera);
		if (shootTimer > 0) shootTimer++
		if (shootTimer > shootDelay) shootTimer = 0
	}
}

function start() {
	spaceship = _GLTFLoader.models['Spaceship']
	invader = _GLTFLoader.models['Koi']
	// let astraunaute = clone(_GLTFLoader.models['Astronaut'])
	// let astraunaute2 = clone(astraunaute)
	// let astraunaute3 = clone(astraunaute2)
	// astraunaute.position.x = -13
	// astraunaute2.position.x = -8
	// astraunaute3.position.x = -5
	// scene.add(astraunaute)
	// scene.add(astraunaute2)
	// scene.add(astraunaute3)

	startButton.style.display = 'block';
	renderer.render(scene, camera);
}

function startGame() {

	startButton.style.display = 'none';
	initshooter(scene);
	initinvaders(scene, invader);
	ok = true;
	document.body.addEventListener('click', shoot);
	animate();
}

function continueGame() {
	resetScene();
	ok = true;
	continueButton.style.display = 'none';
	initinvaders(scene, invader);
	animate();
}

function retryGame() {
	resetScene();
	retryButton.style.display = 'none';
	lives = 3;
	livesDisplay.textContent = `Lives: ${lives}`;
	initinvaders(scene, invader);
	ok = true;
	animate();
}

function onVictory() {
	lv++
	lvDisplay.textContent = `lv: ${lv}`;
	continueButton.style.display = 'block';
	ok = false;
}
function onCollision() {
	ok = false;
	lives--;
	livesDisplay.textContent = `Lives: ${lives}`;
	if (lives > 0) {
		continueButton.style.display = 'block';
	} else {
		retryButton.style.display = 'block';
	}
}
// ------------------------
// reset scene
// ------------------------
function resetScene() {
	invaders.forEach(element => {
		scene.remove(element);
	});
	invaders = []
	console.log('all invaders removed !!!')
}
// ------------------------
// loadAssets
// ------------------------
const loadAssets = () => {
	let root = '';
	init()
	_GLTFLoader.init(root, () => {
		_TextureLoader.init(root, start)
	})
}
loadAssets()
