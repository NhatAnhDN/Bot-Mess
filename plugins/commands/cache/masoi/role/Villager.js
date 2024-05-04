import { Party } from '../enum/index.js';
import Role from './Role.js';

export default class Villager extends Role {
	constructor(options) {
		super({
			...options,
			...{}
		});
	}

	isWin() {
		const werewolfCount = this.world.items.filter(
			player => !player.died && player.party == Party.WEREWOLF
		).length;
		return werewolfCount <= 0;
	}
};
