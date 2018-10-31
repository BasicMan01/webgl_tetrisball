class Highscore {
	constructor() {
		this.maxItems = 10;
		this.maxNameLength = 20;
		this.storageKey = 'highscoreTetrisball';

		this.insertNewName = false;
		this.items = [];

		this.initItems();
		this.loadFromStorage();
	}

	initItems() {
		this.items = [];

		for (let i = 0; i < this.maxItems; ++i) {
			this.items.push({
				rounds: 0,
				points: 0,
				name: 'ANONYMOUS'
			});
		}
	}

	initNewEntry(rounds, points) {
		this.insertNewName = true;
		this.currentInsertIndex = this.maxItems;

		this.items.push({
			rounds: rounds,
			points: points,
			name: '_'
		});

		for (let i = this.maxItems - 1; i >= 0; --i) {
			if (this.items[i].points < this.items[i + 1].points) {
				let temp = this.items[i];
				this.items[i] = this.items[i + 1];
				this.items[i + 1] = temp;

				this.currentInsertIndex = i;
			}
		}

		this.items.pop();
	}

	reset() {
		this.initItems();
		this.saveToStorage();
	}

	save() {
		if (this.insertNewName) {
			this.insertNewName = false;

			this.items[this.currentInsertIndex].name = this.truncateName(this.items[this.currentInsertIndex].name);

			this.saveToStorage();
		}
	}

	loadFromStorage() {
		let itemsFromStorage = localStorage.getItem(this.storageKey);

		if (itemsFromStorage !== null) {
			try {
				this.items = JSON.parse(itemsFromStorage);
			} catch(e) {
				console.error('JSON parse error');
			}
		}
	}

	saveToStorage() {
		localStorage.setItem(this.storageKey, JSON.stringify(this.items));
	}

	applyName(content) {
		if (this.insertNewName) {
			this.items[this.currentInsertIndex].name = content + '_';
		}
	}

	truncateName(name) {
		// remove cursor char
		name = name.substring(0, name.length - 1);

		// limit to max length
		name = name.substring(0, this.maxNameLength);

		return name;
	}
}

export default Highscore;