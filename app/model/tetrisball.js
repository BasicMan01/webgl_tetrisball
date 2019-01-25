import ObjectMap from '../classes/objectMap.js';

class Tetrisball {
	constructor(config) {
		// configuration part
		config = config || {};
		this.size = config.size || 10;
		this.sizePreview = config.sizePreview || 5;
		this.sizeBlockRow = config.sizeBlockRow || 5;

		this.freeFields;
		this.rounds;
		this.points;

		this.blocksHelper = [];
		this.blocks = [];
		this.preview = [];

		this.newGame();
	}

	createBlocks() {
		this.blocks = Array(this.size).fill(-1).map(x => Array(this.size).fill(-1));
	}

	createPreview() {
		for (let i = 0; i < this.sizePreview; i++) {
			this.preview[i] = Math.floor(Math.random() * 100) % 6;
		}
	}

	getRandomFreePosition() {
		let x = Math.floor(Math.random() * this.size);
		let y = Math.floor(Math.random() * this.size);

		while (this.blocks[y][x] !== -1) {
			x = Math.floor(Math.random() * this.size);
			y = Math.floor(Math.random() * this.size);
		}

		return {x: x, y: y};
	}

	newGame() {
		this.freeFields = this.size * this.size;
		this.rounds = 0;
		this.points = 0;

		this.createPreview();
		this.createBlocks();
		this.addPreview();
	}

	addPreview() {
		if (this.freeFields > 0) {
			let i = 0;

			if (this.freeFields >= this.sizePreview) {
				for(; i < this.sizePreview; ++i) {
					let position = this.getRandomFreePosition();

					this.blocks[position.y][position.x] = this.preview[i];
					this.freeFields--;
				}
			} else {
				while (this.freeFields > 0) {
					let position = this.getRandomFreePosition();

					this.blocks[position.y][position.x] = this.preview[i];
					this.freeFields--;
					i++;
				}
			}

			this.rounds++;
			this.createPreview();
			this.findRow();
		}
	}

	findFreeField(curX, curY, endX, endY) {
		// end block reached
		if (curX === endX && curY === endY) {
			return true;
		}

		if(curX > 0 && this.blocksHelper[curY][curX - 1] === false) {
			this.blocksHelper[curY][curX - 1] = true;

			if (this.findFreeField(curX - 1, curY, endX, endY)) {
				return true;
			}
		}

		if(curY > 0 && this.blocksHelper[curY - 1][curX] === false) {
			this.blocksHelper[curY - 1][curX] = true;

			if (this.findFreeField(curX, curY - 1, endX, endY)) {
				return true;
			}
		}

		if(curX < this.size - 1 && this.blocksHelper[curY][curX + 1] === false) {
			this.blocksHelper[curY][curX + 1] = true;

			if (this.findFreeField(curX + 1, curY, endX, endY)) {
				return true;
			}
		}

		if(curY < this.size - 1 && this.blocksHelper[curY + 1][curX] === false) {
			this.blocksHelper[curY + 1][curX] = true;

			if (this.findFreeField(curX, curY + 1, endX, endY)) {
				return true;
			}
		}

		return false;
	}

	findWay(curX, curY, endX, endY) {
		for (let y = 0; y < this.size; y++) {
			this.blocksHelper[y] = [];

			for (let x = 0; x < this.size; x++) {
				this.blocksHelper[y][x] = (this.blocks[y][x] !== -1);
			}
		}

		if (this.findFreeField(curX, curY, endX, endY)) {
			this.blocks[endY][endX] = this.blocks[curY][curX];
			this.blocks[curY][curX] = -1;

			if (!this.findRow()) {
				this.addPreview();
			}

			return true;
		}

		return false;
	}

	findRow() {
		let x, y, i;
		let value;
		let equalBlocks;
		let foundBlocks = new ObjectMap();

		for (y = 0; y < this.size; y++) {
			for (x = 0; x < this.size; x++) {
				value = this.blocks[y][x];

				if (value !== -1) {
					equalBlocks = 1;

					while ((x + equalBlocks) < this.size && this.blocks[y][x + equalBlocks] == value) {
						equalBlocks++;
					}

					if (equalBlocks >= this.sizeBlockRow) {
						for (i = 0; i < equalBlocks; ++i) {
							foundBlocks.add({x: x + i, y: y});
						}
					}

					equalBlocks = 1;

					while ((y + equalBlocks) < this.size && this.blocks[y + equalBlocks][x] == value) {
						equalBlocks++;
					}

					if (equalBlocks >= this.sizeBlockRow) {
						for (i = 0; i < equalBlocks; ++i) {
							foundBlocks.add({x: x, y: y + i});
						}
					}

					equalBlocks = 1;

					while (
						(x + equalBlocks) < this.size &&
						(y + equalBlocks) < this.size &&
						this.blocks[y + equalBlocks][x + equalBlocks] == value
					) {
						equalBlocks++;
					}

					if (equalBlocks >= this.sizeBlockRow) {
						for (i = 0; i < equalBlocks; ++i) {
							foundBlocks.add({x: x + i, y: y + i});
						}
					}

					equalBlocks = 1;

					while (
						(x - equalBlocks) >= 0 &&
						(y + equalBlocks) < this.size &&
						this.blocks[y + equalBlocks][x - equalBlocks] == value
					) {
						equalBlocks++;
					}

					if (equalBlocks >= this.sizeBlockRow) {
						for (i = 0; i < equalBlocks; ++i) {
							foundBlocks.add({x: x - i, y: y + i});
						}
					}
				}
			}
		}

		if (foundBlocks.size()) {
			let pointsPerRound = 0;
			let k = 0;

			foundBlocks.forEach((value) => {
				this.blocks[value.y][value.x] = -1;
				pointsPerRound += ++k;
			});

			this.freeFields += foundBlocks.size();
			this.points += pointsPerRound;

			return true;
		}

		return false;
	}
}

export default Tetrisball;