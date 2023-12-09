import * as THREE from '../../lib/threejs_158/build/three.module.js';

class FontTexture {
	constructor(font, camera) {
		this.camera = camera;
		this.font = font;

		this.font.family = this.initProperty(this.font, 'family', 'Arial');
		this.font.size = this.initProperty(this.font, 'size', '14px');
		this.font.weight = this.initProperty(this.font, 'weight', '100');
		this.font.baseline = this.initProperty(this.font, 'baseline', 'top');
		this.font.left = this.initProperty(this.font, 'left', 0);
		this.font.top = this.initProperty(this.font, 'top', 0);
		this.font.backgroundImg = this.initProperty(this.font, 'backgroundImg', null);
		this.font.backgroundColor = this.initProperty(this.font, 'backgroundColor', 'rgba(0, 0, 0, 1)');
		this.font.color = this.initProperty(this.font, 'color', 'rgba(255, 255, 255, 1)');

		this.fontBaseInfo = this.font.weight + ' ' + this.font.size + ' ' + this.font.family;
	}

	initProperty(obj, key, defaultValue) {
		return typeof obj[key] !== 'undefined' ? obj[key] : defaultValue;
	}

	setTextureToObject(mesh, properties) {
		let text = this.initProperty(properties, 'text', '');
		let align = this.initProperty(properties, 'align', 'center');
		let opacity = this.initProperty(properties, 'opacity', 1);
		let scale = this.initProperty(properties, 'scale', 1);
		let useAspectRatio = this.initProperty(properties, 'useAspectRatio', true);
		let x = this.initProperty(properties, 'x', 0);
		let y = this.initProperty(properties, 'y', 0);

		let texture = this.createTexture(text);
		let textLength = texture.image.width / 32;

		mesh.renderOrder = 99999;
		mesh.position.set(0, 0, 0);
		mesh.scale.set(scale, scale, 1);
		mesh.material.map = texture;
		mesh.material.depthTest = false;
		mesh.material.opacity = opacity;
		mesh.material.transparent = true;
		mesh.material.needsUpdate = true;

		if (align == 'left') {
			mesh.position.x += (textLength / 2) * scale;
		} else if (align == 'right') {
			mesh.position.x -= (textLength / 2) * scale;
		}

		if (useAspectRatio) {
			x *= this.camera.aspect;
		}

		mesh.position.x += x;
		mesh.position.y += y;

		mesh.scale.x *= textLength;
		mesh.scale.y *= 1;
	}

	createTexture(text) {
		let canvas = document.createElement('canvas');
		let context = canvas.getContext('2d');

		canvas.height = 32;
		canvas.width = text.length * 32;

		// adjust canvas width to text width
		canvas.width = this.getCanvasWidthByInput(context, text);


		context.clearRect(0, 0, canvas.width, canvas.height);

		context.textBaseline = this.font.baseline;
		context.font = this.fontBaseInfo;

		context.globalCompositeOperation = "source-over";
		context.fillStyle = this.font.backgroundColor;
		context.fillRect(0, 0, canvas.width, canvas.height);

		if (this.font.backgroundImg !== null) {
			context.globalCompositeOperation = "xor";
			context.fillText(text, this.font.left, this.font.top);
			context.drawImage(this.font.backgroundImg, 0, 0, canvas.width, canvas.height);
		} else {
			context.fillStyle = this.font.color;
			context.fillText(text, this.font.left, this.font.top);
		}


		let texture = new THREE.Texture(canvas);

		texture.colorSpace = THREE.SRGBColorSpace;
		texture.minFilter = THREE.LinearFilter;
		texture.needsUpdate = true;

		return texture;
	}

	getCanvasWidthByInput(context, text) {
		context.font = this.fontBaseInfo;
		context.fillText(text, 0, 0);

		return context.measureText(text).width;
	}
}

export default FontTexture;