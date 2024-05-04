import { Pair } from '../ability/index.js';
import Villager from './Villager.js';

export default class Cupid extends Villager {
	constructor(options) {
		super({
			...options,
			...{}
		});
		this.called = false;
		this.pairs = [];
	}

	async onNight() {
		if (!this.called) {
			const response = await this.request(Pair);
			if (response.value != null) this.called = true;
			return [response];
		}
		return [];
	}
};
