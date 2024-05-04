import { Seer } from '../ability/index.js';
import Villager from './Villager.js';

export default class Goodseer extends Villager {
	constructor(options) {
		super({
			...options,
			...{
				// your configuration
			}
		});
	}

	async onNight() {
		if(this.died) return []
		return [await this.request(Seer)];
	}
};
