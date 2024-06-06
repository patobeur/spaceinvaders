import * as THREE from "three";
import { clone } from 'three/addons/utils/SkeletonUtils.js';

let direction = 1;
let stepDown = false;


export function createInvaders(scene, invaderMesh, range = 10) {
	const invaderGeometry = new THREE.BoxGeometry(1, 1, 1);
	const invaderMaterial = new THREE.MeshBasicMaterial({ color: 0xFFFFFF, transparent: true, opacity: 0.1 });
	const invaders = [];
	let startPos = { x: 0, y: 15, z: 0 }
	let ii = 0
	for (let x = 0; x < 5; x++) {
		for (let y = 0; y < 5; y++) {
			let invader = new THREE.Mesh(invaderGeometry, invaderMaterial);
			invader.position.set(startPos.x + (x * 2 - 5), startPos.y + (y * 2 - 5), startPos.z);

			invader.castShadow = true;
			invader.receiveShadow = true;

			invader.userData.name = 'invader'
			invader.add(clone(invaderMesh))
			scene.add(invader);
			invaders.push(invader);
			ii++
		}
	}
	return invaders;
}
export function moveInvaders(invaders, range = 10) {
	invaders.forEach(invader => {
		invader.position.x += direction * 0.05;
	});

	if (invaders.some(invader => invader.position.x > range || invader.position.x < -range)) {
		direction *= -1;
		stepDown = true;
	}

	if (stepDown) {
		invaders.forEach(invader => invader.position.y -= 0.5);
		stepDown = false;
	}
}
