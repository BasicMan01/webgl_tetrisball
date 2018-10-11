class Config {
	constructor() {
		this.config = {};
		this.texts = {};
		this.fontBg = null;
		this.loader = new THREE.FileLoader();

		this.load();
	}

	load(callback) {
		this.loadJsonFile('resources/config/config.json').then((value) => {
			this.config = value;

			return this.loadJsonFile('resources/language/' + this.config.language + '.json');
		}).then((value) => {
			this.texts = value[this.config.language];

			return this.loadImageFile('resources/texture/font/bg.png');
		}).then((value) => {
			this.fontBg = value;

			if (typeof callback === 'function') {
				callback();
			}
		}).catch((error) => {
			console.log(error);
		});
	}

	loadJsonFile(fileName) {
		return new Promise((resolve, reject) => {
			this.loader.load(fileName, (json) => {
				try {
					let data = JSON.parse(json);

					resolve(data);
				} catch(e) {
					reject(e);
				}
			});
		});
	}

	loadImageFile(fileName) {
		return new Promise((resolve, reject) => {
			let img = new Image();
			img.src = fileName;

			img.onload = () => {
				resolve(img);
			};
			img.onerror = () => {
				reject('loading error ' + img.src);
			};
		});
	}
}

export default Config;