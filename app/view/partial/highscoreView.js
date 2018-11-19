import helper from '../../../lib/rdo/helper.js';

import BaseView from './baseView.js';

class HighscoreView extends BaseView {
	constructor(mainView, model) {
		super();

		this.mainView = mainView;
		this.model = model;

		this.highscoreItems = [];
		this.resetButton = null;
		this.saveButton = null;
		this.navToMenuButton = null;
		this.intersectMeshs = [];
		this.hiddenInput = null;

		this.scene = new THREE.Scene();

		this.createObjects();
	}

	createObjects() {
		this.hiddenInput = document.createElement("input");
		this.hiddenInput.type = 'text';
		this.hiddenInput.id = 'hiddenInput';
		this.hiddenInput.maxLength = this.model.maxNameLength;
		this.hiddenInput.title = 'Input your name for highscore';
		this.hiddenInput.style.position = 'absolute';
		this.hiddenInput.style.opacity = '0';
		this.hiddenInput.style.top = '0';
		this.hiddenInput.style.transform = 'scale(0, 0)';
		this.hiddenInput.addEventListener('keydown', this.hiddenInputKeyDownHandler.bind(this));
		this.hiddenInput.addEventListener('keyup', this.hiddenInputKeyUpHandler.bind(this));

		document.body.appendChild(this.hiddenInput);

		this.resetButton = this.mainView.addTextBasePlane(this.scene);
		this.navToMenuButton = this.mainView.addTextBasePlane(this.scene);
		this.navToGameButton = this.mainView.addTextBasePlane(this.scene);

		for (let i = 0; i < this.model.maxItems; ++i) {
			this.highscoreItems.push(this.mainView.addTextBasePlane(this.scene));
		}

		this.resetButton.userData.actionHandler = 'resetHighscoreAction';
		this.navToMenuButton.userData.actionHandler = 'navToMenuAction';
		this.navToGameButton.userData.actionHandler = 'navToGameAction';

		this.intersectMeshs.push(this.resetButton);
		this.intersectMeshs.push(this.navToMenuButton);
		this.intersectMeshs.push(this.navToGameButton);
	}

	show() {
		if (this.model.insertNewName) {
			this.hiddenInput.focus();
			this.hiddenInput.value = '';
		}

		this.updateTextures();
	}

	updateTextures() {
		let texts = this.mainView.config.texts;

		for (let i = 0; i < this.model.maxItems; ++i) {
			let output = '';

			output += helper.pad0(i + 1, 2);
			output += '.  ';
			output += helper.pad0(this.model.items[i].points, 4);
			output += '  ';
			output += helper.pad0(this.model.items[i].rounds, 3);
			output += '  ';
			output += this.model.items[i].name;

			this.mainView.fontTexture.setTextureToObject(
				this.highscoreItems[i],
				{text: output, x: -12, y: 12 - (i * 2), scale: 2, align: 'left'}
			);
		}

		this.mainView.fontTexture.setTextureToObject(
			this.navToMenuButton,
			{text: '\u25C4 ' + texts.navigationMenu, x: -16, y: -13, opacity: 0.2, scale: 2, align: 'left'}
		);

		this.mainView.fontTexture.setTextureToObject(
			this.resetButton,
			{text: texts.highscoreReset, x: 0, y: -13, scale: 2, opacity: 0.2}
		);

		this.mainView.fontTexture.setTextureToObject(
			this.navToGameButton,
			{text: texts.navigationPlay + ' \u25BA', x: 16, y: -13, opacity: 0.2, scale: 2, align: 'right'}
		);
	}

	hiddenInputKeyDownHandler(event) {
		switch (event.keyCode) {
			case 9: { // TAB
				event.preventDefault();
			} break;

			case 13: { // ENTER
				this.mainView.emit('saveNameToHighscoreAction');
			} break;
		}

		this.mainView.render();
	}

	hiddenInputKeyUpHandler(event) {
		switch (event.keyCode) {
			case 13: { // ENTER
				this.hiddenInput.blur();
			} break;

			default: {
				this.mainView.emit('applyNameToHighscoreAction', {
					content: this.hiddenInput.value
				});
			}
		}

		this.updateTextures();
		this.mainView.render();
	}

	onKeyDownHandler(event) {
	}

	handlePointerMove(eventPosX, eventPosY) {
	}

	handlePointerUp(eventPosX, eventPosY) {
	}
}

export default HighscoreView;