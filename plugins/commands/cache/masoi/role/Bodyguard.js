import { Protect } from '../ability/index.js';
import Villager from './Villager.js';

export default class Bodyguard extends Villager {
	constructor(options) {
		super({
			...options,
			...{}
		});
		this.lastProtectIndex = -1;
	}

	async onNight() {
		if(this.died) return []
		return [await this.request(Protect)];
	}
};
