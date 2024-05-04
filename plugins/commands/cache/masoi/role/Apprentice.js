import { Seer } from '../ability/index.js';
import Goodseer from './Goodseer.js';
import Villager from './Villager.js';

export default class Apprentice extends Villager {
	constructor(options) {
		super({
			...options,
			...{}
		});
	}

	async onNight() {
		if(this.died) return []
		return this.isAlone() ? [await this.request(Seer)] : [];
	}

	isAlone() {
		const seers = this.world.items.filter(player => player.role == Goodseer);
		const alives = seers.filter(seer => !seer.died);
		return alives.length <= 0;
	}
};
