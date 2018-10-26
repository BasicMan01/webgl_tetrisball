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
		if (typeof this.onClickHandler !== 'function') {
			throw new TypeError('onClickHandler(event) not implemented in class ' + this.constructor.name);
		}

		if (typeof this.onKeyDownHandler !== 'function') {
			throw new TypeError('onKeyDownHandler(event) not implemented in class ' + this.constructor.name);
		}

		if (typeof this.onMouseMoveHandler !== 'function') {
			throw new TypeError('onMouseMoveHandler(event) not implemented in class ' + this.constructor.name);
		}
	}
}

export default BaseView;