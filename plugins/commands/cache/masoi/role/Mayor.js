import Villager from './Villager.js';

export default class Mayor extends Villager {
	constructor(options) {
		super({
			...options,
			...{}
		});
	}
};
