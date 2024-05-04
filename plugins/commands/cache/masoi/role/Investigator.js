import { Investigator as _Investigator } from '../ability/index.js';
import Villager from './Villager.js';

export default class Investigator extends Villager {
	constructor(options) {
		super({
			...options,
			...{}
		});
	}

	async onNight() {
		if(this.died) return []
		return [await this.request(_Investigator)];
	}
};
