import Werewolf from './Werewolf.js';
import Villager from './Villager.js';

export default class Lycan extends Villager {
	constructor(options) {
		super({
			...options,
			...{
				role: Werewolf
			}
		});
	}
};
