class Sound {
	constructor() {
		this.audio = document.createElement('audio');
		this.source = document.createElement('source');

		this.audio.appendChild(this.source);
		this.audio.loop = true;

		this.audio.addEventListener('ended', () => {
			this.currentTime = 0;
			this.play();
		}, false);
	}

	play(title) {
		this.source.src = title;
		this.audio.load();
		this.audio.play();
	}

	stop() {
		this.audio.pause();
		this.audio.currentTime = 0;
	}
}

export default Sound;