import * as THREE from '../../lib/threejs_125/build/three.module.js';

class TextureManager {
	constructor() {
		this.textureLoader =  new THREE.TextureLoader();
		this.textureMap = new Map();
	}

	get(key) {
		return this.textureMap.get(key);
	}

	load(key, path) {
		return new Promise((resolve, reject) => {
			this.textureLoader.load(
				path,

				(texture) => {
					texture.generateMipmaps = false;
					texture.minFilter = THREE.LinearFilter;

					this.textureMap.set(key, texture);

					console.info(path + ' successfully loaded');
					resolve(texture);
				},

				// onProgress not supported
				undefined,

				(err) => {
					reject(path + ' failed to load');
				}
			);
		});
	}

	loadAll(files, callback) {
		let promises = [];

		Object.keys(files).forEach(key => {
			promises.push(this.load(key, files[key]));
		});

		Promise.all(promises).then(values => {
			if (typeof callback === 'function') {
				callback();
			}
		}).catch(err => {
			console.error(err);
		});
	}
}

export default TextureManager;