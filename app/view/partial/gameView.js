import helper from '../../../lib/rdo/helper.js';

import BaseView from './baseView.js';

class GameView extends BaseView {
	constructor(mainView, model) {
		super();

		this.mainView = mainView;
		this.model = model;

		this.addPreviewBlocksButton = null;
		this.navToMenuButton = null;
		this.textLabelFields = null;
		this.textLabelRounds = null;
		this.textLabelPoints = null;
		this.textInfoFields = null;
		this.textInfoRounds = null;
		this.textInfoPoints = null;

		this.intersectMeshs = [];
		this.intersectBlockMeshs = [];
		this.intersectGroundMeshs = [];
		this.intersectGameMeshs = [];

		this.container = null;
		this.blocks = [];
		this.grounds = [];
		this.previewBlocks = [];

		this.scene = new THREE.Scene();

		this.createObjects();
	}

	createObjects() {
		let geometryBlock = new THREE.CubeGeometry(1, 1, 1);
		let geometryGround = new THREE.PlaneGeometry(1, 1);

		this.addPreviewBlocksButton = this.mainView.addTextBasePlane(this.scene);
		this.navToMenuButton = this.mainView.addTextBasePlane(this.scene);
		this.textLabelFields = this.mainView.addTextBasePlane(this.scene);
		this.textLabelRounds = this.mainView.addTextBasePlane(this.scene);
		this.textLabelPoints = this.mainView.addTextBasePlane(this.scene);
		this.textValueFields = this.mainView.addTextBasePlane(this.scene);
		this.textValueRounds = this.mainView.addTextBasePlane(this.scene);
		this.textValuePoints = this.mainView.addTextBasePlane(this.scene);

		this.addPreviewBlocksButton.userData.actionHandler = 'addPreviewBlocksAction';
		this.navToMenuButton.userData.actionHandler = 'navToMenuAction';

		this.intersectMeshs.push(this.addPreviewBlocksButton);
		this.intersectMeshs.push(this.navToMenuButton);

		this.container = new THREE.Group();
		this.container.position.set(0, 0.8, 0);
		this.container.scale.set(2, 2, 2);
		this.container.rotation.set(-0.58, -0, -0.47);

		this.scene.add(this.container);

		for(let i = 0; i < this.model.sizePreview; i++) {
			this.previewBlocks[i] = new THREE.Mesh(geometryBlock);
			this.previewBlocks[i].renderOrder = 99999;
			this.previewBlocks[i].position.set(i * 2.5 - 24, 12, 0);
			this.previewBlocks[i].scale.set(2, 2, 2);
			this.previewBlocks[i].material = new THREE.MeshBasicMaterial();
			this.previewBlocks[i].material.depthTest = false;
			this.previewBlocks[i].material.transparent = true;

			this.scene.add(this.previewBlocks[i]);
		}

		for (let y = 0; y < this.model.size; y++) {
			this.blocks[y] = [];
			this.grounds[y] = [];

			for (let x = 0; x < this.model.size; x++) {
				this.grounds[y][x] = new THREE.Mesh(geometryGround);
				this.grounds[y][x].position.set(x - 4.5, 4.5 - y, 0);
				this.grounds[y][x].userData.actionHandler = 'selectGroundAction';
				this.grounds[y][x].userData.type = 'ground';
				this.grounds[y][x].userData.x = x;
				this.grounds[y][x].userData.y = y;
				this.grounds[y][x].material = new THREE.MeshBasicMaterial({
					side: THREE.DoubleSide,
					transparent: true
				});

				this.blocks[y][x] = new THREE.Mesh(geometryBlock);
				this.blocks[y][x].position.set(x - 4.5, 4.5 - y, 0.5001);
				this.blocks[y][x].userData.actionHandler = 'selectBlockAction';
				this.blocks[y][x].userData.type = 'block';
				this.blocks[y][x].userData.x = x;
				this.blocks[y][x].userData.y = y;
				this.blocks[y][x].visible = false;
				this.blocks[y][x].material = new THREE.MeshBasicMaterial({transparent: true});

				this.container.add(this.grounds[y][x]);
				this.container.add(this.blocks[y][x]);
			}
		}
	}

