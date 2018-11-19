class BaseView {
	constructor() {
		if (new.target === BaseView) {
			throw new TypeError("Cannot construct Abstract instances directly");
		}

		if (typeof this.show !== 'function') {
			throw new TypeError('show not implemented in class ' + this.constructor.name);
		}

		if (typeof this.updateTextures !== 'function') {
			throw new TypeError('updateTextures not implemented in class ' + this.constructor.name);
		}

		// HANDLER
		if (typeof this.onKeyDownHandler !== 'function') {
			throw new TypeError('onKeyDownHandler(event) not implemented in class ' + this.constructor.name);
		}

		if (typeof this.handlePointerMove !== 'function') {
			throw new TypeError('handlePointerMove(eventPosX, eventPosY) not implemented in class ' + this.constructor.name);
		}

		if (typeof this.handlePointerUp !== 'function') {
			throw new TypeError('handlePointerUp(eventPosX, eventPosY) not implemented in class ' + this.constructor.name);
		}
	}
}

export default BaseView;