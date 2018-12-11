class Options {
	constructor(config) {
		this.config = config;

		this.language = this.config.language;
		this.music = false;
	}

	setNextLanguage() {
		let languages = this.config.languages;
		let idx = languages.indexOf(this.language) + 1;

		this.language = idx >= languages.length ? languages[0] : languages[idx];
	}

	setPreviousLanguage() {
		let languages = this.config.languages;
		let idx = languages.indexOf(this.language) - 1;

		this.language = idx < 0 ? languages[languages.length - 1] : languages[idx];
	}
}

export default Options;