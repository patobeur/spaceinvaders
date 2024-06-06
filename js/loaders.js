"use strict";
import * as THREE from "three";
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { _model3dList, _textureList } from '/js/librarieAssets.js';
import { clone } from 'three/addons/utils/SkeletonUtils.js';
const _consoleOn = false
const _front = {
	id: new Number(0),
	addDivtoDom: function (params, stringcss, styleid) {
		let div = this.createDiv(params)
		let css = this.addCss(stringcss, styleid)
		document.body.appendChild(div)
		return div
	},
	createDiv: function (params) {
		let element = document.createElement(params.tag);
		if (params.attributes) {
			for (const key in params.attributes) {
				if (Object.hasOwnProperty.call(params.attributes, key))
					element[key] = params.attributes[key];
				if (params.style) {
					for (const key2 in params.style) {
						if (Object.hasOwnProperty.call(params.style, key2))
							element.style[key2] = params.style[key2];
					}
				}
			}
		}
		return element;
	},
	addCss(stringcss, styleid) {
		let style = document.createElement("style");
		style.textContent = stringcss;
		style.id = "css_" + styleid;
		document.getElementsByTagName("head")[0].appendChild(style);
	},
	sanitize: function (string) {
		const map = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#x27;", "./": "&#x2F;" };
		const reg = /[&<>"'/]/gi;
		return string.replace(reg, (match) => map[match]);
	},
	rand: (min, max) => { return Math.floor(Math.random() * (max - min + 1) + min) },
	// get_DegreeWithTwoPos: function (x, y, X, Y) { return (Math.atan2(Y - y, X - x) * 180) / Math.PI; },
	// get_aleaVector3: function (min,max) {return {x: this.rand(min,max),y: this.rand(min,max),z: this.rand(min,max)}}
};

let _GLTFLoader = {
	// ------------------------
	// GLTFLoader for GLTF MESH
	// ------------------------
	root: undefined,
	demoActive: false,
	_consoleOn: false,
	callback: () => { if (this._consoleOn) console.log('no call back function for _GLTFLoader') },
	gltfLoader: undefined,
	models: {},
	modelsActive: {},
	loadCounter: 0,
	init: function (root = '', callbackFunction = this.callback) {
		this.root = root
		if (typeof callbackFunction != 'function') callbackFunction = this.callback;
		this.gltfLoader = new GLTFLoader();


		let model3dList = []
		for (const set in _model3dList) {
			model3dList = [...model3dList, ..._model3dList[set]]
		}
		model3dList.forEach(element => {
			if (typeof element.position === 'undefined') element.position = { x: 0, y: 0, z: 0 };
			// if (typeof element.rotation === 'undefined') element.rotation = { x: 0, y: 0, z: 0 };

			this.gltfLoader.load(
				element.file,
				(gltf) => {
					this.loadCounter++;
					const model = clone(gltf.scene);

					if (typeof element.scale != 'undefined') {
						model.scale.set(element.scale, element.scale, element.scale)
					}
					if (element.rotation) {
						model.rotation.x = element.rotation.x;
						model.rotation.z = element.rotation.z;
						model.rotation.y = element.rotation.y;
					}

					model.position.x = element.position.x;
					model.position.z = element.position.z;
					model.position.y = element.position.y;

					model.castShadow = true
					model.receiveShadow = true
					model.traverse((node) => {
						if (node.isMesh) {
							node.receiveShadow = true
							node.castShadow = true;
						}
					});
					this.models[element.name] = model
					model.userData.set = element.set ?? false;
					model.userData.name = element.name ?? false;
					console.log('Model ' + element.name + ' loaded', model);

					if (this.loadCounter === model3dList.length) {
						console.log('_GLTFLoader', 'ok', model3dList.length + ' gltf loaded...')
						callbackFunction();
					}
				}, undefined, (error) => {
					console.error('_GLTFLoader', error);
				}
			);
		});
	}
}
let _TextureLoader = {
	root: undefined,
	callback: () => { if (this._consoleOn) console.log('no call back function for _TextureLoader') },
	textures: {},
	counter: 0,
	filesCounter: 0,
	textureLoader: new THREE.TextureLoader(),
	init: function (root = '', callbackFunction = this.callback) {
		this.root = root
		this.callbackFunction = callbackFunction
		this.counter = 0
		// Chargement des textures pour chaque objet
		for (const key in _textureList) {
			if (Object.hasOwnProperty.call(_textureList, key)) {
				const file = _textureList[key];
				this.addToStack(file)
			}
			this.filesCounter++
		}
		// this.files.forEach(file => {
		// 	this.addToStack(file)
		// });
	},
	checkEnd: function () {
		if (this.counter === this.filesCounter) {
			console.log('_TextureLoader', 'ok', this.filesCounter + ' files loaded...')
			this.callbackFunction('_TextureLoader ok')
		}
	},
	addToStack: function (file) {
		this.loadTexture(file, (map) => {
			this.counter++;
			map.name = file.name
			this.textures[file.name] = { map: map, name: file.name }
			if (this._consoleOn) console.log('texture loaded', file.fileName, this.counter + '/' + this.files.length)
			this.checkEnd()
		});
	},
	loadTexture: function (file, callback) {
		// Chargement de la texture
		let fileurl = this.root + file.path + file.fileName
		this.textureLoader.load(
			fileurl,
			(texture) => {
				// La texture a été chargée avec succès !!!
				callback(texture);
			},
			(xhr) => {
				// Progression du chargement de la texture (optionnel)
				const percentLoaded = (xhr.loaded / xhr.total) * 100;
				// this.texturesDivByName[file.name].style.width = (100 - percentLoaded) + '%'
				if (this._consoleOn) console.log('Texture chargée :' + `${percentLoaded}% ${file.fileName} `);
			},
			(error) => {
				console.error('Erreur de chargement de la texture :', error);
			}
		);
	},
};
export { _GLTFLoader, _TextureLoader, _front }
