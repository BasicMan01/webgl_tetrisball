class Config {
	constructor() {
		this.font = {};
		this.language = '';
		this.texts = {};

		this.loader = new THREE.FileLoader();
	}

	load(callback) {
		this.loadJsonFile('resources/config/config.json').then((value) => {
			this.font = value.defaultFont;
			this.language = value.defaultLanguage;

			return this.loadJsonFile('resources/language/' + this.language + '.json');
		}).then((value) => {
			this.texts = value;

			return this.loadImageFile('resources/texture/font/bg.png');
		}).then((value) => {
			this.font.backgroundImg = value;

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