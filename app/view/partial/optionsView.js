import BaseView from './baseView.js';

class OptionsView extends BaseView {
	constructor(mainView, model) {
		super(mainView);

		this.model = model;

		this.textMusic = null;
		this.textMusicValue = null;
		this.textMusicButton = null;
		this.navToMenuButton = null;

		this.createObjects();
	}

	createObjects() {
		this.textMusic = this.mainView.addTextBasePlane(this.scene);
		this.textMusicValue = this.mainView.addTextBasePlane(this.scene);
		this.textMusicButton = this.mainView.addTextBasePlane(this.scene);
		this.textLanguage = this.mainView.addTextBasePlane(this.scene);
		this.textLanguageValue = this.mainView.addTextBasePlane(this.scene);
		this.textLanguageNextButton = this.mainView.addTextBasePlane(this.scene);
		this.textLanguagePreviousButton = this.mainView.addTextBasePlane(this.scene);
		this.navToMenuButton = this.mainView.addTextBasePlane(this.scene);

		this.textMusicButton.userData.actionHandler = 'setMusicAction';
		this.textLanguageNextButton.userData.actionHandler = 'nextLanguageAction';
		this.textLanguagePreviousButton.userData.actionHandler = 'previousLanguageAction';
		this.navToMenuButton.userData.actionHandler = 'navToMenuAction';

		this.intersectMeshs.push(this.textMusicButton);
		this.intersectMeshs.push(this.textLanguageNextButton);
		this.intersectMeshs.push(this.textLanguagePreviousButton);
		this.intersectMeshs.push(this.navToMenuButton);
	}

	show() {
		this.selectedObject = null;
		
		this.updateTextures();
	}

	updateTextures() {
		let texts = this.mainView.config.texts;

		this.mainView.fontTexture.setTextureToObject(
			this.textMusic,
			{text: texts.optionsMusic, x: -8, y: 12, scale: 2, align: 'left'}
		);

		this.mainView.fontTexture.setTextureToObject(
			this.textMusicValue,
			{
				text: this.model.music ? texts.optionsOn : texts.optionsOff,
				x: 4,
				y: 12,
				scale: 2,
				align: 'right'
			}
		);

		this.mainView.fontTexture.setTextureToObject(
			this.textMusicButton,
			{text: '\u25BA', x: 6, y: 12, opacity: 0.2, scale: 2, align: 'left'}
		);

		this.mainView.fontTexture.setTextureToObject(
			this.textLanguage,
			{text: texts.optionsLanguage, x: -8, y: 9.5, scale: 2, align: 'left'}
		);

		this.mainView.fontTexture.setTextureToObject(
			this.textLanguagePreviousButton,
			{text: '\u25C4', x: 0, y: 9.5, opacity: 0.2, scale: 2, align: 'left'}
		);

		this.mainView.fontTexture.setTextureToObject(
			this.textLanguageValue,
			{text: this.model.language.toUpperCase(), x: 4, y: 9.5, scale: 2, align: 'right'}
		);

		this.mainView.fontTexture.setTextureToObject(
			this.textLanguageNextButton,
			{text: '\u25BA', x: 6, y: 9.5, opacity: 0.2, scale: 2, align: 'left'}
		);

		this.mainView.fontTexture.setTextureToObject(
			this.navToMenuButton,
			{text: '\u25C4 ' + texts.navigationMenu, x: -16, y: -13, opacity: 0.2, scale: 2, align: 'left'}
		);
	}
}

export default OptionsView;