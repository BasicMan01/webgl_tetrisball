import Sound from '../../lib/rdo/sound.js';
import Config from '../model/config.js';
import Highscore from '../model/highscore.js';
import Options from '../model/options.js';
import Tetrisball from '../model/tetrisball.js';
import View from '../view/view.js';

class Controller {
	constructor() {
		this.sound = new Sound();

		this.config = new Config();
		this.config.load(this.init.bind(this));
	}

	init() {
		this.highscore = new Highscore();
		this.options = new Options();
		this.tetrisball = new Tetrisball();

		this.view = new View(this.config, {
			'options': this.options,
			'highscore': this.highscore,
			'tetrisball': this.tetrisball
		});

		// navigation
		this.view.addCallback('navToGameAction', this.navToGameAction.bind(this));
		this.view.addCallback('navToHighscoreAction', this.navToHighscoreAction.bind(this));
		this.view.addCallback('navToMenuAction', this.navToMenuAction.bind(this));
		this.view.addCallback('navToOptionsAction', this.navToOptionsAction.bind(this));
		// highscore
		this.view.addCallback('saveNameToHighscoreAction', this.saveNameToHighscoreAction.bind(this));
		this.view.addCallback('applyNameToHighscoreAction', this.applyNameToHighscoreAction.bind(this));
		this.view.addCallback('resetHighscoreAction', this.resetHighscoreAction.bind(this));
		// options
		this.view.addCallback('setMusicAction', this.setMusicAction.bind(this));
		// game
		this.view.addCallback('addPreviewBlocksAction', this.addPreviewBlocksAction.bind(this));
		this.view.addCallback('selectBlockAction', this.selectBlockAction.bind(this));
		this.view.addCallback('selectGroundAction', this.selectGroundAction.bind(this));
	}

	navToGameAction() {
		this.tetrisball.newGame();
		this.view.showGameView();
	}

	navToHighscoreAction() {
		this.view.showHighscoreView();
	}

	navToMenuAction() {
		this.view.showMenuView();
	}

	navToOptionsAction() {
		this.view.showOptionsView();
	}

	saveNameToHighscoreAction() {
		this.highscore.save();
	}

	applyNameToHighscoreAction(args) {
		this.highscore.applyName(args.content);
	}

	resetHighscoreAction() {
		this.highscore.reset();
	}

	setMusicAction() {
		this.options.music = !this.options.music;

		if (this.options.music) {
			this.sound.play('resources/music/track_01.mp3');
		} else {
			this.sound.stop();
		}
	}

	addPreviewBlocksAction() {
		this.tetrisball.addPreview();

		if (this.tetrisball.freeFields === 0) {
			this.highscore.initNewEntry(this.tetrisball.rounds, this.tetrisball.points);

			this.navToHighscoreAction();
		}
	}

	selectBlockAction(args) {
	}

	selectGroundAction(args) {
		let result = this.tetrisball.findWay(args.curX, args.curY, args.endX, args.endY);

		if (this.tetrisball.freeFields === 0) {
			this.highscore.initNewEntry(this.tetrisball.rounds, this.tetrisball.points);

			this.navToHighscoreAction();
		}

		return result;
	}
}

export default Controller;