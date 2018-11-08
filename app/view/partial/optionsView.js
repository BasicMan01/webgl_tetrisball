import BaseView from './baseView.js';

class OptionsView extends BaseView {
	constructor(mainView, model) {
		super();

		this.mainView = mainView;
		this.model = model;

		this.textMusic = null;
		this.textMusicValue = null;
		this.textMusicButton = null;
		this.navToMenuButton = null;
		this.intersectMeshs = [];

		this.scene = new THREE.Scene();

		this.createObjects();
	}

	createObjects() {
		this.textMusic = this.mainView.addTextBasePlane(this.scene);
		this.textMusicValue = this.mainView.addTextBasePlane(this.scene);
		this.textMusicButton = this.mainView.addTextBasePlane(this.scene);
		this.navToMenuButton = this.mainView.addTextBasePlane(this.scene);

		this.textMusicButton.userData.actionHandler = 'setMusicAction';
		this.navToMenuButton.userData.actionHandler = 'navToMenuAction';

		this.intersectMeshs.push(this.textMusicButton);
		this.intersectMeshs.push(this.navToMenuButton);
	}

	show() {
		this.updateTextures();
	}

	updateTextures() {
		let texts = this.mainView.config.texts;

		this.mainView.fontTexture.setTextureToObject(
			this.textMusic,
			{text: texts.optionsMusic, x: -12, y: 12, scale: 2, align: 'left'}
		);

		let properties = {x: 6, y: 12, scale: 2, align: 'right'};

		if (this.model.music) {
			properties.text = texts.optionsOn;
		} else {
			properties.text = texts.optionsOff;
		}

		this.mainView.fontTexture.setTextureToObject(this.textMusicValue, properties);

		this.mainView.fontTexture.setTextureToObject(
			this.textMusicButton,
			{text: '\u25BA', x: 9, y: 12, opacity: 0.2, scale: 2, align: 'left'}
		);

		this.mainView.fontTexture.setTextureToObject(
			this.navToMenuButton,
			{text: '\u25C4 ' + texts.navigationMenu, x: -24, y: -13, opacity: 0.2, scale: 2, align: 'left'}
		);
	}

	onKeyDownHandler(event) {
	}

	onMouseMoveHandler(event) {
	}

	onMouseUpHandler(event) {
	}
}

export default OptionsView;