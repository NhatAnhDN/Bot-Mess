import Villager from './Villager.js';

export default class Pacifist extends Villager {
	constructor(options) {
		super({
			...options,
			...{}
		});
	}
};
