import * as THREE from '../../../lib/threejs_158/build/three.module.js';

import helper from '../../../lib/rdo/helper.js';

import BaseView from './baseView.js';

class GameView extends BaseView {
	constructor(mainView, model) {
		super(mainView);

		this.model = model;

		this.addPreviewBlocksButton = null;
		this.navToMenuButton = null;
		this.textLabelFields = null;
		this.textLabelRounds = null;
		this.textLabelPoints = null;
		this.textValueFields  = null;
		this.textValueRounds = null;
		this.textValuePoints = null;

		this.intersectBlockMeshs = [];
		this.intersectGroundMeshs = [];
		this.intersectGameMeshs = [];
		this.selectedBlock = null;
		this.selectedGround = null;
		this.markedBlock = null;

		this.container = new THREE.Group();
		this.blocks = [];
		this.grounds = [];
		this.previewBlocks = [];

		this.createObjects();
	}

	createObjects() {
		let geometryBlock = new THREE.BoxGeometry(1, 1, 1);
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

		this.container.position.set(0, 0.8, 0);
		this.container.scale.set(2, 2, 2);
		this.container.rotation.set(-0.58, -0, -0.47);

		this.scene.add(this.container);

		for(let i = 0; i < this.model.sizePreview; i++) {
			this.previewBlocks[i] = new THREE.Mesh(geometryBlock);
			this.previewBlocks[i].renderOrder = 99999;
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

	intersectObjects(pointerVector, camera) {
		super.intersectObjects(pointerVector, camera);

		let intersects = null;

		if (this.markedBlock === null) {
			intersects = this.raycaster.intersectObjects(this.intersectBlockMeshs, true);

			if (this.selectedBlock !== null) {
				this.selectedBlock.material.opacity = 1;
				this.selectedBlock = null;
			}

			if (intersects.length > 0) {
				this.selectedBlock = intersects[0].object;
				this.selectedBlock.material.opacity = 0.5;
			}
		} else {
			intersects = this.raycaster.intersectObjects(this.intersectGameMeshs, true);

			if (this.selectedGround !== null) {
				this.selectedGround.material.map = this.mainView.textureManager.get('nonPick');
				this.selectedGround = null;
			}

			if (this.selectedBlock !== null && this.markedBlock !== this.selectedBlock) {
				this.selectedBlock.material.opacity = 1;
				this.selectedBlock = null;
			}

			if (intersects.length > 0) {
				if (intersects[0].object.userData.type === 'ground') {
					this.selectedGround = intersects[0].object;
					this.selectedGround.material.map = this.mainView.textureManager.get('pick');
				} else if (intersects[0].object.userData.type === 'block') {
					this.selectedBlock = intersects[0].object;
					this.selectedBlock.material.opacity = 0.5;
				}
			}
		}
	}

	useIntersectedObject() {
		super.useIntersectedObject();

		// the mouse pointer is over a block element
		if (this.selectedGround === null && this.selectedBlock !== null) {
			if (this.markedBlock !== null) {
				this.markedBlock.material.opacity = 1;
			}

			if (this.markedBlock !== this.selectedBlock) {
				this.markedBlock = this.selectedBlock;
				this.selectedBlock = null;

				this.mainView.emit(this.markedBlock.userData.actionHandler, {
					curX: this.markedBlock.userData.x,
					curY: this.markedBlock.userData.y
				});
			} else {
				// unselect selected block
				this.markedBlock = null;
				this.selectedBlock = null;
			}
		}

		// the mouse pointer is over a ground element
		if (this.selectedGround !== null && this.markedBlock !== null) {
			let wayFound = this.mainView.emit(this.selectedGround.userData.actionHandler, {
				curX: this.markedBlock.userData.x,
				curY: this.markedBlock.userData.y,
				endX: this.selectedGround.userData.x,
				endY: this.selectedGround.userData.y
			});

			if (wayFound) {
				this.markedBlock.material.opacity = 1;
				this.markedBlock = null;
				this.selectedGround = null;
			}
		}
	}

	readjustLimit() {
		if (this.container.rotation.x > 0) {
			this.container.rotation.x = 0;
		} else if (this.container.rotation.x < -Math.PI / 2) {
			this.container.rotation.x = -Math.PI / 2;
		}

		if (this.container.scale.x < 2) {
			this.container.scale.set(2, 2, 2);
		} else if (this.container.scale.x > 4) {
			this.container.scale.set(4, 4, 4);
		}
	}

	rotateGameBoard(vec) {
		this.container.rotation.x -= vec.y * 2;
		this.container.rotation.z += vec.x * 2;

		this.readjustLimit();
	}

	scaleGameBoard(val) {
		this.container.scale.x += val;
		this.container.scale.y += val;
		this.container.scale.z += val;

		this.readjustLimit();
	}

	show() {
		this.selectedObject = null;
		this.selectedBlock = null;
		this.selectedGround = null;
		this.markedBlock = null;

		for (let y = 0; y < this.model.size; y++) {
			for (let x = 0; x < this.model.size; x++) {
				this.blocks[y][x].material.opacity = 1;
			}
		}

		this.updateTextures();
	}

	updateTextures() {
		let texts = this.mainView.config.texts;
		let x = (-15 * this.mainView.camera.aspect) + (this.model.sizePreview * 2.5) + 2;

		this.mainView.fontTexture.setTextureToObject(
			this.addPreviewBlocksButton,
			{text: '\u2795', x: x, y: 11.5, scale: 2, opacity: 0.2, useAspectRatio: false }
		);

		this.mainView.fontTexture.setTextureToObject(
			this.navToMenuButton,
			{text: '\u25C4 ' + texts.navigationMenu, x: -16, y: -13, opacity: 0.2, scale: 2, align: 'left'}
		);

		this.mainView.fontTexture.setTextureToObject(
			this.textLabelFields,
			{text: texts.gameFields + ':', x: 9, y: 13, align: 'left'}
		);

		this.mainView.fontTexture.setTextureToObject(
			this.textValueFields,
			{text: helper.pad0(this.model.freeFields, 3), x: 14, y: 13, align: 'right'}
		);

		this.mainView.fontTexture.setTextureToObject(
			this.textLabelRounds,
			{text: texts.gameRounds + ':', x: 9, y: 11.5, align: 'left'}
		);

		this.mainView.fontTexture.setTextureToObject(
			this.textValueRounds,
			{text: helper.pad0(this.model.rounds, 3), x: 14, y: 11.5, align: 'right'}
		);

		this.mainView.fontTexture.setTextureToObject(
			this.textLabelPoints,
			{text: texts.gamePoints + ':', x: 9, y: 10.0, align: 'left'}
		);

		this.mainView.fontTexture.setTextureToObject(
			this.textValuePoints,
			{text: helper.pad0(this.model.points, 4), x: 14, y: 10.0, align: 'right'}
		);

		for(let i = 0; i < this.model.preview.length; i++) {
			let x = (i * 2.5) - (15 * this.mainView.camera.aspect);

			this.previewBlocks[i].position.set(x, 12, 0);
			this.previewBlocks[i].material.map = this.mainView.textureManager.get(this.model.preview[i].toString());
		}

		this.intersectGroundMeshs = [];
		this.intersectBlockMeshs = [];
		this.intersectGameMeshs = [];

		for (let y = 0; y < this.model.size; y++) {
			for (let x = 0; x < this.model.size; x++) {
				this.grounds[y][x].material.map = this.mainView.textureManager.get('nonPick');

				if (this.model.blocks[y][x] !== -1) {
					this.blocks[y][x].material.map = this.mainView.textureManager.get(this.model.blocks[y][x].toString());
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
}

export default GameView;