	show() {
		this.updateTextures();
	}

	updateTextures() {
		let texts = this.mainView.config.texts;

		this.mainView.fontTexture.setTextureToObject(
			this.addPreviewBlocksButton,
			{text: '\u25B6', x: -24 + (this.model.sizePreview * 2.5) + 2, y: 12, scale: 2, opacity: 0.2}
		);

		this.mainView.fontTexture.setTextureToObject(
			this.navToMenuButton,
			{text: '\u25C0 ' + texts.navigationMenu, x: -24, y: -13, opacity: 0.2, scale: 2, align: 'left'}
		);

		this.mainView.fontTexture.setTextureToObject(
			this.textLabelFields,
			{text: texts.gameFields + ':', x: 19, y: 13, align: 'left'}
		);

		this.mainView.fontTexture.setTextureToObject(
			this.textValueFields,
			{text: helper.pad0(this.model.freeFields, 3), x: 26, y: 13, align: 'right'}
		);

		this.mainView.fontTexture.setTextureToObject(
			this.textLabelRounds,
			{text: texts.gameRounds + ':', x: 19, y: 11.5, align: 'left'}
		);

		this.mainView.fontTexture.setTextureToObject(
			this.textValueRounds,
			{text: helper.pad0(this.model.rounds, 3), x: 26, y: 11.5, align: 'right'}
		);

		this.mainView.fontTexture.setTextureToObject(
			this.textLabelPoints,
			{text: texts.gamePoints + ':', x: 19, y: 10.0, align: 'left'}
		);

		this.mainView.fontTexture.setTextureToObject(
			this.textValuePoints,
			{text: helper.pad0(this.model.points, 4), x: 26, y: 10.0, align: 'right'}
		);

		for(let i = 0; i < this.model.preview.length; i++) {
			this.previewBlocks[i].material.map = this.mainView.blockTextures[this.model.preview[i]];
		}

		this.intersectGroundMeshs = [];
		this.intersectBlockMeshs = [];
		this.intersectGameMeshs = [];

		for (let y = 0; y < this.model.size; y++) {
			for (let x = 0; x < this.model.size; x++) {
				this.grounds[y][x].material.map = this.mainView.nonPickTexture;

				if (this.model.blocks[y][x] !== -1) {
					this.blocks[y][x].material.map = this.mainView.blockTextures[this.model.blocks[y][x]];
					this.blocks[y][x].visible = true;

					this.intersectBlockMeshs.push(this.blocks[y][x]);
					this.intersectGameMeshs.push(this.blocks[y][x]);
				} else {
					this.blocks[y][x].visible = false;
					this.blocks[y][x].material.map = null;

					this.intersectGroundMeshs.push(this.grounds[y][x]);
					this.intersectGameMeshs.push(this.grounds[y][x]);
				}
			}
		}
	}

	onKeyDownHandler(event) {
		switch (event.keyCode) {
			case 87: { // W
				this.container.rotation.x -= 0.01;
			} break;

			case 83: { // S
				this.container.rotation.x += 0.01;
			} break;

			case 65: { // A
				this.container.rotation.y -= 0.01;
			} break;

			case 68: { // D
				this.container.rotation.y += 0.01;
			} break;

			case 81: { // Q
				this.container.rotation.z -= 0.01;
			} break;

			case 69: { // E
				this.container.rotation.z += 0.01;
			} break;

			case 88: { // X
				this.container.scale.x += 0.1;
				this.container.scale.y += 0.1;
				this.container.scale.z += 0.1;
			} break;

			case 89: { // Y
				this.container.scale.x -= 0.1;
				this.container.scale.y -= 0.1;
				this.container.scale.z -= 0.1;
			} break;

			case 32: {
				console.log(this.container.rotation);
				console.log(this.container.scale);
			} break;
		}
	}
}

export default GameView;