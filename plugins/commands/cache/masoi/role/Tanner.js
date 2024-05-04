import { DeathType } from '../enum/index.js';
import Villager from './Villager.js';

export default class Tanner extends Villager {
	constructor(options) {
		super({
			...options,
			...{}
		});
	}

	async die(death) {
		await super.die(death);
		if (death.type == DeathType.LYNCH) {
			this.world.endGame([this]);
		}
	}
};
