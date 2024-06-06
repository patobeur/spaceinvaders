import * as THREE from "three";

export function createShooter(scene, spaceship) {
	const shooterGeometry = new THREE.SphereGeometry(0.5, 32, 32);
	const shooterMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
	const shooter = new THREE.Mesh(shooterGeometry, shooterMaterial);
	shooter.position.set(0, 0, 0); // Ajustez ici la position Z pour être au même niveau que les invaders
	shooter.userData.name = 'shooter'
	shooter.add(spaceship)
	scene.add(shooter);
	return shooter;
}
export function moveShooter(event, shooter) {
	if (event.key === 'ArrowLeft') shooter.position.x -= 0.5;
	if (event.key === 'ArrowRight') shooter.position.x += 0.5;
}
