import Werewolf from './Werewolf.js';
import Villager from './Villager.js';

export default class Minion extends Werewolf {
	constructor(options) {
		super({
			...options,
			...{
				role: Villager
			}
		});
	}
};
