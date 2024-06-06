
export function detectCollisions(projectiles, invaders, shooter, scene, onCollision) {
	// Collisions entre projectiles et invaders
	projectiles.forEach((projectile, pIndex) => {
		invaders.forEach((invader, iIndex) => {
			const distance = projectile.position.distanceTo(invader.position);
			if (distance < 0.5) { // Ajustez cette valeur selon la taille de vos objets
				// Retirer l'invader et le projectile de la scène et des tableaux
				invader.geometry.dispose();
				invader.material.dispose();
				scene.remove(invader);
				invaders.splice(iIndex, 1);

				projectile.geometry.dispose();
				projectile.material.dispose();
				scene.remove(projectile);
				projectiles.splice(pIndex, 1);
			}
		});
	});

	// Collisions entre shooter et invaders
	invaders.forEach((invader) => {
		const distance = shooter.position.distanceTo(invader.position);
		if (distance < 0.5) { // Ajustez cette valeur selon la taille de vos objets
			onCollision();
		}
	});
}
