class ObjectMap {
	constructor() {
		this.map = new Map();
	}

	add(o) {
		this.map.set(this.getKey(o), o);
	}

	forEach(callback) {
		this.map.forEach(callback);
	}

	getKey(o) {
		return o.x + '_' + o.y;
	}

	size() {
		return this.map.size;
	}
}

export default ObjectMap;