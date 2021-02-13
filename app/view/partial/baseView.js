import * as THREE from '../../../lib/threejs_125/build/three.module.js';

class BaseView {
	constructor(mainView) {
		this.mainView = mainView;

		this.intersectMeshs = [];
		this.selectedObject = null;

		this.raycaster = new THREE.Raycaster();
		this.scene = new THREE.Scene();

		if (new.target === BaseView) {
			throw new TypeError("Cannot construct Abstract instances directly");
		}

		if (typeof this.show !== 'function') {
			throw new TypeError('show not implemented in class ' + this.constructor.name);
		}

		if (typeof this.updateTextures !== 'function') {
			throw new TypeError('updateTextures not implemented in class ' + this.constructor.name);
		}
	}

	intersectObjects(pointerVector, camera) {
		this.raycaster.setFromCamera(pointerVector, camera);

		let intersects = this.raycaster.intersectObjects(this.intersectMeshs, true);

		if (this.selectedObject !== null) {
			this.selectedObject.material.opacity = 0.2;
			this.selectedObject = null;
		}

		if (intersects.length > 0) {
			this.selectedObject = intersects[0].object;
			this.selectedObject.material.opacity = 1;
		}
	}

	useIntersectedObject() {
		if (this.selectedObject !== null) {
			this.mainView.emit(this.selectedObject.userData.actionHandler);

			this.selectedObject = null;
		}
	}
}

export default BaseView;