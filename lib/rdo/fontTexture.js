class FontTexture {
	constructor(fontImage) {
		this.font = '700 30px Courier New';
		this.fontImage = fontImage;
	}

	setTextureToObject(mesh, properties) {
		let text = typeof properties.text !== 'undefined' ? properties.text : '';
		let align = typeof properties.align !== 'undefined' ? properties.align : 'center';
		let opacity = typeof properties.opacity !== 'undefined' ? properties.opacity : 1;
		let x = typeof properties.x !== 'undefined' ? properties.x : 0;
		let y = typeof properties.y !== 'undefined' ? properties.y : 0;
		let scale = typeof properties.scale !== 'undefined' ? properties.scale : 1;

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



		// write text to canvas
		context.clearRect(0, 0, canvas.width, canvas.height);

		context.globalCompositeOperation = "source-over";
		context.fillStyle = "rgba(0, 0, 0, 1)";
		context.fillRect(0, 0, canvas.width, canvas.height);

		context.textBaseline = 'top';
		context.font = this.font;
		context.globalCompositeOperation = "xor";
		context.fillText(text, 0, 0);

		context.drawImage(this.fontImage, 0, 0, canvas.width, canvas.height);


		let texture = new THREE.Texture(canvas);

		texture.minFilter = THREE.LinearFilter;
		texture.needsUpdate = true;

		return texture;
	}

	getCanvasWidthByInput(context, text) {
		context.font = this.font;
		context.fillText(text, 0, 0);

		return context.measureText(text).width;
	}
}

export default FontTexture;