"use strict";
let root = '';
let _model3dList = {
	space: [
		{ set: 'space', name: 'Astronaut', file: root + '/objects/glb/Astronaut.glb', position: { x: -10, y: 10, z: -15 }, scale: 2, rotation: { x: Math.PI / 4, y: Math.PI / 4, z: 0 } },
		{ set: 'space', name: 'Spaceship', file: root + '/objects/glb/Spaceship.glb', position: { x: 0, y: 0, z: 0 }, scale: 0.3, rotation: { x: -Math.PI / 4, y: 0, z: 0 } },
		{ set: 'space', name: 'Invader', file: root + '/objects/glb/Spaceship2.glb', position: { x: 0, y: 0, z: 0 }, scale: 0.15, rotation: { x: Math.PI / 2, y: 0, z: 0 } },
		{ set: 'space', name: 'Koi', file: root + '/objects/glb/Koi.glb', position: { x: 0, y: 0, z: 0 }, scale: 0.35, rotation: { x: Math.PI / 2, y: 0, z: 0 } },
	],

}
let _textureList = {
	// 'floor': { name: 'floor', path: '/assets/textures/', fileName: 'road4.jpg', w: 1572, h: 899 },
	'sky': { name: 'sky', path: root + '/objects/textures/', fileName: 'space.jpg' },
}
export { _model3dList, _textureList }
