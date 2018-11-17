import Observable from '../classes/observable.js';
import TextureManager from '../classes/textureManager.js';
import FontTexture from '../../lib/rdo/fontTexture.js';

import MenuView from '../view/partial/menuView.js';
import GameView from '../view/partial/gameView.js';
import HighscoreView from '../view/partial/highscoreView.js';
import OptionsView from '../view/partial/optionsView.js';

class View extends Observable {
	constructor(config, partialModels) {
		super();

		this.config = config;
		this.partialModels = partialModels;

		this.partialView = null;
		this.menuView = null;
		this.gameView = null;
		this.optionsView = null;
		this.highscoreView = null;

		this.intersectMeshs = [];
		this.selectedObject = null;
		this.selectedBlock = null;
		this.selectedGround = null;
		this.markedBlock = null;


		this.canvas = document.getElementById('webGlCanvas');

		this.scene = new THREE.Scene();

		this.camera = new THREE.PerspectiveCamera(59, this.getCameraAspect(), 1, 1000);
		this.camera.position.set(0, 0, 30);

		this.renderer = new THREE.WebGLRenderer({antialias: true});
		this.renderer.setClearColor(0x000000, 1);
		this.renderer.setPixelRatio(window.devicePixelRatio);
		this.renderer.setSize(this.getGameAreaWidth(), this.getGameAreaHeight());
		this.renderer.sortObjects = true;

		this.canvas.appendChild(this.renderer.domElement);

		this.raycaster = new THREE.Raycaster();
		this.fontTexture = new FontTexture(this.config.font, this.camera);
		this.textureManager = new TextureManager();

		this.renderer.domElement.addEventListener('mousemove', this.onMouseMoveHandler.bind(this), false);
		this.renderer.domElement.addEventListener('mouseup', this.onMouseUpHandler.bind(this), false);

		window.addEventListener('keydown', this.onKeyDownHandler.bind(this), false);
		window.addEventListener('resize', this.onResizeHandler.bind(this), false);

		this.load();
	}

	load() {
		let files = {
			'pick': 'resources/texture/game/pick.png',
			'nonPick': 'resources/texture/game/nonpick.png'
		};
		
		for (let i = 0; i < 6; ++i) {
			files[i.toString()] = 'resources/texture/game/' + (i + 1).toString() + '.png';
		}

		this.textureManager.loadAll(files, this.init.bind(this));
	}

	init() {
		this.menuView = new MenuView(this);
		this.gameView = new GameView(this, this.partialModels.tetrisball);
		this.optionsView = new OptionsView(this, this.partialModels.options);
		this.highscoreView = new HighscoreView(this, this.partialModels.highscore);

		this.showMenuView();

		this.render();
	}

	render() {
		this.renderer.render(this.scene, this.camera);
	}

	addTextBasePlane(scene) {
		let plane = new THREE.Mesh(
			new THREE.PlaneGeometry(1, 1),
			new THREE.MeshBasicMaterial({ side: THREE.DoubleSide, transparent: true, opacity: 1 })
		);

		scene.add(plane);

		return plane;
	}

	setPartialView(obj) {
		this.partialView = obj;

		this.scene = this.partialView.scene;
		this.intersectMeshs = this.partialView.intersectMeshs;

		this.partialView.show();
	}

	showGameView() {
		this.setPartialView(this.gameView);
	}

	showHighscoreView() {
		this.setPartialView(this.highscoreView);
	}

	showMenuView() {
		this.setPartialView(this.menuView);
	}

	showOptionsView() {
		this.setPartialView(this.optionsView);
	}


	getGameAreaHeight() { return this.canvas.offsetHeight; }
	getGameAreaWidth() { return this.canvas.offsetWidth; }

	getCameraAspect() { return this.getGameAreaWidth() / this.getGameAreaHeight(); }

	getMouseVector2() {
		var rect = this.canvas.getBoundingClientRect();
		var mouseVector2 = new THREE.Vector2();

		mouseVector2.x = ((event.clientX - rect.left) / this.getGameAreaWidth()) * 2 - 1;
		mouseVector2.y = -((event.clientY - rect.top) / this.getGameAreaHeight()) * 2 + 1;

		return mouseVector2;
	}

	onKeyDownHandler(event) {
		this.partialView.onKeyDownHandler(event);
		this.render();
	}

	onMouseMoveHandler(event) {
		let intersects = null;

		this.raycaster.setFromCamera(this.getMouseVector2(), this.camera);

		intersects = this.raycaster.intersectObjects(this.intersectMeshs, true);

		if (this.selectedObject !== null) {
			this.selectedObject.material.opacity = 0.2;
			this.selectedObject = null;
		}

		if (intersects.length > 0) {
			this.selectedObject = intersects[0].object;
			this.selectedObject.material.opacity = 1;
		}

		if (this.gameView !== null) {
			if (this.markedBlock === null) {
				intersects = this.raycaster.intersectObjects(this.gameView.intersectBlockMeshs, true);

				if (this.selectedBlock !== null) {
					this.selectedBlock.material.opacity = 1;
					this.selectedBlock = null;
				}

				if (intersects.length > 0) {
					this.selectedBlock = intersects[0].object;
					this.selectedBlock.material.opacity = 0.5;
				}
			} else {
				intersects = this.raycaster.intersectObjects(this.gameView.intersectGameMeshs, true);

				if (this.selectedGround !== null) {
					this.selectedGround.material.map = this.textureManager.get('nonPick');
					this.selectedGround = null;
				}

				if (this.selectedBlock !== null && this.markedBlock !== this.selectedBlock) {
					this.selectedBlock.material.opacity = 1;
					this.selectedBlock = null;
				}

				if (intersects.length > 0) {
					if (intersects[0].object.userData.type === 'ground') {
						this.selectedGround = intersects[0].object;
						this.selectedGround.material.map = this.textureManager.get('pick');
					} else if (intersects[0].object.userData.type === 'block') {
						this.selectedBlock = intersects[0].object;
						this.selectedBlock.material.opacity = 0.5;
					}
				}
			}
		}

		this.render();
	}

	onMouseUpHandler() {
		this.partialView.onMouseUpHandler(event);

		if (this.selectedObject !== null) {
			this.emit(this.selectedObject.userData.actionHandler);

			this.selectedObject = null;
		}

		// the mouse pointer is over a block element
		if (this.selectedGround === null && this.selectedBlock !== null) {
			if (this.markedBlock !== null) {
				this.markedBlock.material.opacity = 1;
			}

			if (this.markedBlock !== this.selectedBlock) {
				this.markedBlock = this.selectedBlock;
				this.selectedBlock = null;

				this.emit(this.markedBlock.userData.actionHandler, {
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
			let wayFound = this.emit(this.selectedGround.userData.actionHandler, {
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

		this.partialView.updateTextures();
		this.render();
	}

	onResizeHandler(event) {
		this.camera.aspect = this.getCameraAspect();
		this.camera.updateProjectionMatrix();

		this.renderer.setSize(this.getGameAreaWidth(), this.getGameAreaHeight());

		this.partialView.updateTextures();
		this.render();
	}
}

export default View;