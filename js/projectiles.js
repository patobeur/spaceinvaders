import * as THREE from "three";

export function shootProjectile(shooter, projectiles, scene, lv) {
	let size = 0.1 + (lv * 0.01)
	const projectileGeometry = new THREE.SphereGeometry(size, 32, 32);
	const projectileMaterial = new THREE.MeshBasicMaterial({ color: 0xffa500 });
	const projectile = new THREE.Mesh(projectileGeometry, projectileMaterial);
	projectile.position.set(shooter.position.x, shooter.position.y, shooter.position.z);
	projectile.userData.name = 'projectile'
	scene.add(projectile);
	projectiles.push(projectile);
}

export function moveProjectiles(projectiles) {
	projectiles.forEach((projectile, index) => {
		projectile.position.y += 0.2;
		if (projectile.position.y > 18) {
			projectile.geometry.dispose();
			projectile.material.dispose();
			projectile.parent.remove(projectile);
			projectiles.splice(index, 1);
		}
	});
}
